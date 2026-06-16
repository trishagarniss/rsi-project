"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const TopBar = dynamic(() => import('@/components/TopBar'), { ssr: false });
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // If the auth context loading completes and user is verified
    const checkAuth = () => {
      if (user === null) {
        setIsAuthorized(false);
        router.push("/login");
      } else {
        if (user.role === "admin" || user.role === "counselor") {
          setIsAuthorized(true);
        } else if (user.role === "superadmin") {
          setIsAuthorized(false);
          router.push("/superadmin");
        } else {
          setIsAuthorized(false);
          router.push("/login");
        }
      }
    };

    setTimeout(checkAuth, 0);
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
      <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-asgard-secondary selection:text-asgard-primary">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          
          <main className="flex-1 p-10 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return null;
}