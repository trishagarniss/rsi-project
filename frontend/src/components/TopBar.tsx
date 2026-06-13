'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopBar() {
  const pathname = usePathname();
  
  // Breadcrumb dinamis berdasarkan URL (untuk menggantikan teks "Home About Contact")
  const getBreadcrumb = () => {
    if (pathname.includes('/students')) return 'Dashboard / Daftar Siswa';
    if (pathname.includes('/manage')) return 'Dashboard / Kelola Data';
    return 'Dashboard / Beranda';
  };

  return (
    <header className="h-[90px] bg-slate-50 flex items-center justify-between px-10 sticky top-0 z-40">
      
      {/* Kiri: Breadcrumb (Opsional, agar terlihat pro) */}
      <div className="hidden md:block text-sm font-bold text-slate-400">
        {getBreadcrumb()}
      </div>

      {/* Kanan: Utilitas Dashboard (Menggantikan menu publik yang salah di mockup) */}
      <div className="flex items-center gap-6 ml-auto">
        
        <Link href="/notification">
          <button className="relative p-2 text-slate-400 hover:text-asgard-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Titik merah notifikasi */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </Link>

        {/* Garis Pemisah */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Mini Profil Info */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <span className="text-sm font-bold text-slate-700 group-hover:text-asgard-primary transition-colors">Admin Area</span>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

      </div>
    </header>
  );
}