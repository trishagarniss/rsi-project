'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NewCounselingSession() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER & BREADCRUMB ================= */}
      <div className="flex flex-col gap-4">
        <Link href="/counseling" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-asgard-primary transition-colors w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Tabel Konseling
        </Link>
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Tambah Catatan Konseling</h1>
          <p className="text-slate-500 font-medium mt-1">Isi detail sesi bimbingan atau intervensi siswa di bawah ini.</p>
        </div>
      </div>

      {/* ================= FORM AREA ================= */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <form className="space-y-6">
            
            {/* Baris 1: Pilihan Siswa & Tanggal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Pilih Siswa <span className="text-red-500">*</span></label>
                    <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary focus:ring-2 focus:ring-asgard-primary/20 transition-all">
                        <option value="">-- Ketik atau pilih nama siswa --</option>
                        <option>Budi Santoso (12 IPA 1)</option>
                        <option>Rina Melati (12 Bahasa)</option>
                        <option>Andi Wijaya (10 IPA 3)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Tanggal Sesi <span className="text-red-500">*</span></label>
                    <input 
                        type="date" 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary focus:ring-2 focus:ring-asgard-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Baris 2: Topik Utama & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Topik Konseling <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        placeholder="Contoh: Penurunan nilai rapor, Masalah keluarga..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary focus:ring-2 focus:ring-asgard-primary/20 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Status Penanganan <span className="text-red-500">*</span></label>
                    <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary focus:ring-2 focus:ring-asgard-primary/20 transition-all">
                        <option value="menunggu">Menunggu Tindak Lanjut</option>
                        <option value="pantauan">Dalam Pantauan</option>
                        <option value="selesai">Selesai</option>
                    </select>
                </div>
            </div>

            {/* Baris 3: Deskripsi / Catatan */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Catatan Detail Konselor</label>
                <textarea 
                    rows={5}
                    placeholder="Tuliskan hasil wawancara, respon siswa, atau rencana tindakan selanjutnya di sini..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary focus:ring-2 focus:ring-asgard-primary/20 transition-all resize-y"
                ></textarea>
            </div>

            {/* Divider */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link href="/counseling">
                    <Button type="button" variant="outline" className="border-slate-200 hover:bg-slate-50">
                        Batal
                    </Button>
                </Link>
                <Button type="button" variant="primary" className="px-8 shadow-md hover:shadow-lg">
                    Simpan Catatan
                </Button>
            </div>

        </form>
      </div>
    </div>
  );
}