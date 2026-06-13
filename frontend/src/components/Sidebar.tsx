'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Detect if current space is Superadmin based on path or user role
  const isSuperadmin = user?.role === 'superadmin' || 
    pathname.startsWith('/superadmin') || 
    pathname.startsWith('/monitoring') || 
    pathname.startsWith('/audit') || 
    pathname.startsWith('/models') || 
    pathname.startsWith('/tenants');

  const menuItems = isSuperadmin
    ? [
        { name: 'Beranda', path: '/superadmin' },
        { name: 'Kelola Instansi', path: '/tenants' },
        { name: 'Kelola Model', path: '/models' },
        { name: 'Monitoring', path: '/monitoring' },
      ]
    : [
        { name: 'Beranda', path: '/dashboard' },
        { name: 'Daftar Siswa', path: '/student' },
        { name: 'Manajemen Konseling', path: '/counseling' },
        { name: 'Laporan', path: '/reports' },
        { name: 'Import Data', path: '/import' },
        { name: 'Manajemen Akun', path: '/manage-accounts' },
        { name: 'Pengaturan', path: '/settings' },
      ];

  const adminName = user?.full_name || 'Kunto Rossindu';
  const roleLabel = user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin Sekolah' : 'Guru BK';
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'KR';

  return (
    <aside className="w-[260px] bg-asgard-primary text-white flex flex-col h-screen sticky top-0 flex-shrink-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
      
      {/* Logo Area (Sesuai Mockup) */}
      <div className="h-[90px] flex items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white flex items-center justify-center font-black text-asgard-primary shadow-sm">
            A
          </div>
          <span className="font-bold tracking-widest text-lg">A.S.G.A.R.D</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-8 flex flex-col gap-2">
        {menuItems.map((item) => {
          // Logika active state
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`px-8 py-4 font-bold text-sm transition-all duration-300 border-r-4 ${
                isActive
                  ? 'bg-asgard-secondary text-asgard-primary border-asgard-accent shadow-md' // Block kuning solid untuk menu aktif
                  : 'text-white/70 border-transparent hover:bg-white/5 hover:text-white hover:border-white/20' // Transparan jika tidak aktif
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Area (Sesuai Mockup di pojok kiri bawah) */}
      <div className="p-6 border-t border-white/5 bg-black/10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-asgard-secondary flex-shrink-0 flex items-center justify-center text-asgard-primary font-black shadow-inner">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{adminName}</p>
            <p className="text-[10px] font-bold text-asgard-secondary uppercase tracking-widest mt-0.5">{roleLabel}</p>
          </div>
        </div>
      </div>
      
    </aside>
  );
}