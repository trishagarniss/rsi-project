'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';
import { get } from '@/lib/api-client';

// --- TIPE DATA ---
interface CounselingRow {
  id: string;
  name: string;
  nis: string;
  nisn: string | null;
  risk_score: number;
  riskLevel: 'Tinggi' | 'Sedang' | 'Rendah' | 'Aman';
  topik: string;
  tanggal: string;
}

// Fungsi pembantu klasifikasi risiko
const getRiskLevel = (score: number) => {
  if (score >= 80) return 'Tinggi';
  if (score >= 60) return 'Sedang';
  if (score >= 40) return 'Rendah';
  return 'Aman';
};

// Fungsi format tanggal sederhana
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function CounselingManagement() {
  const [sessions, setSessions] = useState<CounselingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State Filter
  const [searchValue, setSearchValue] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'Tinggi' | 'Sedang' | 'Rendah' | 'Aman'>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    let isMounted = true;

    async function loadCounselingData() {
      try {
        setIsLoading(true);

        // ==============================================================
        // FETCH PARALEL: Ambil data Siswa & Prediksi (Sama seperti Dashboard)
        // ==============================================================
        const [studentsResponse, predictionsResponse] = await Promise.all([
          get('/api/v1/students/?skip=0&limit=10000').catch(() => []),
          get('/api/v1/predictions/student/all').catch(() => get('/api/v1/predictions/?skip=0&limit=2000')).catch(() => [])
        ]);

        const studentsArray = Array.isArray(studentsResponse) ? studentsResponse : (studentsResponse.items || studentsResponse.data || []);
        const predictionsArray = Array.isArray(predictionsResponse) ? predictionsResponse : (predictionsResponse.items || predictionsResponse.data || []);

        // Proses Penggabungan Data
        const mergedData = studentsArray.map((student: any) => {
          // Cari prediksi terbaru untuk siswa ini
          const pred = predictionsArray.find((p: any) => p.student_id === student.id);
          const score = pred?.risk_score || 0;
          const level = getRiskLevel(score);

          return {
            id: student.id,
            name: student.name || 'Nama Tidak Diketahui',
            nis: student.nis || '-',
            nisn: student.nisn || '-',
            risk_score: score,
            riskLevel: level,
            tanggal: formatDate(pred?.created_at),
            topik: pred?.factors_summary || 'Belum ada catatan evaluasi kritis',
          };
        });

        // Urutkan: Siswa dengan risiko paling tinggi berada di urutan paling atas
        mergedData.sort((a: CounselingRow, b: CounselingRow) => b.risk_score - a.risk_score);

        if (isMounted) {
          setSessions(mergedData);
          setError(null);
        }

      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat data konseling.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCounselingData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, riskFilter]);

  // Logika Filter
  const filteredSessions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchesSearch = !query || session.name.toLowerCase().includes(query) || (session.nisn && session.nisn.toLowerCase().includes(query));
      const matchesRisk = riskFilter === 'all' || session.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [sessions, searchValue, riskFilter]);

  // Kalkulasi Pagination
  const totalPages = Math.max(Math.ceil(filteredSessions.length / pageSize), 1);
  const paginatedSessions = filteredSessions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstItemIndex = filteredSessions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItemIndex = Math.min(currentPage * pageSize, filteredSessions.length);

  // Summary Cards
  const summary = useMemo(() => ({
      total: sessions.length,
      tinggi: sessions.filter((s) => s.riskLevel === 'Tinggi').length,
      sedang: sessions.filter((s) => s.riskLevel === 'Sedang').length,
  }), [sessions]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500 animate-pulse">Sinkronisasi data siswa dengan model prediksi...</p>
      </div>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Gagal memuat data</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ================= BARIS 1: KARTU RINGKASAN ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Siswa Dipantau</p>
          <p className="mt-2 text-3xl font-black text-asgard-primary">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-red-50 p-5 shadow-sm border-l-4 border-l-red-500">
          <p className="text-xs font-bold uppercase tracking-wider text-red-500">Prioritas Panggilan (Tinggi)</p>
          <p className="mt-2 text-3xl font-black text-red-600">{summary.tinggi}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-amber-50 p-5 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Pantauan Ekstra (Sedang)</p>
          <p className="mt-2 text-3xl font-black text-amber-600">{summary.sedang}</p>
        </div>
      </div>
      
      {/* ================= BARIS FILTER & SEARCH ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Cari nama siswa atau NISN..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400" 
            />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
            >
                <option value="all">Semua Tingkat Risiko</option>
                <option value="Tinggi">Risiko Tinggi</option>
                <option value="Sedang">Risiko Sedang</option>
                <option value="Rendah">Risiko Rendah</option>
                <option value="Aman">Aman</option>
            </select>
        </div>
      </div>

      {/* ================= TABEL DATA KONSELING ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-5 font-black">Tanggal Evaluasi</th>
                <th className="px-6 py-5 font-black">Identitas Siswa</th>
                <th className="px-6 py-5 font-black">Tingkat Risiko</th>
                <th className="px-6 py-5 font-black w-1/3">Catatan Sistem (Faktor Risiko)</th>
                <th className="px-6 py-5 font-black text-center">Aksi Panggilan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSessions.map((sesi) => (
                <tr key={sesi.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{sesi.tanggal}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 uppercase">{sesi.name}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">NISN: {sesi.nisn ?? '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge level={sesi.riskLevel as any} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-600 line-clamp-2">{sesi.topik}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        {/* Tombol akan mengarah ke sistem generate surat nantinya */}
                        <Button 
                          variant={sesi.riskLevel === 'Tinggi' || sesi.riskLevel === 'Sedang' ? 'primary' : 'outline'} 
                          size="sm" 
                          className="text-xs px-4 py-2 h-auto w-full whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 mr-1.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          Cetak Surat
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {paginatedSessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">
                    Tidak ada data siswa yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <span className="text-sm font-bold text-slate-500">
            Menampilkan {firstItemIndex}-{lastItemIndex} dari {filteredSessions.length} siswa
          </span>
          <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50"
              >
                « Prev
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-asgard-primary text-white font-bold shadow-md">
                {currentPage}
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50"
              >
                Next »
              </button>
          </div>
      </div>

    </div>
  );
}