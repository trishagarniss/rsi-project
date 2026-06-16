'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { get } from '@/lib/api-client';
import type { User } from '@/types/user';

const roleLabelMap: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  counselor: 'Konselor (BK)',
};

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    let isMounted = true;

    async function loadAccounts() {
      try {
        setIsLoading(true);
        const res = await get<{ status: string; data: User[] }>('/users/?skip=0&limit=100');
        if (isMounted) {
          setAccounts(res.data);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat akun pengguna.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAccounts();
    return () => { isMounted = false; };
  }, []);

  const filteredAccounts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch = !query || account.fullname.toLowerCase().includes(query) || account.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || account.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? account.is_active : !account.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [accounts, roleFilter, searchValue, statusFilter]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Memuat akun pengguna dari backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Gagal memuat akun</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Manajemen Akses Sekolah</h1>
          <p className="text-slate-500 font-medium mt-1">Daftar akun ditarik langsung dari tabel users backend.</p>
        </div>
        <Button variant="primary" className="whitespace-nowrap shadow-md hover:shadow-lg transition-all">
          + Daftarkan Staf Baru
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari nama staf atau email..." className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)} className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
            <option value="all">Semua Jabatan</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="counselor">Konselor (BK)</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Non-Aktif</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-5 font-black">Informasi Pengguna</th>
                <th className="px-6 py-5 font-black">Hak Akses (Role)</th>
                <th className="px-6 py-5 font-black">Status Akses</th>
                <th className="px-6 py-5 font-black">Terakhir Login</th>
                <th className="px-6 py-5 font-black text-center">Aksi Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((akun) => (
                <tr key={akun.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{akun.fullname}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{akun.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={'px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ' + (akun.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : akun.role === 'counselor' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200')}>
                      {roleLabelMap[akun.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={'w-2 h-2 rounded-full ' + (akun.is_active ? 'bg-emerald-500' : 'bg-red-400')}></span>
                      <span className="text-sm font-bold text-slate-600">{akun.is_active ? 'Aktif' : 'Non-Aktif'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{formatDateTime(akun.last_login_at)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 h-auto">Ubah Akses</Button>
                      <Button variant="danger" size="sm" className="text-xs px-3 py-1.5 h-auto bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white">Reset Sandi</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAccounts.length === 0 && (
          <div className="border-t border-slate-100 bg-slate-50/30 px-8 py-6 text-sm font-medium text-slate-500">
            Tidak ada akun yang cocok dengan filter saat ini.
          </div>
        )}
      </div>
    </div>
  );
}