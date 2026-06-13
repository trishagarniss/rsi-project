import React from 'react';
import Link from 'next/link';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';

// --- MOCK DATA ---
// Simulasi data dari API agar tabel bisa langsung kita lihat bentuknya
const mockStudents = [
  { id: 1, nama: 'Budi Santoso', kelas: '12 IPA 1', risiko: 'Tinggi', update: '12 Mei 2026', status: 'Aktif' },
  { id: 2, nama: 'Siti Aminah', kelas: '11 IPS 2', risiko: 'Sedang', update: '11 Mei 2026', status: 'Aktif' },
  { id: 3, nama: 'Andi Wijaya', kelas: '10 IPA 3', risiko: 'Rendah', update: '10 Mei 2026', status: 'Aktif' },
  { id: 4, nama: 'Rina Melati', kelas: '12 Bahasa', risiko: 'Tinggi', update: '09 Mei 2026', status: 'Non-Aktif' },
  { id: 5, nama: 'Fajar Nugroho', kelas: '11 IPA 1', risiko: 'Aman', update: '08 Mei 2026', status: 'Aktif' },
];

export default function StudentList() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER & LEGEND ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Daftar Siswa</h1>
          <p className="text-slate-500 font-medium mt-1">Data seluruh siswa ditampilkan dalam bentuk tabel</p>
        </div>
        
        {/* Legend Informasi Risiko (Sesuai Mockup) */}
        <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> Risiko Tinggi</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> Risiko Sedang</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Risiko Rendah</span>
        </div>
      </div>

      {/* ================= BARIS FILTER & SEARCH ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Cari nama siswa atau NISN..." 
              className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400" 
            />
        </div>
        
        {/* Dropdowns & Action Button */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                <option>Semua Kelas</option>
                <option>Kelas 10</option>
                <option>Kelas 11</option>
                <option>Kelas 12</option>
            </select>
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                <option>Semua Risiko</option>
                <option>Tinggi</option>
                <option>Sedang</option>
                <option>Rendah</option>
            </select>
            
            {/* Tombol Jembatan Menuju Halaman Import */}
            <Link href="/import">
              <Button variant="outline" className="whitespace-nowrap border-asgard-primary text-asgard-primary hover:bg-asgard-primary/5">
                  Import Data Baru
              </Button>
            </Link>

            <Button variant="secondary" className="whitespace-nowrap">
                Unduh .csv
            </Button>
        </div>
      </div>

      {/* ================= TABEL DATA SISWA ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-5 font-black w-16">No.</th>
                <th className="px-6 py-5 font-black">Nama Siswa</th>
                <th className="px-6 py-5 font-black">Kelas</th>
                <th className="px-6 py-5 font-black">Tingkat Risiko</th>
                <th className="px-6 py-5 font-black">Terakhir Diupdate</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStudents.map((siswa, index) => (
                <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{siswa.nama}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{siswa.kelas}</td>
                  <td className="px-6 py-4">
                    {/* Menggunakan komponen RiskBadge yang sudah kita buat di Fase 1 */}
                    <RiskBadge level={siswa.risiko as any} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{siswa.update}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                        siswa.status === 'Aktif' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                        {siswa.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Bungkus Button dengan Link yang mengarah ke ID spesifik */}
                    <Link href={`/student/${siswa.id}`}>
                      <Button variant="outline" size="sm" className="text-xs px-4 py-2 h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                          Detail
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {/* Navigasi Pagination sesuai dokumen NFR NFR-02 yang membatasi 15 item per page */}
        <div className="px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <span className="text-sm font-bold text-slate-500">Menampilkan 1-5 dari 1.908 siswa</span>
            
            <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors">« Prev</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-asgard-primary text-white font-bold shadow-md">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors">3</button>
                <span className="px-1 text-slate-400 font-black">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors">128</button>
                <button className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors">Next »</button>
            </div>
        </div>
      </div>

    </div>
  );
}