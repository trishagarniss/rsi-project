import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-asgard-secondary selection:text-asgard-primary">
      {/* Sidebar Kiri - Di-fix statis */}
      <Sidebar />

      {/* Area Konten Kanan */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar melayang di atas konten */}
        <TopBar />
        
        {/* Children adalah tempat halaman spesifik seperti /student akan dirender */}
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}