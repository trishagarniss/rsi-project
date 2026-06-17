'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ChevronDown, User, Settings, BookOpen, LogOut, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { notificationService } from '@/services/notification';
import { Notification } from '@/types/notification';

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const [recentNotifs, setRecentNotifs] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchRecent = async () => {
    try {
      const res = await notificationService.getRecentUnread(5);
      if (res.status === 'success') {
        setRecentNotifs(res.data);
        setUnreadCount(res.unread_count);
      }
    } catch {
      /* ignore polling errors */
    }
  };

  useEffect(() => {
    fetchRecent(); // eslint-disable-line react-hooks/set-state-in-effect
    const interval = setInterval(fetchRecent, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (pathname.includes('/profile')) return 'Profil Saya';
    if (pathname.includes('/guide')) return 'Panduan';
    if (pathname.includes('/student')) return 'Daftar Siswa';
    if (pathname.includes('/counseling')) return 'Manajemen Konseling';
    if (pathname.includes('/reports')) return 'Laporan';
    if (pathname.includes('/import')) return 'Import Data';
    if (pathname.includes('/manage-accounts')) return 'Manajemen Akun';
    if (pathname.includes('/settings')) return 'Pengaturan';
    if (pathname.includes('/monitoring')) return 'Server Monitoring';
    if (pathname.includes('/kelola-tenant')) return 'Kelola Tenant';
    if (pathname.includes('/kelola-akun')) return 'Kelola Akun';
    if (pathname.includes('/models')) return 'Kelola Model';
    if (pathname.includes('/notification')) return 'Notifikasi';
    if (pathname.includes('/audit')) return 'Audit Log';
    if (pathname.includes('/superadmin')) return 'Beranda';
    return 'Dashboard';
  };

  const getBreadcrumbPrefix = () => {
    if (pathname.includes('/profile') || pathname.includes('/guide')) return 'Superadmin';
    if (
      pathname.includes('/student') || pathname.includes('/counseling') ||
      pathname.includes('/reports') || pathname.includes('/import') ||
      pathname.includes('/manage-accounts') || pathname.includes('/settings')
    ) return 'Dashboard';
    if (pathname.includes('/audit') || pathname.includes('/models')) return 'Superadmin';
    return 'Superadmin Portal';
  };

// --- TAMBAHAN FIX HYDRATION ---
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const adminName = isMounted ? (user?.fullname || 'Admin') : 'Admin';
  const roleLabel = isMounted 
    ? (user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin Sekolah' : 'Guru BK') 
    : 'Memuat...';
  const initials = adminName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
 
  const handleLogout = async () => {
    setDropdownOpen(false);
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Profil Saya', icon: User, href: '/superadmin/profile' },
    { label: 'Pengaturan', icon: Settings, href: '/superadmin/settings' },
    { label: 'Panduan', icon: BookOpen, href: '/superadmin/guide' },
  ];

  return (
    <header className="h-[90px] bg-white/80 backdrop-blur-lg border-b-2 border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">

      <div className="flex items-center gap-4">
        <div className="w-1 h-10 bg-asgard-secondary rounded-full shrink-0" />
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">{getPageTitle()}</h2>
          <p className="text-xs font-bold text-slate-400">
            {getBreadcrumbPrefix()} <span className="mx-1.5 text-slate-300">/</span> {getPageTitle()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 text-slate-400 hover:text-asgard-primary transition-colors cursor-pointer"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full px-1 border-2 border-white leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border-2 border-slate-200 shadow-xl z-50">
              <div className="px-5 py-3 border-b-2 border-slate-100 flex items-center justify-between">
                <p className="text-sm font-extrabold text-slate-800">Notifikasi</p>
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        await notificationService.markAllRead();
                        setRecentNotifs([]);
                        setUnreadCount(0);
                      } catch { /* ignore */ }
                    }}
                    className="text-[10px] font-bold text-asgard-primary hover:underline"
                  >
                    Tandai Dibaca
                  </button>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {recentNotifs.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <Bell size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400">Tidak ada notifikasi baru</p>
                  </div>
                ) : (
                  recentNotifs.map((n) => {
                    const typeIcon = n.type === 'success' ? <CheckCircle size={14} className="text-green-500" />
                      : n.type === 'warning' ? <AlertTriangle size={14} className="text-amber-500" />
                      : n.type === 'error' ? <XCircle size={14} className="text-red-500" />
                      : <Info size={14} className="text-blue-500" />;
                    return (
                      <button
                        key={n.id}
                        onClick={async () => {
                          try {
                            await notificationService.markRead(n.id);
                            setRecentNotifs((prev) => prev.filter((x) => x.id !== n.id));
                            setUnreadCount((c) => Math.max(0, c - 1));
                          } catch { /* ignore */ }
                        }}
                        className="w-full flex items-start gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="mt-0.5 shrink-0">{typeIcon}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 leading-snug">{typeof n.title === 'string' ? n.title : ''}</p>
                          {typeof n.message === 'string' && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>}
                          <p className="text-[10px] text-slate-400 mt-1">
                            {new Date(n.created_at).toLocaleString('id-ID')}
                          </p>
                        </div>
                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-asgard-primary shrink-0 mt-1.5" />}
                      </button>
                    );
                  })
                )}
              </div>
              <div className="border-t-2 border-slate-100 pt-1">
                <button
                  onClick={() => { setNotifDropdownOpen(false); router.push('/superadmin/notification'); }}
                  className="w-full px-5 py-3 text-center text-xs font-bold text-asgard-primary hover:bg-slate-50 transition-colors rounded-b-2xl"
                >
                  Lihat Semua Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-7 w-px bg-slate-200" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="h-9 w-9 rounded-lg bg-asgard-secondary flex items-center justify-center text-asgard-primary font-black text-sm shrink-0">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-700 group-hover:text-asgard-primary transition-colors leading-tight">{adminName}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{roleLabel}</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 group-hover:text-asgard-primary transition-all hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border-2 border-slate-200 shadow-xl py-2 z-50">
              <div className="px-5 py-3 border-b-2 border-slate-100">
                <p className="text-sm font-extrabold text-slate-800">{adminName}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{roleLabel}</p>
              </div>
              <div className="py-1">
                {menuItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => { setDropdownOpen(false); router.push(item.href); }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-asgard-primary transition-colors"
                  >
                    <item.icon size={16} strokeWidth={2.5} />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="border-t-2 border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} strokeWidth={2.5} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}