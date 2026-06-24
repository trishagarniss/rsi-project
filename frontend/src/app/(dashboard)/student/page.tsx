"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { get } from "@/lib/api-client";
import RiskBadge from "@/components/ui/RiskBadge";
import Button from "@/components/ui/Button";

interface StudentItem {
  id: string;
  name: string;
  nis: string;
  nisn: string | null;
  gender: "male" | "female";
  riskLevel: string;
  riskScore: number | null;
  is_active: boolean;
}

function getRiskLevel(score: number): string {
  if (score >= 80) return "Tinggi";
  if (score >= 60) return "Sedang";
  if (score >= 40) return "Rendah";
  return "Aman";
}

export default function StudentList() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setIsLoading(true);
        const [studentsRes, predictionsRes] = await Promise.allSettled([
          get<any>("/students/?skip=0&limit=2000"),
          get<any>("/predictions/student/all"),
        ]);

        const studentArray = studentsRes.status === "fulfilled"
          ? (Array.isArray(studentsRes.value) ? studentsRes.value : studentsRes.value.data || studentsRes.value.items || [])
          : [];

        const predArray = predictionsRes.status === "fulfilled"
          ? (Array.isArray(predictionsRes.value) ? predictionsRes.value : predictionsRes.value.data || predictionsRes.value.items || [])
          : [];

        const predMap = new Map<string, any>();
        for (const p of predArray) {
          predMap.set(p.student_id, p);
        }

        const formatted: StudentItem[] = studentArray.map((s: any) => {
          const pred = predMap.get(s.id);
          const score = pred ? Math.round((pred.risk_score || 0) * 100) : null;
          return {
            id: s.id,
            name: s.name || "N/A",
            nis: s.nis || "-",
            nisn: s.nisn || "-",
            gender: s.gender || "male",
            riskLevel: score !== null ? getRiskLevel(score) : "Belum Dievaluasi",
            riskScore: score,
            is_active: s.is_active !== false,
          };
        });

        if (mounted) {
          setStudents(formatted);
          setError(null);
        }
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Gagal memuat data.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchValue, genderFilter, riskFilter]);

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return students.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.nis.toLowerCase().includes(q) && !(s.nisn && s.nisn.toLowerCase().includes(q))) return false;
      if (genderFilter !== "all" && s.gender !== genderFilter) return false;
      if (riskFilter !== "all" && s.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [students, searchValue, genderFilter, riskFilter]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstIdx = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-asgard-primary" />
        <span className="ml-3 text-sm font-bold text-slate-500">Memuat data siswa...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-6 flex items-start gap-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-sm">Gagal memuat data</p>
          <p className="text-xs font-medium mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-asgard-primary">Manajemen Siswa</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">{students.length} siswa terdaftar</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-asgard-primary text-asgard-primary" onClick={() => router.push("/import")}>
            Import Data
          </Button>
          <Button variant="primary" className="shadow-md">
            + Tambah Siswa
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
          <Search size={16} className="text-slate-400" />
          <input type="text" placeholder="Cari nama, NIS, atau NISN..." value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value as any)}
            className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm">
            <option value="all">Semua Gender</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm">
            <option value="all">Semua Risiko</option>
            <option value="Tinggi">Tinggi</option>
            <option value="Sedang">Sedang</option>
            <option value="Rendah">Rendah</option>
            <option value="Aman">Aman</option>
            <option value="Belum Dievaluasi">Belum Dievaluasi</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-5 font-black w-14">No.</th>
                <th className="px-6 py-5 font-black">Nama Siswa</th>
                <th className="px-6 py-5 font-black">NIS / NISN</th>
                <th className="px-6 py-5 font-black">Gender</th>
                <th className="px-6 py-5 font-black">Tingkat Risiko</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => router.push(`/student/${s.id}`)}>
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">{firstIdx + idx}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 uppercase">{s.name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    <span>{s.nis}</span>
                    {s.nisn && <span className="text-xs font-medium text-slate-400 ml-2">• {s.nisn}</span>}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    {s.gender === "male" ? "Laki-laki" : "Perempuan"}
                  </td>
                  <td className="px-6 py-4">
                    {s.riskLevel === "Belum Dievaluasi" ? (
                      <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                        Belum Evaluasi
                      </span>
                    ) : (
                      <RiskBadge level={s.riskLevel as any} />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border ${s.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                      {s.is_active ? "Aktif" : "Non-Aktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-asgard-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Detail →
                    </span>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center font-bold text-slate-400">
                    <Users size={32} className="mx-auto text-slate-300 mb-2" />
                    Tidak ada data siswa
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-500">
          Menampilkan {firstIdx}-{Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} siswa
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          {pageNums.map((p) => (
            <button key={p} onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors text-sm ${p === currentPage ? "bg-asgard-primary text-white shadow-md" : "text-slate-600 hover:text-asgard-primary hover:bg-slate-100"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
