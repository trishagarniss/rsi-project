import React from 'react';
import StatCard from '@/components/ui/StatCard';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';

// --- MOCK DATA ---
// Data ini nantinya akan diganti dengan data asli dari API FastAPI temanmu
const mockCriticalStudents = [
  { id: 1, nisn: '0051234567', nama: 'Budi Santoso', kelas: '12 IPA 1', risiko: 'Tinggi' },
  { id: 2, nisn: '0057654321', nama: 'Siti Aminah', kelas: '11 IPS 2', risiko: 'Tinggi' },
  { id: 3, nisn: '0069876543', nama: 'Andi Wijaya', kelas: '10 IPA 3', risiko: 'Sedang' },
  { id: 4, nisn: '0051122334', nama: 'Rina Melati', kelas: '12 Bahasa', risiko: 'Tinggi' },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= BARIS 1: STATISTIC CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Siswa Aktif" 
          value="1.908" 
          subtitle="Terdaftar pada sistem"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          }
        />
        <StatCard 
          title="Berisiko Tinggi" 
          value="128" 
          trend="up"
          subtitle="↑ 12 siswa dari bulan lalu"
          icon={
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
          }
        />
        <StatCard 
          title="Butuh Intervensi" 
          value="45" 
          trend="neutral"
          subtitle="Belum ada tindakan konseling"
          icon={
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          }
        />
      </div>

      {/* ================= BARIS 2: CHARTS (PLACEHOLDER MOCKUP) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Trend Prediksi */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[350px]">
          <h3 className="text-base font-black text-asgard-primary mb-6">Tren Prediksi Risiko Dropout</h3>
          
          {/* Placeholder Visual Grafik - Nanti kita ganti dengan library seperti Recharts */}
          <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 flex items-end justify-between px-8 pt-10 pb-4 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
               {/* Batang grafik tiruan */}
               {[40, 70, 45, 90, 65, 85].map((height, i) => (
                 <div key={i} className="w-10 bg-asgard-secondary rounded-t-md" style={{ height: `${height}%` }} />
               ))}
            </div>
            <p className="text-slate-400 font-bold z-10 bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">Area Grafik Tren (Membutuhkan Library)</p>
          </div>
        </div>

        {/* Chart 2: Distribusi Risiko */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[350px]">
          <h3 className="text-base font-black text-asgard-primary mb-6">Distribusi Tingkat Risiko</h3>
          
          {/* Placeholder Visual Pie Chart */}
          <div className="flex-1 flex items-center justify-center gap-8">
            <div className="w-40 h-40 rounded-full border-[16px] border-slate-100 border-t-red-400 border-r-amber-400 border-b-emerald-400 border-l-emerald-400 shadow-inner rotate-45 transform hover:scale-105 transition-transform" />
            <div className="space-y-3">
               <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><span className="w-3 h-3 rounded-full bg-red-400" /> Tinggi (15%)</div>
               <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><span className="w-3 h-3 rounded-full bg-amber-400" /> Sedang (25%)</div>
               <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><span className="w-3 h-3 rounded-full bg-emerald-400" /> Rendah (60%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BARIS 3: MINI TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-black text-asgard-primary">Siswa Peringatan Kritis Teratas</h3>
          <Button variant="outline" size="sm">Lihat Semua</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Nama Siswa</th>
                <th className="px-6 py-4 font-bold">NISN</th>
                <th className="px-6 py-4 font-bold">Kelas</th>
                <th className="px-6 py-4 font-bold">Prediksi Risiko</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCriticalStudents.map((siswa) => (
                <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-800">{siswa.nama}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{siswa.nisn}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{siswa.kelas}</td>
                  <td className="px-6 py-4">
                    {/* Menggunakan komponen RiskBadge dari Fase 1 */}
                    <RiskBadge level={siswa.risiko as 'Tinggi' | 'Sedang' | 'Rendah' | 'Aman'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* Menggunakan komponen Button dari Fase 1 */}
                    <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100">
                      Intervensi
                    </Button>
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