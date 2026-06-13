'use client';

import React from 'react';
import Button from '@/components/ui/Button';

// --- MOCK DATA ---
const mockNotifications = [
  {
    id: 1,
    tipe: 'Kritis',
    judul: 'Lonjakan Risiko Terdeteksi',
    pesan: 'Sistem AI mendeteksi 5 siswa di Kelas 11 IPS 2 mengalami penurunan akademik drastis dan peningkatan ketidakhadiran minggu ini.',
    waktu: '2 jam yang lalu',
    sudahDibaca: false,
  },
  {
    id: 2,
    tipe: 'Peringatan',
    judul: 'Tenggat Waktu Intervensi',
    pesan: 'Anda belum mencatat hasil tindak lanjut pemanggilan orang tua untuk siswa a.n. Andi Wijaya (Tenggat: 13 Juni 2026).',
    waktu: 'Kemarin, 14:30',
    sudahDibaca: false,
  },
  {
    id: 3,
    tipe: 'Info',
    judul: 'Pembaruan Data Berhasil',
    pesan: 'Berkas "Nilai_UAS_Semester_Genap.csv" berhasil diunggah dan diproses. 320 profil siswa telah diperbarui.',
    waktu: '10 Jun 2026, 09:15',
    sudahDibaca: true,
  },
  {
    id: 4,
    tipe: 'Peringatan',
    judul: 'Laporan Semesteran',
    pesan: 'Bulan ini adalah akhir semester. Jangan lupa untuk mengunduh laporan rekapitulasi penanganan BK.',
    waktu: '08 Jun 2026, 08:00',
    sudahDibaca: true,
  },
];

export default function NotificationCenter() {
  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Pusat Pemberitahuan</h1>
          <p className="text-slate-500 font-medium mt-1">Pantau peringatan sistem, jadwal intervensi, dan pembaruan data.</p>
        </div>
        
        <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200">
                Pengaturan Notifikasi
            </Button>
            <Button variant="primary" className="shadow-md">
                Tandai Semua Dibaca
            </Button>
        </div>
      </div>

      {/* ================= KONTROL FILTER ================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <button className="px-4 py-2 text-sm font-bold bg-asgard-primary text-white rounded-full transition-colors">
            Semua (4)
        </button>
        <button className="px-4 py-2 text-sm font-bold bg-white text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors">
            Belum Dibaca (2)
        </button>
        <button className="px-4 py-2 text-sm font-bold bg-white text-red-500 hover:bg-red-50 border border-slate-200 rounded-full transition-colors">
            Kritis
        </button>
      </div>

      {/* ================= DAFTAR NOTIFIKASI ================= */}
      <div className="space-y-4">
        {mockNotifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row gap-5 ${
                notif.sudahDibaca 
                ? 'bg-transparent border-slate-200 opacity-70' 
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
            }`}
          >
            
            {/* Ikon Urgensi */}
            <div className="flex-shrink-0 mt-1">
                {notif.tipe === 'Kritis' && (
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                )}
                {notif.tipe === 'Peringatan' && (
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                )}
                {notif.tipe === 'Info' && (
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                )}
            </div>

            {/* Konten Utama */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                        <h3 className={`text-base font-black ${notif.sudahDibaca ? 'text-slate-600' : 'text-slate-900'}`}>
                            {notif.judul}
                        </h3>
                        {/* Dot indicator untuk belum dibaca */}
                        {!notif.sudahDibaca && <span className="w-2 h-2 rounded-full bg-asgard-primary"></span>}
                    </div>
                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                        {notif.waktu}
                    </span>
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${notif.sudahDibaca ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                    {notif.pesan}
                </p>
                
                {/* Tombol Aksi Kontekstual */}
                {!notif.sudahDibaca && (
                    <div className="flex items-center gap-3">
                        {notif.tipe === 'Kritis' && <Button variant="danger" size="sm" className="text-xs">Lihat Daftar Siswa</Button>}
                        {notif.tipe === 'Peringatan' && <Button variant="secondary" size="sm" className="text-xs">Buka Modul Konseling</Button>}
                        {notif.tipe === 'Info' && <Button variant="outline" size="sm" className="text-xs">Lihat Detail</Button>}
                    </div>
                )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}