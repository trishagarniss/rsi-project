"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === "superadmin") {
        setIsAuthorized(true); // eslint-disable-line react-hooks/set-state-in-effect
      } else {
        setIsAuthorized(false);
        router.push("/dashboard");
      }
    } else {
      setIsAuthorized(false);
      router.push("/login");
    }
  }, [user, router]);

  if (isAuthorized === null) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF]">
        <Loader2 className="animate-spin text-asgard-primary mb-3" size={36} />
        <p className="text-slate-400 text-xs font-bold">Memeriksa hak akses...</p>
      </div>
    );
  }

  if (isAuthorized) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return null;
}
