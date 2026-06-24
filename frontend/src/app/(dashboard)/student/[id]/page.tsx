"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, User, BookOpen, Clock, Wallet, Brain,
  Loader2, AlertCircle, Upload, RefreshCw,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { get, post } from "@/lib/api-client";
import RiskBadge from "@/components/ui/RiskBadge";
import Button from "@/components/ui/Button";
import UploadCsvModal from "@/components/UploadCsvModal";
import type { Student, StudentAcademic, StudentAttendance, StudentSocioEconomic } from "@/types/student";

interface PredictionRecord {
  id: string;
  student_id: string;
  model_id: string;
  risk_status: number;
  risk_score: number;
  created_at: string;
}

type RiskLevel = "Tinggi" | "Sedang" | "Rendah" | "Aman";

function fmtRisk(score: number): RiskLevel {
  const pct = score * 100;
  if (pct >= 80) return "Tinggi";
  if (pct >= 60) return "Sedang";
  if (pct >= 40) return "Rendah";
  return "Aman";
}

function fmtDate(ds?: string): string {
  if (!ds) return "-";
  return new Date(ds).toLocaleDateString("id-ID", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtCurr(v: number | null): string {
  if (v == null) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);
}

type TabKey = "biodata" | "akademik" | "absensi" | "ekonomi" | "prediksi";

const ACADEMIC_COLUMNS = ["semester", "academic_year", "average_score", "failed_subjects_count", "incomplete_assignments_count"];
const ACADEMIC_REQUIRED = ["semester", "academic_year", "average_score"];

const ATTENDANCE_COLUMNS = ["semester", "academic_year", "present_count", "sick_count", "excused_count", "unexcused_count", "attendance_percentage"];
const ATTENDANCE_REQUIRED = ["semester", "academic_year"];

const SOCIO_COLUMNS = ["parents_income", "monthly_expenses", "parents_education_level", "birth_order", "dependents_count", "has_kip_scholarship", "is_working_student", "has_internet_access", "distance_to_school_km", "housing_status", "transportation_mode"];
const SOCIO_REQUIRED: string[] = [];

export default function StudentDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const studentId = params?.id || "";

  const [activeTab, setActiveTab] = useState<TabKey>("biodata");

  const [student, setStudent] = useState<Student | null>(null);
  const [academics, setAcademics] = useState<StudentAcademic[]>([]);
  const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
  const [socio, setSocio] = useState<StudentSocioEconomic | null>(null);
  const [prediction, setPrediction] = useState<PredictionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload modals
  const [uploadModal, setUploadModal] = useState<"akademik" | "absensi" | "ekonomi" | null>(null);

  const loadData = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const [sr, ar, atr, sor, pr] = await Promise.allSettled([
        get<{ status: string; data: Student }>("/students/" + studentId),
        get<{ status: string; data: StudentAcademic[] }>("/academics/student/" + studentId),
        get<{ status: string; data: StudentAttendance[] }>("/attendances/student/" + studentId),
        get<{ status: string; data: StudentSocioEconomic }>("/socio-economics/student/" + studentId),
        get<{ status: string; data: PredictionRecord }>("/predictions/student/" + studentId),
      ]);

      if (sr.status === "fulfilled") setStudent(sr.value.data);
      if (ar.status === "fulfilled") setAcademics(ar.value.data);
      if (atr.status === "fulfilled") setAttendances(atr.value.data);
      if (sor.status === "fulfilled") setSocio(sor.value.data);
      if (pr.status === "fulfilled") setPrediction(pr.value.data);
    } catch {
      setError("Gagal memuat detail siswa.");
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => { loadData(); }, [loadData]);

  const triggerPrediction = async () => {
    try {
      await post("/predictions/student/" + studentId);
    } catch {
      // prediction may fail if data incomplete — ignore
    }
  };

  const handleImportAcademic = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      await post("/academics/", {
        student_id: studentId,
        semester: parseInt(row.semester),
        academic_year: row.academic_year,
        average_score: parseFloat(row.average_score),
        failed_subjects_count: row.failed_subjects_count ? parseInt(row.failed_subjects_count) : 0,
        incomplete_assignments_count: row.incomplete_assignments_count ? parseInt(row.incomplete_assignments_count) : 0,
      });
    }
    await loadData();
    await triggerPrediction();
    setActiveTab("prediksi");
  };

  const handleImportAttendance = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      await post("/attendances/", {
        student_id: studentId,
        semester: parseInt(row.semester),
        academic_year: row.academic_year,
        present_count: row.present_count ? parseInt(row.present_count) : 0,
        sick_count: row.sick_count ? parseInt(row.sick_count) : 0,
        excused_count: row.excused_count ? parseInt(row.excused_count) : 0,
        unexcused_count: row.unexcused_count ? parseInt(row.unexcused_count) : 0,
        attendance_percentage: row.attendance_percentage ? parseFloat(row.attendance_percentage) : null,
      });
    }
    await loadData();
    await triggerPrediction();
    setActiveTab("prediksi");
  };

  const handleImportSocio = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      await post("/socio-economics/", {
        student_id: studentId,
        parents_income: row.parents_income ? parseInt(row.parents_income) : null,
        monthly_expenses: row.monthly_expenses ? parseInt(row.monthly_expenses) : null,
        parents_education_level: row.parents_education_level || null,
        birth_order: row.birth_order ? parseInt(row.birth_order) : null,
        dependents_count: row.dependents_count ? parseInt(row.dependents_count) : null,
        has_kip_scholarship: row.has_kip_scholarship === "true" || row.has_kip_scholarship === "1" || false,
        is_working_student: row.is_working_student === "true" || row.is_working_student === "1" || false,
        has_internet_access: row.has_internet_access === "false" || row.has_internet_access === "0" ? false : true,
        distance_to_school_km: row.distance_to_school_km ? parseFloat(row.distance_to_school_km) : null,
        housing_status: row.housing_status || null,
        transportation_mode: row.transportation_mode || null,
      });
    }
    await loadData();
    await triggerPrediction();
    setActiveTab("prediksi");
  };

  // Loading / Error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-asgard-primary" />
        <span className="ml-3 text-sm font-bold text-slate-500">Memuat detail siswa...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-6 flex items-start gap-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-sm">Gagal memuat detail siswa</p>
          <p className="text-xs font-medium mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 text-amber-700 rounded-2xl p-6">
        <p className="font-extrabold text-sm">Siswa tidak ditemukan</p>
      </div>
    );
  }

  const riskLevel = prediction ? fmtRisk(prediction.risk_score) : "Aman";
  const genderLabel = student.gender === "male" ? "Laki-laki" : "Perempuan";

  const tabs: { key: TabKey; label: string; icon: typeof User }[] = [
    { key: "biodata", label: "Biodata", icon: User },
    { key: "akademik", label: "Akademik", icon: BookOpen },
    { key: "absensi", label: "Absensi", icon: Clock },
    { key: "ekonomi", label: "Ekonomi", icon: Wallet },
    { key: "prediksi", label: "Prediksi", icon: Brain },
  ];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-4">
        <button onClick={() => router.push("/student")} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-asgard-primary transition-colors w-fit">
          <ChevronLeft size={16} />
          Kembali ke Daftar Siswa
        </button>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-asgard-primary">{student.name}</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              NIS: {student.nis} • NISN: {student.nisn ?? "-"} • {genderLabel}
            </p>
          </div>
          <div className="flex gap-3">
            <RiskBadge level={riskLevel} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === t.key ? "border-asgard-primary text-asgard-primary" : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"}`}>
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* ======== BIODATA ======== */}
        {activeTab === "biodata" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-asgard-primary">Data Diri Siswa</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { label: "Nama Lengkap", value: student.name },
                { label: "NIS", value: student.nis },
                { label: "NISN", value: student.nisn || "-" },
                { label: "Jenis Kelamin", value: genderLabel },
                { label: "Tanggal Lahir", value: student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString("id-ID") : "-" },
                { label: "Alamat", value: student.address || "-" },
                { label: "Nama Orang Tua", value: student.parent_name || "-" },
                { label: "No. Telepon Orang Tua", value: student.parent_phone || "-" },
                { label: "Status", value: student.is_active ? "Aktif" : "Non-Aktif" },
              ].map((f) => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{f.label}</p>
                  <p className="text-sm font-extrabold text-slate-700 mt-1">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======== AKADEMIK ======== */}
        {activeTab === "akademik" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-asgard-primary">Riwayat Akademik</h3>
              <Button variant="outline" size="sm" className="border-asgard-primary text-asgard-primary flex items-center gap-2"
                onClick={() => setUploadModal("akademik")}>
                <Upload size={14} /> Import CSV
              </Button>
            </div>
            {academics.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <BookOpen size={36} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-400">Belum ada data akademik</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Import CSV untuk menambahkan data nilai siswa.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-black">Semester</th>
                      <th className="px-4 py-3 font-black">Tahun Ajaran</th>
                      <th className="px-4 py-3 font-black">Rata-rata Nilai</th>
                      <th className="px-4 py-3 font-black">Mapel Tidak Lulus</th>
                      <th className="px-4 py-3 font-black">Tugas Belum Selesai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {academics.sort((a, b) => b.semester - a.semester).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-bold text-slate-700">{r.semester}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.academic_year}</td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-700">{r.average_score.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.failed_subjects_count}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.incomplete_assignments_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======== ABSENSI ======== */}
        {activeTab === "absensi" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-asgard-primary">Riwayat Absensi</h3>
              <Button variant="outline" size="sm" className="border-asgard-primary text-asgard-primary flex items-center gap-2"
                onClick={() => setUploadModal("absensi")}>
                <Upload size={14} /> Import CSV
              </Button>
            </div>
            {attendances.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <Clock size={36} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-400">Belum ada data absensi</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Import CSV untuk menambahkan data kehadiran siswa.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-black">Smstr</th>
                      <th className="px-4 py-3 font-black">Tahun</th>
                      <th className="px-4 py-3 font-black">Hadir</th>
                      <th className="px-4 py-3 font-black">Sakit</th>
                      <th className="px-4 py-3 font-black">Izin</th>
                      <th className="px-4 py-3 font-black">Alpha</th>
                      <th className="px-4 py-3 font-black">% Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendances.sort((a, b) => b.semester - a.semester).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-bold text-slate-700">{r.semester}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.academic_year}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.present_count}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.sick_count}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.excused_count}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.unexcused_count}</td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-700">{r.attendance_percentage?.toFixed(1) ?? "-"}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======== EKONOMI ======== */}
        {activeTab === "ekonomi" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-asgard-primary">Data Sosial Ekonomi</h3>
              <Button variant="outline" size="sm" className="border-asgard-primary text-asgard-primary flex items-center gap-2"
                onClick={() => setUploadModal("ekonomi")}>
                <Upload size={14} /> Import CSV
              </Button>
            </div>
            {!socio ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <Wallet size={36} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-400">Belum ada data ekonomi</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Import CSV untuk menambahkan data sosio-ekonomi siswa.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Penghasilan Orang Tua", value: fmtCurr(socio.parents_income) },
                  { label: "Pengeluaran Bulanan", value: fmtCurr(socio.monthly_expenses) },
                  { label: "Pendidikan Orang Tua", value: socio.parents_education_level || "-" },
                  { label: "Anak Ke-", value: socio.birth_order ?? "-" },
                  { label: "Jumlah Tanggungan", value: socio.dependents_count ?? "-" },
                  { label: "Penerima KIP/KKS", value: socio.has_kip_scholarship ? "Ya" : "Tidak" },
                  { label: "Siswa Bekerja", value: socio.is_working_student ? "Ya" : "Tidak" },
                  { label: "Akses Internet", value: socio.has_internet_access ? "Ada" : "Tidak" },
                  { label: "Jarak ke Sekolah", value: socio.distance_to_school_km ? `${socio.distance_to_school_km} km` : "-" },
                  { label: "Status Tempat Tinggal", value: socio.housing_status || "-" },
                  { label: "Transportasi", value: socio.transportation_mode || "-" },
                ].map((f) => (
                  <div key={f.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{f.label}</p>
                    <p className="text-sm font-extrabold text-slate-700 mt-1">{f.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======== PREDIKSI ======== */}
        {activeTab === "prediksi" && (
          <div className="space-y-6">
            {!prediction ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                <Brain size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-base font-bold text-slate-400">Belum ada prediksi risiko</p>
                <p className="text-sm font-medium text-slate-400 mt-1">Lengkapi data akademik, absensi, dan ekonomi siswa terlebih dahulu, lalu lakukan prediksi.</p>
              </div>
            ) : (
              <>
                {/* Skor */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-lg font-black text-asgard-primary mb-6">Hasil Prediksi Risiko Dropout</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                        <circle cx="60" cy="60" r="54" fill="none" stroke={
                          prediction.risk_score >= 0.8 ? "#ef4444" :
                          prediction.risk_score >= 0.6 ? "#f59e0b" :
                          prediction.risk_score >= 0.4 ? "#10b981" : "#94a3b8"
                        } strokeWidth="8" strokeDasharray={`${prediction.risk_score * 339.292} 339.292`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-black text-slate-800">{Math.round(prediction.risk_score * 100)}%</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Skor Risiko</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <RiskBadge level={fmtRisk(prediction.risk_score)} />
                        <span className="text-sm font-bold text-slate-500">
                          {fmtDate(prediction.created_at)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                          <p className="text-sm font-extrabold text-slate-700 mt-1">
                            {prediction.risk_status === 1 ? "Berisiko" : "Aman"}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Model ID</p>
                          <p className="text-sm font-extrabold text-slate-700 mt-1 truncate">{prediction.model_id.slice(0, 12)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ringkasan data pendukung */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`rounded-2xl p-5 border-2 ${academics.length > 0 ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                    <BookOpen size={20} className={academics.length > 0 ? "text-emerald-500" : "text-slate-400"} />
                    <p className="text-sm font-extrabold text-slate-700 mt-2">Data Akademik</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{academics.length > 0 ? `${academics.length} semester` : "Belum ada data"}</p>
                  </div>
                  <div className={`rounded-2xl p-5 border-2 ${attendances.length > 0 ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                    <Clock size={20} className={attendances.length > 0 ? "text-emerald-500" : "text-slate-400"} />
                    <p className="text-sm font-extrabold text-slate-700 mt-2">Data Absensi</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{attendances.length > 0 ? `${attendances.length} semester` : "Belum ada data"}</p>
                  </div>
                  <div className={`rounded-2xl p-5 border-2 ${socio ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                    <Wallet size={20} className={socio ? "text-emerald-500" : "text-slate-400"} />
                    <p className="text-sm font-extrabold text-slate-700 mt-2">Data Ekonomi</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{socio ? "Tersedia" : "Belum ada data"}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Upload Modals */}
      <UploadCsvModal
        isOpen={uploadModal === "akademik"}
        onClose={() => setUploadModal(null)}
        title="Import Data Akademik"
        description="Upload CSV dengan kolom: semester, academic_year, average_score, failed_subjects_count, incomplete_assignments_count"
        expectedColumns={ACADEMIC_COLUMNS}
        requiredColumns={ACADEMIC_REQUIRED}
        onUpload={handleImportAcademic}
      />
      <UploadCsvModal
        isOpen={uploadModal === "absensi"}
        onClose={() => setUploadModal(null)}
        title="Import Data Absensi"
        description="Upload CSV dengan kolom: semester, academic_year, present_count, sick_count, excused_count, unexcused_count, attendance_percentage"
        expectedColumns={ATTENDANCE_COLUMNS}
        requiredColumns={ATTENDANCE_REQUIRED}
        onUpload={handleImportAttendance}
      />
      <UploadCsvModal
        isOpen={uploadModal === "ekonomi"}
        onClose={() => setUploadModal(null)}
        title="Import Data Sosial Ekonomi"
        description="Upload CSV dengan kolom: parents_income, monthly_expenses, parents_education_level, dll."
        expectedColumns={SOCIO_COLUMNS}
        requiredColumns={SOCIO_REQUIRED}
        onUpload={handleImportSocio}
      />
    </div>
  );
}
