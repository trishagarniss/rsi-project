'use client';

import React, { useState, use } from 'react'; // <-- Tambahkan use
import Link from 'next/link';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';

// 1. Ubah tipe params menjadi Promise<{ id: string }>
export default function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState('akademik');

  // 2. Buka bungkus params menggunakan React.use()
  const resolvedParams = use(params);

  // 3. Gunakan ID yang sudah diekstrak untuk mock data
  const studentInfo = {
    id: resolvedParams.id, // <-- Gunakan resolvedParams.id di sini
    nama: 'Budi Santoso',
    nisn: '0051234567',
    kelas: '12 IPA 1',
    waliKelas: 'Dra. Rini Susanti',
    risiko: 'Tinggi',
    status: 'Aktif',
    lastUpdate: '12 Mei 2026'
  };

  const tabs = [
    { id: 'akademik', label: 'Riwayat Akademik' },
    { id: 'sosek', label: 'Data Sosio-Ekonomi' },
    { id: 'konseling', label: 'Riwayat Konseling' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER & BREADCRUMB ================= */}
      <div className="flex flex-col gap-4">
        <Link href="/student" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-asgard-primary transition-colors w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Daftar Siswa
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-asgard-primary">{studentInfo.nama}</h1>
              <p className="text-slate-500 font-medium mt-1">NISN: {studentInfo.nisn} • Kelas: {studentInfo.kelas}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-200">Unduh Laporan PDF</Button>
              <Button variant="danger">Intervensi Segera</Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= KARTU PROFIL KIRI (SIDE PANEL) ================= */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Status Risiko</h3>
                    <RiskBadge level={studentInfo.risiko as 'Tinggi' | 'Sedang' | 'Rendah' | 'Aman'} />
                </div>
                
                <div className="space-y-4">
                    <div className="pb-4 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase">Wali Kelas</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">{studentInfo.waliKelas}</p>
                    </div>
                    <div className="pb-4 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase">Terakhir Diperbarui</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">{studentInfo.lastUpdate}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Status Keaktifan</p>
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {studentInfo.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* ================= AREA TABS KANAN (MAIN CONTENT) ================= */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            
            {/* Header Tabs */}
            <div className="flex border-b border-slate-100 px-2 pt-2 bg-slate-50/50 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'border-asgard-primary text-asgard-primary' 
                                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Konten Tabs Dinamis */}
            <div className="p-8 flex-1 min-h-[400px]">
                {activeTab === 'akademik' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="text-lg font-black text-asgard-primary mb-4">Grafik Nilai & Kehadiran</h3>
                        <div className="w-full h-48 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                             <p className="text-slate-400 font-bold text-sm">Area Modul Grafik Akademik</p>
                        </div>
                    </div>
                )}

                {activeTab === 'sosek' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="text-lg font-black text-asgard-primary mb-4">Indikator Sosio-Ekonomi</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                                <p className="text-xs font-bold text-slate-400 uppercase">Penerima KIP/KKS</p>
                                <p className="text-base font-black text-slate-700 mt-1">Ya (Aktif)</p>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                                <p className="text-xs font-bold text-slate-400 uppercase">Penghasilan Orang Tua</p>
                                <p className="text-base font-black text-slate-700 mt-1">&lt; Rp 1.500.000</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'konseling' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-asgard-primary">Riwayat Penanganan BK</h3>
                            <Button variant="secondary" size="sm">Tambah Catatan Baru</Button>
                        </div>
                        <div className="p-6 rounded-xl border border-amber-200 bg-amber-50">
                            <div className="flex items-center gap-3 mb-2">
                                <RiskBadge level="Tinggi" />
                                <span className="text-sm font-bold text-amber-700">10 Mei 2026</span>
                            </div>
                            <p className="text-sm text-amber-900 font-medium leading-relaxed">
                                Siswa terpantau absen selama 3 hari berturut-turut. Konselor telah melakukan panggilan pertama kepada orang tua, namun belum ada respon. Direkomendasikan untuk home visit jika tidak ada perubahan minggu depan.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

    </div>
  );
}