'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, Building2, Brain, Users, ClipboardList,
  Activity, Settings2, GraduationCap, MessageSquareMore,
  BarChart3, Upload, UserCog, PanelLeftClose, PanelLeft, BookOpen, Bell
} from 'lucide-react';

const superadminMenu = [
  { name: 'Beranda', path: '/superadmin', icon: LayoutDashboard },
  { name: 'Kelola Tenant', path: '/superadmin/kelola-tenant', icon: Building2 },
  { name: 'Kelola Model', path: '/models', icon: Brain },
  { name: 'Kelola Akun', path: '/superadmin/kelola-akun', icon: Users },
  { name: 'Notifikasi', path: '/superadmin/notification', icon: Bell },
  { name: 'Audit Log', path: '/audit', icon: ClipboardList },
  { name: 'Monitoring', path: '/superadmin/monitoring', icon: Activity },
  { name: 'Panduan', path: '/superadmin/guide', icon: BookOpen },
];

const adminMenu = [
  { name: 'Beranda', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Manajemen Siswa', path: '/student', icon: GraduationCap },
  { name: 'Prediksi Risiko', path: '/prediction', icon: Brain },
  { name: 'Laporan', path: '/reports', icon: BarChart3 },
  { name: 'Manajemen Akun', path: '/manage-accounts', icon: UserCog },
  { name: 'Notifikasi', path: '/notification', icon: Bell },
  { name: 'Panduan', path: '/guide', icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', collapsed ? 'true' : 'false');
  }, [collapsed]);

  const isSuperadmin = user?.role === 'superadmin' ||
    pathname.startsWith('/superadmin') ||
    pathname.startsWith('/audit') ||
    pathname.startsWith('/models');

  const menuItems = isSuperadmin ? superadminMenu : adminMenu;

  return (
    <aside className={`${collapsed ? 'w-[72px]' : 'w-[260px]'} bg-asgard-primary text-white flex flex-col h-screen sticky top-0 flex-shrink-0 z-50 transition-all duration-300`}>
      
      {/* Logo + Toggle */}
      <div className={`h-[90px] flex items-center border-b border-white/10 transition-all duration-300 ${collapsed ? 'justify-center px-0' : 'justify-between px-5'}`}>
        {collapsed ? (
          <Image src="/icon.png" alt="ASGARD" width={28} height={28} className="object-contain" />
        ) : (
          <div className="flex-1 flex justify-center">
            <Image src="/Logo-ASGARD.png" alt="ASGARD Logo" width={140} height={45} className="object-contain" priority />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-white/40 hover:text-white transition-colors ${collapsed ? 'hidden' : ''}`}
          title={collapsed ? 'Buka' : 'Tutup'}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 flex flex-col gap-1 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname === `${item.path}/`;
          const Icon = item.icon;

          return (
            <div key={item.name} className="relative mx-3 group">
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 font-bold text-sm transition-all duration-200 rounded-2xl whitespace-nowrap ${
                  isActive
                    ? 'bg-asgard-secondary text-asgard-primary'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center w-12 h-12 mx-auto p-0 rounded-xl' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`transition-opacity duration-200 ${collapsed ? 'hidden' : ''}`}>
                  {item.name}
                </span>
              </Link>
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] shadow-lg pointer-events-none">
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Floating toggle when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute -right-3 top-[38px] w-6 h-6 rounded-full bg-asgard-primary border-2 border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all cursor-pointer"
          title="Buka Sidebar"
        >
          <PanelLeft size={12} />
        </button>
      )}
      
    </aside>
  );
}
