'use client';

import React from 'react';
import Button from '@/components/ui/Button';

// --- MOCK DATA ---
const mockAccounts = [
  { id: 1, nama: 'Kepala IT Sekolah', email: 'admin@sman1-asgard.edu', role: 'Admin', status: 'Aktif', lastLogin: '12 Jun 2026, 08:30' },
  { id: 2, nama: 'Dra. Rini Susanti', email: 'rini.bk@sman1-asgard.edu', role: 'Konselor (BK)', status: 'Aktif', lastLogin: '11 Jun 2026, 14:15' },
  { id: 3, nama: 'Budi Operator', email: 'tu@sman1-asgard.edu', role: 'Admin TU', status: 'Aktif', lastLogin: '12 Jun 2026, 07:05' },
];

export default function ManageAccounts() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Manajemen Akses Sekolah</h1>
          <p className="text-slate-500 font-medium mt-1">Portal eksklusif Admin untuk membuat dan mengelola akun staf TU serta Guru BK.</p>
        </div>
        
        <Button variant="primary" className="whitespace-nowrap shadow-md hover:shadow-lg transition-all">
            + Daftarkan Staf Baru
        </Button>
      </div>

      {/* ================= BARIS FILTER & SEARCH ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Cari nama staf atau email..." 
              className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400" 
            />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                <option>Semua Jabatan</option>
                <option>Admin</option>
                <option>Konselor (BK)</option>
                <option>Admin TU</option>
            </select>
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Non-Aktif</option>
            </select>
        </div>
      </div>

      {/* ================= TABEL DATA AKUN ================= */}
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
              {mockAccounts.map((akun) => (
                <tr key={akun.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{akun.nama}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{akun.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${
                        akun.role === 'Admin' 
                            ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                            : akun.role === 'Konselor (BK)'
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                        {akun.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${akun.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                        <span className="text-sm font-bold text-slate-600">{akun.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{akun.lastLogin}</td>
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
      </div>

    </div>
  );
}