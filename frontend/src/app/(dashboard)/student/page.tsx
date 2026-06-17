"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Users, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Bottombar from "@/components/Bottombar";
import { studentService } from "@/services/student";
import { riskPredictionService } from "@/services/risk-prediction";

interface Student {
  id: string;
  nis: string;
  name: string;
  is_active: boolean;
}

interface StudentListResponse {
  status: string;
  data: Student[];
}

interface Prediction {
  student_id: string;
  risk_status: number;
}

interface PredictionListResponse {
  status: string;
  data: Prediction[];
}

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [predictions, setPredictions] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [predictLoading, setPredictLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [studentRes, predRes] = await Promise.all([
        studentService.getAll(0, 10000) as Promise<StudentListResponse>,
        (await import("@/services/risk-prediction")).riskPredictionService.getAll() as Promise<PredictionListResponse>,
      ]);
      if (studentRes.status === "success") setStudents(studentRes.data);
      if (predRes.status === "success") {
        const map = new Map<string, number>();
        for (const p of predRes.data) {
          map.set(p.student_id, p.risk_status);
        }
        setPredictions(map);
      }
    } catch {
      setErrorMsg("Gagal memuat data siswa.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(""), 5000); return () => clearTimeout(t); } }, [successMsg]);
  useEffect(() => { if (errorMsg) { const t = setTimeout(() => setErrorMsg(""), 7000); return () => clearTimeout(t); } }, [errorMsg]);

  const handlePredictAll = async () => {
    setPredictLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await riskPredictionService.predictAll();
      if (res.status === "success") {
        setSuccessMsg(`Prediksi selesai! ${res.data.success_count} berhasil, ${res.data.skipped_count} dilewati. ${res.data.skipped_details.length > 0 ? "Lihat detail di konsol." : ""}`);
        if (res.data.skipped_details.length > 0) {
          console.warn("Siswa dilewati:", res.data.skipped_details);
        }
        loadData();
      }
    } catch {
      setErrorMsg("Gagal menjalankan prediksi.");
    } finally {
      setPredictLoading(false);
    }
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedStudents = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-asgard-primary/5 border border-asgard-primary/10 text-asgard-primary text-xs font-bold uppercase tracking-widest mb-3">
            <Users size={14} />
            Manajemen Siswa
          </div>
          <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Data Siswa</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Daftar siswa dan status prediksi risiko putus sekolah.
          </p>
        </div>
        <button
          onClick={handlePredictAll}
          disabled={predictLoading}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-asgard-secondary hover:bg-asgard-accent text-asgard-primary font-black rounded-2xl text-sm transition-all duration-300 border-2 border-asgard-accent hover:border-asgard-secondary hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {predictLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CheckCircle size={18} strokeWidth={3} />
          )}
          {predictLoading ? "Memproses..." : "Prediksi Semua"}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <CheckCircle size={20} className="shrink-0 text-green-500" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-bold">
          <ShieldAlert size={20} className="shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-[28px] border-2 border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={36} className="text-asgard-primary animate-spin" />
              <p className="text-slate-400 text-xs font-bold">Memuat data siswa...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <p className="text-slate-800 font-black">Belum ada siswa</p>
              <p className="text-slate-400 text-xs mt-1 font-medium">Data siswa akan muncul setelah diimpor.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-asgard-primary text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-4 text-center w-[80px]">No</th>
                  <th className="px-6 py-4">NIS</th>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4 text-center">Status Risiko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.map((s, index) => {
                  const idx = (currentPage - 1) * itemsPerPage + index + 1;
                  const riskStatus = predictions.get(s.id);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group border-l-4 border-l-transparent hover:border-l-asgard-secondary">
                      <td className="px-8 py-4 text-center font-bold text-slate-400 text-sm">{idx}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-700 text-sm">{s.nis}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 text-sm">{s.name}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {riskStatus === undefined ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black border-2 rounded-xl bg-slate-50 text-slate-400 border-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Belum Diprediksi
                          </span>
                        ) : riskStatus === 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black border-2 rounded-xl bg-red-50 text-red-600 border-red-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Berisiko
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black border-2 rounded-xl bg-green-50 text-green-600 border-green-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Tidak Berisiko
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {students.length > 0 && (
          <Bottombar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            itemsPerPage={itemsPerPage}
            totalItems={students.length}
          />
        )}
      </div>
    </div>
  );
}
