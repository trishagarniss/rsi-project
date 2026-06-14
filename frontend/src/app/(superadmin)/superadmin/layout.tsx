"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // If the user context is loaded, check authorization
    if (user) {
      if (user.role === "superadmin") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        router.push("/dashboard");
      }
    } else {
      setIsAuthorized(false);
      router.push("/login");
    }
  }, [user, router]);

  // Show loading while checking authorization status
  if (isAuthorized === null) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-[#161D6F] mb-3 animate-[spin_1s_linear_infinite]" size={36} />
        <p className="text-slate-400 text-xs font-bold">Memeriksa hak akses...</p>
      </div>
    );
  }

  // If authorized, render children
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Fallback to empty if not authorized (redirecting)
  return null;
}
