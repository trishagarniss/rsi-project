'use client';

import React from 'react';
import Button from '@/components/ui/Button';

export default function ReportsAnalytics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Laporan & Analitik</h1>
          <p className="text-slate-500 font-medium mt-1">Pusat unduh rekapitulasi data akademik dan status risiko siswa.</p>
        </div>
        
        <Button variant="primary" className="whitespace-nowrap shadow-md">
            <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                Buat Laporan Kustom
            </span>
        </Button>
      </div>

      {/* ================= FILTER PERIODE ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer transition-all">
            <option>Tahun Ajaran 2025/2026</option>
            <option>Tahun Ajaran 2024/2025</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer transition-all">
            <option>Semester Genap</option>
            <option>Semester Ganjil</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer transition-all">
            <option>Semua Kelas</option>
            <option>Kelas 10</option>
            <option>Kelas 11</option>
            <option>Kelas 12</option>
        </select>
      </div>

      {/* ================= METRIK SINGKAT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Siswa Dievaluasi</p>
            <h2 className="text-4xl font-black text-asgard-primary mt-2">1.908</h2>
            <p className="text-xs font-bold text-emerald-500 mt-2 bg-emerald-50 w-fit px-2 py-1 rounded-md">Data 100% Lengkap</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tren Risiko Tinggi</p>
            <h2 className="text-4xl font-black text-red-500 mt-2">128</h2>
            <p className="text-xs font-bold text-red-500 mt-2 bg-red-50 w-fit px-2 py-1 rounded-md">Naik 12% dari semester lalu</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Intervensi Selesai</p>
            <h2 className="text-4xl font-black text-blue-500 mt-2">312</h2>
            <p className="text-xs font-bold text-slate-400 mt-2">Oleh Tim Konselor BK</p>
        </div>
      </div>

      {/* ================= AREA UNDUH LAPORAN ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Placeholder Grafik Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-lg font-black text-asgard-primary mb-4">Distribusi Risiko per Angkatan</h3>
            <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                <p className="text-slate-400 font-bold text-sm">Area Grafik Laporan (Recharts/Chart.js)</p>
            </div>
        </div>

        {/* Daftar Laporan Tersedia */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-lg font-black text-asgard-primary mb-4">Laporan Tersedia (Bulan Ini)</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                
                {/* Item Laporan 1 */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-asgard-primary/30 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-black text-xs">PDF</div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Rekapitulasi Siswa Risiko Tinggi</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">Dihasilkan otomatis: 13 Jun 2026</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Unduh</Button>
                </div>

                {/* Item Laporan 2 */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-asgard-primary/30 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">CSV</div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Data Mentah Prediksi Keseluruhan</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">Seluruh kelas • 1.908 baris</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Unduh</Button>
                </div>

                {/* Item Laporan 3 */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-asgard-primary/30 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-black text-xs">PDF</div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Laporan Aktivitas Konseling BK</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">Semester Genap 2025/2026</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Unduh</Button>
                </div>

            </div>
        </div>

      </div>

    </div>
  );
}