"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';
import {
  fetchAllStudents,
  fetchLatestPrediction,
  formatDateTime,
  formatRiskLabel,
  riskScoreToLevel,
  type RiskPredictionRecord,
  type StudentRecord,
} from '@/lib/dashboard-api';

type StudentWithPrediction = StudentRecord & {
  latestPrediction: RiskPredictionRecord | null;
  riskLevel: ReturnType<typeof riskScoreToLevel>;
};

export default function StudentList() {
  const [students, setStudents] = useState<StudentWithPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'Tinggi' | 'Sedang' | 'Rendah' | 'Aman'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      try {
        setIsLoading(true);

        const studentRecords = await fetchAllStudents(100);
        const predictionPairs = await Promise.all(
          studentRecords.map(async (student) => ({
            studentId: student.id,
            prediction: await fetchLatestPrediction(student.id),
          }))
        );

        const predictionMap = new Map(
          predictionPairs.map(({ studentId, prediction }) => [studentId, prediction])
        );

        const nextStudents = studentRecords.map((student) => {
          const latestPrediction = predictionMap.get(student.id) ?? null;

          return {
            ...student,
            latestPrediction,
            riskLevel: latestPrediction
              ? formatRiskLabel(latestPrediction.risk_score, latestPrediction.is_at_risk)
              : 'Aman',
          };
        });

        if (isMounted) {
          setStudents(nextStudents);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat data siswa.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, riskFilter, genderFilter, statusFilter]);

  const filteredStudents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.nis.toLowerCase().includes(query) ||
        student.nisn?.toLowerCase().includes(query);
      const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
      const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? student.is_active : !student.is_active);

      return matchesSearch && matchesRisk && matchesGender && matchesStatus;
    });
  }, [students, searchValue, riskFilter, genderFilter, statusFilter]);

  const totalPages = Math.max(Math.ceil(filteredStudents.length / pageSize), 1);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstItemIndex = filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItemIndex = Math.min(currentPage * pageSize, filteredStudents.length);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2)
  );

  const riskCounts = {
    tinggi: students.filter((student) => student.riskLevel === 'Tinggi').length,
    sedang: students.filter((student) => student.riskLevel === 'Sedang').length,
    rendah: students.filter((student) => student.riskLevel === 'Rendah').length,
    aman: students.filter((student) => student.riskLevel === 'Aman').length,
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Memuat daftar siswa dari backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Gagal memuat daftar siswa</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER & LEGEND ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Daftar Siswa</h1>
          <p className="text-slate-500 font-medium mt-1">Data seluruh siswa ditarik langsung dari database backend</p>
        </div>
        
        {/* Legend Informasi Risiko (Sesuai Mockup) */}
        <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> Risiko Tinggi ({riskCounts.tinggi})</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> Risiko Sedang ({riskCounts.sedang})</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Risiko Rendah ({riskCounts.rendah + riskCounts.aman})</span>
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
            <select
              value={genderFilter}
              onChange={(event) => setGenderFilter(event.target.value as typeof genderFilter)}
              className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
            >
                <option value="all">Semua Gender</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
            </select>
            <select
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value as typeof riskFilter)}
              className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
            >
                <option value="all">Semua Risiko</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
                <option value="Aman">Aman</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
            >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Non-Aktif</option>
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
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-5 font-black w-16">No.</th>
                <th className="px-6 py-5 font-black">Nama Siswa</th>
                <th className="px-6 py-5 font-black">NIS / NISN</th>
                <th className="px-6 py-5 font-black">Gender</th>
                <th className="px-6 py-5 font-black">Tingkat Risiko</th>
                <th className="px-6 py-5 font-black">Prediksi Terakhir</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.map((siswa, index) => (
                <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">{firstItemIndex + index}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{siswa.name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    <div className="flex flex-col">
                      <span>{siswa.nis}</span>
                      <span className="text-xs font-medium text-slate-400">{siswa.nisn ?? '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    {siswa.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge level={siswa.riskLevel} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {formatDateTime(siswa.latestPrediction?.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                        siswa.is_active 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                        {siswa.is_active ? 'Aktif' : 'Non-Aktif'}
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
            <span className="text-sm font-bold text-slate-500">
              Menampilkan {firstItemIndex}-{lastItemIndex} dari {filteredStudents.length} siswa
            </span>
            
            <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  « Prev
                </button>
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors ${
                      page === currentPage
                        ? 'bg-asgard-primary text-white shadow-md'
                        : 'text-slate-600 hover:text-asgard-primary hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Next »
                </button>
            </div>
        </div>
      </div>

    </div>
  );
}