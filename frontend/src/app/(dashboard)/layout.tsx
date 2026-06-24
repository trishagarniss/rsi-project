"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}