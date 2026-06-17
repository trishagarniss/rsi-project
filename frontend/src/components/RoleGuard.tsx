'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: ('admin' | 'counselor' | 'superadmin')[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Tunggu sampai data user dimuat
    if (user) {
      if (allowedRoles.includes(user.role as any)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    } else {
      // Jika status loading selesai dan user null, arahkan ke login
      const timeout = setTimeout(() => {
        if (!user) {
          router.push('/login');
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [user, allowedRoles, router]);

  useEffect(() => {
    // Jika tidak terautentikasi dan data auth sudah selesai memuat (tidak ada user)
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-asgard-primary mb-3" size={36} />
        <p className="text-slate-400 text-xs font-bold">Memeriksa hak akses...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 border border-red-100 shadow-sm">
          <ShieldAlert size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Akses Ditolak</h3>
        <p className="text-slate-500 font-medium max-w-sm text-sm mb-6">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini hanya dapat diakses oleh: <strong className="capitalize">{allowedRoles.join(', ')}</strong>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
