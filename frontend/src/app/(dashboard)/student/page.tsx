'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';
import { get } from '@/lib/api-client';

// --- TIPE DATA SESUAI JSON BACKEND SAAT INI ---
interface StudentRecord {
  id: string; // Biasanya backend tetap mengirimkan ID, atau kita pakai NIS sebagai key
  name: string;
  nis: string;
  nisn: string | null;
  gender: 'male' | 'female';
  is_active: boolean;
  riskLevel: 'Berisiko' | 'Aman' | 'Belum Dievaluasi';
}

export default function StudentList() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States Filter
  const [searchValue, setSearchValue] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      try {
        setIsLoading(true);

        // ==============================================================
        // FETCH DATA SISWA & PREDIKSI RISIKO DARI BACKEND
        // ==============================================================
        const [studentsResponse, predictionsResponse] = await Promise.all([
          get('/api/v1/students/?skip=0&limit=100').catch(() => []),
          get('/api/v1/predictions/student/all').catch(() => get('/api/v1/predictions/?skip=0&limit=10000')).catch(() => [])
        ]);

        const extractArray = (res: any) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (res.data && Array.isArray(res.data)) return res.data;
          if (res.data?.items && Array.isArray(res.data.items)) return res.data.items;
          if (res.items && Array.isArray(res.items)) return res.items;
          return [];
        };

        const studentArray = extractArray(studentsResponse);
        const predictionsArray = extractArray(predictionsResponse);

        // Mapping JSON dari backend ke state Frontend menggunakan Logika Biner
        const formattedStudents = studentArray.map((student: any, index: number) => {
          const pred = predictionsArray.find((p: any) => p.student_id === student.id);
          let riskLevel: 'Berisiko' | 'Aman' | 'Belum Dievaluasi' = 'Belum Dievaluasi';

          if (pred) {
            const rawScore = pred.risk_score !== undefined ? pred.risk_score : (pred.risk_status ?? 0);
            const isAtRisk = (
              pred.risk_status === 'at_risk' ||
              pred.is_at_risk === true ||
              rawScore === 1 ||
              rawScore === '1' ||
              rawScore >= 50
            );
            riskLevel = isAtRisk ? 'Berisiko' : 'Aman';
          }

          return {
            id: student.id || `temp-id-${index}`,
            name: student.name || 'Nama Tidak Diketahui',
            nis: student.nis || '-',
            nisn: student.nisn || '-',
            gender: student.gender || 'male',
            is_active: student.is_active !== undefined ? student.is_active : true,
            riskLevel
          };
        });

        if (isMounted) {
          setStudents(formattedStudents);
          setError(null);
        }

      } catch (loadError) {
        if (isMounted) {
          console.error("Gagal menarik data asli:", loadError);
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat data siswa.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, genderFilter]);

  // Logika Filter (Hanya untuk Search & Gender karena Risiko belum jalan)
  const filteredStudents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.nis.toLowerCase().includes(query) ||
        (student.nisn && student.nisn.toLowerCase().includes(query));

      const matchesGender = genderFilter === 'all' || student.gender === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [students, searchValue, genderFilter]);

  // Kalkulasi Pagination
  const totalPages = Math.max(Math.ceil(filteredStudents.length / pageSize), 1);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstItemIndex = filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItemIndex = Math.min(currentPage * pageSize, filteredStudents.length);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2)
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Memuat ratusan data siswa asli dari server...</p>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Koneksi Database Gagal</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Daftar Siswa</h1>
          <p className="text-slate-500 font-medium mt-1">Data ditarik langsung dari tabel <code className="bg-slate-100 text-pink-600 px-1 rounded">students</code> PostgreSQL</p>
        </div>
      </div>

      {/* ================= BARIS FILTER & SEARCH ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Cari nama siswa atau NIS/NISN..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50"
          >
            <option value="all">Semua Gender</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>

          <Link href="/import">
            <Button variant="outline" className="whitespace-nowrap border-asgard-primary text-asgard-primary hover:bg-asgard-primary/5">
              Import Data
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= TABEL DATA SISWA ASLI ================= */}
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
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.map((siswa, index) => (
                <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">{firstItemIndex + index}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 uppercase">{siswa.name}</td>
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
                    {siswa.riskLevel === 'Belum Dievaluasi' ? (
                      <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                        Belum Dievaluasi
                      </span>
                    ) : (
                      // Mengelabui RiskBadge lama: Jika Berisiko kirim string 'Tinggi' agar berwarna merah
                      <RiskBadge level={siswa.riskLevel === 'Berisiko' ? 'Tinggi' : 'Aman' as any} />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/student/${siswa.id}`}>
                      {/* FIX: Menghapus opacity-0 group-hover:opacity-100 agar tombol selalu terlihat */}
                      <Button variant="outline" size="sm" className="text-xs px-4 py-2 h-auto">
                        Detail
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}

              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center font-bold text-slate-400">
                    Tidak ada data siswa yang ditemukan.
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
          Menampilkan {firstItemIndex}-{lastItemIndex} dari {filteredStudents.length} siswa (Database Nyata)
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50"
          >
            « Prev
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors ${page === currentPage
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
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50"
          >
            Next »
          </button>
        </div>
      </div>

    </div>
  );
}