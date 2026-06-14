'use client';

import React from 'react';
import Link from 'next/link';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';

// --- MOCK DATA ---
const mockCounseling = [
  { id: 1, tanggal: '12 Mei 2026', nama: 'Budi Santoso', kelas: '12 IPA 1', risiko: 'Tinggi', topik: 'Absensi & Motivasi Belajar', status: 'Menunggu Tindak Lanjut' },
  { id: 2, tanggal: '10 Mei 2026', nama: 'Rina Melati', kelas: '12 Bahasa', risiko: 'Tinggi', topik: 'Masalah Ekonomi Keluarga', status: 'Selesai' },
  { id: 3, tanggal: '08 Mei 2026', nama: 'Andi Wijaya', kelas: '10 IPA 3', risiko: 'Sedang', topik: 'Adaptasi Lingkungan', status: 'Dalam Pantauan' },
  { id: 4, tanggal: '05 Mei 2026', nama: 'Siti Aminah', kelas: '11 IPS 2', risiko: 'Sedang', topik: 'Penurunan Nilai Akademik', status: 'Selesai' },
];

export default function CounselingManagement() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= BARIS FILTER & SEARCH ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Cari nama siswa atau topik konseling..." 
              className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400" 
            />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                <option>Semua Status</option>
                <option>Menunggu Tindak Lanjut</option>
                <option>Dalam Pantauan</option>
                <option>Selesai</option>
            </select>
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                <option>Bulan Ini</option>
                <option>Bulan Lalu</option>
                <option>Semester Ini</option>
            </select>
        </div>
      </div>

      {/* ================= TABEL DATA KONSELING ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-5 font-black">Tanggal</th>
                <th className="px-6 py-5 font-black">Nama Siswa</th>
                <th className="px-6 py-5 font-black">Tingkat Risiko</th>
                <th className="px-6 py-5 font-black">Topik Konseling</th>
                <th className="px-6 py-5 font-black">Status Penanganan</th>
                <th className="px-6 py-5 font-black text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCounseling.map((sesi) => (
                <tr key={sesi.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{sesi.tanggal}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{sesi.nama}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{sesi.kelas}</p>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge level={sesi.risiko as any} />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{sesi.topik}</td>
                  <td className="px-6 py-4">
                    <span className={`whitespace-nowrap px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${
                        sesi.status === 'Selesai' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : sesi.status === 'Dalam Pantauan'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                        {sesi.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 h-auto">Detail</Button>
                        <Button variant="secondary" size="sm" className="text-xs px-3 py-1.5 h-auto">Surat</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <span className="text-sm font-bold text-slate-500">Menampilkan 1-4 dari 45 catatan</span>
            <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors">« Prev</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-asgard-primary text-white font-bold shadow-md">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors">2</button>
                <button className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors">Next »</button>
            </div>
        </div>
      </div>

    </div>
  );
}