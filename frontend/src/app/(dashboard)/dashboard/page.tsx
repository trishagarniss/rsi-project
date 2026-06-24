"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import {
  Users, AlertTriangle, Activity, TrendingUp, UserCheck,
  BookOpen, Clock, AlertCircle, ChevronRight,
  Loader2, UserMinus, UserPlus,
} from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import StatCard from "@/components/ui/StatCard";

const PIE_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#94a3b8"];
const BAR_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#94a3b8"];

function Counter({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const display = value;
  return <span className={className}>{display}{suffix}</span>;
}

export default function DashboardPage() {
  const router = useRouter();

  const { data: raw, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await dashboardService.getAdminSummary();
      return res.data;
    },
    refetchInterval: 60000,
  });

  const pieData = useMemo(() => {
    if (!raw) return [];
    return [
      { name: "Tinggi", value: raw.predictions.tinggi },
      { name: "Sedang", value: raw.predictions.sedang },
      { name: "Rendah", value: raw.predictions.rendah },
      { name: "Aman", value: raw.predictions.aman },
    ].filter((d) => d.value > 0);
  }, [raw]);

  const barData = useMemo(() => {
    if (!raw) return [];
    return [
      { name: "Tinggi", count: raw.predictions.tinggi, fill: "#ef4444" },
      { name: "Sedang", count: raw.predictions.sedang, fill: "#f59e0b" },
      { name: "Rendah", count: raw.predictions.rendah, fill: "#10b981" },
      { name: "Aman", count: raw.predictions.aman, fill: "#94a3b8" },
    ];
  }, [raw]);

  const completenessData = useMemo(() => {
    if (!raw) return [];
    const max = raw.students.total_active || 1;
    return [
      { name: "Data Akademik", value: raw.data_completeness.with_academic, percentage: Math.round((raw.data_completeness.with_academic / max) * 100), fill: "#6366f1" },
      { name: "Data Absensi", value: raw.data_completeness.with_attendance, percentage: Math.round((raw.data_completeness.with_attendance / max) * 100), fill: "#8b5cf6" },
      { name: "Data Ekonomi", value: raw.data_completeness.with_socio_economic, percentage: Math.round((raw.data_completeness.with_socio_economic / max) * 100), fill: "#a855f7" },
    ];
  }, [raw]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-asgard-primary" />
        <span className="ml-3 text-sm font-bold text-slate-500">Memuat data dashboard...</span>
      </div>
    );
  }

  if (error || !raw) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-6 flex items-start gap-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-sm">Gagal memuat dashboard</p>
          <p className="text-xs font-medium mt-1">{error instanceof Error ? error.message : "Terjadi kesalahan"}</p>
        </div>
      </div>
    );
  }

  const needIntervention = raw.predictions.tinggi + raw.predictions.sedang;
  const riskPercentage = raw.predictions.total_predicted > 0
    ? Math.round((needIntervention / raw.predictions.total_predicted) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* ===== BARIS 1: KPI CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Siswa Aktif"
          value={<Counter value={raw.students.total_active} />}
          subtitle={`${raw.students.total_inactive} non-aktif`}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Berisiko Tinggi"
          value={<Counter value={raw.predictions.tinggi} />}
          subtitle={`${raw.predictions.total_predicted} sudah diprediksi`}
          trend="up"
          icon={<AlertTriangle size={20} />}
        />
        <StatCard
          title="Butuh Intervensi"
          value={<Counter value={needIntervention} />}
          subtitle={`${riskPercentage}% dari total prediksi`}
          trend="up"
          icon={<Activity size={20} />}
        />
        <StatCard
          title="Rata-rata Skor"
          value={<Counter value={Math.round(raw.predictions.average_risk_score * 100)} suffix="%" />}
          subtitle="Skor risiko rata-rata"
          trend="neutral"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Konselor Aktif"
          value={<Counter value={raw.users.total_counselors} />}
          subtitle="Tenaga pendidik"
          icon={<UserCheck size={20} />}
        />
      </div>

      {/* ===== BARIS 2: CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE: Distribusi Risiko */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-black text-asgard-primary mb-4">Distribusi Tingkat Risiko</h3>
          {raw.predictions.total_predicted === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm font-bold">
              Belum ada data prediksi
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                    formatter={(value) => [`${value} siswa`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 min-w-[140px]">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {item.name}
                    <span className="ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BAR: Perbandingan Risiko */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-black text-asgard-primary mb-4">Perbandingan Tingkat Risiko</h3>
          {raw.predictions.total_predicted === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm font-bold">
              Belum ada data prediksi
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ===== BARIS 3: ACADEMIC + ATTENDANCE + DATA COMPLETENESS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic & Attendance Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-black text-asgard-primary mb-4">Ringkasan Akademik & Kehadiran</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-5 border border-indigo-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-indigo-500" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Nilai Rata-rata</span>
              </div>
              <p className="text-3xl font-black text-indigo-700">
                {raw.academic_summary.average_score !== null
                  ? raw.academic_summary.average_score
                  : "—"}
              </p>
              <p className="text-xs font-bold text-indigo-500 mt-1">
                {raw.academic_summary.students_with_data} siswa punya data
              </p>
              <p className="text-xs font-semibold text-red-500 mt-1">
                {raw.academic_summary.students_with_failures} siswa dengan nilai gagal
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-purple-500" />
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">Kehadiran Rata-rata</span>
              </div>
              <p className="text-3xl font-black text-purple-700">
                {raw.attendance_summary.average_percentage !== null
                  ? `${raw.attendance_summary.average_percentage}%`
                  : "—"}
              </p>
              <p className="text-xs font-bold text-purple-500 mt-1">
                {raw.attendance_summary.students_with_data} siswa punya data
              </p>
            </div>
          </div>
        </div>

        {/* Data Completeness */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-black text-asgard-primary mb-4">Kelengkapan Data Siswa</h3>
          <p className="text-xs font-bold text-slate-400 mb-4">
            Dari {raw.students.total_active} siswa aktif
          </p>
          <div className="space-y-5">
            {completenessData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                  <span className="text-xs font-black text-slate-500">{item.value} / {raw.students.total_active}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.fill,
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== BARIS 4: TABEL KRITIS + AKTIVITAS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Critical */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-black text-asgard-primary">Siswa Peringatan Kritis</h3>
            <button
              onClick={() => router.push("/student")}
              className="text-[11px] font-bold text-asgard-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua <ChevronRight size={14} />
            </button>
          </div>
          {raw.predictions.top_critical.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm font-bold text-slate-400">
              <Users size={32} className="mx-auto text-slate-300 mb-2" />
              Belum ada data siswa berisiko
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {raw.predictions.top_critical.map((siswa, idx) => (
                <div
                  key={siswa.student_id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => router.push(`/student/${siswa.student_id}`)}
                >
                  <span className="w-6 h-6 rounded-lg bg-red-50 text-red-600 text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-slate-800 truncate">{siswa.name}</p>
                    <p className="text-[11px] font-medium text-slate-400">NISN: {siswa.nisn || "-"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-red-500">{Math.round(siswa.risk_score * 100)}%</p>
                    <p className="text-[10px] font-bold text-red-400">Skor Risiko</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-black text-asgard-primary">Aktivitas Terbaru</h3>
            <button
              onClick={() => router.push("/notification")}
              className="text-[11px] font-bold text-asgard-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua <ChevronRight size={14} />
            </button>
          </div>
          {raw.recent_activities.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm font-bold text-slate-400">
              <Clock size={32} className="mx-auto text-slate-300 mb-2" />
              Belum ada aktivitas
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
              {raw.recent_activities.map((act) => {
                const actionLower = act.action.toLowerCase();
                const actionColor =
                  actionLower.includes("delete") ? "text-red-500 bg-red-50" :
                  actionLower.includes("create") ? "text-emerald-500 bg-emerald-50" :
                  actionLower.includes("login") ? "text-blue-500 bg-blue-50" :
                  "text-amber-500 bg-amber-50";
                return (
                  <div key={act.id} className="flex items-start gap-3 px-6 py-3.5">
                    <div className={`w-7 h-7 rounded-lg ${actionColor} flex items-center justify-center shrink-0 mt-0.5`}>
                      {actionLower.includes("delete") ? <UserMinus size={14} /> :
                       actionLower.includes("create") ? <UserPlus size={14} /> :
                       actionLower.includes("login") ? <UserCheck size={14} /> :
                       <Activity size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 leading-snug">
                        <span className="uppercase">{act.action}</span>{" "}
                        <span className="text-slate-500">{act.entity_name || ""}</span>
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">{act.user_name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {act.created_at ? new Date(act.created_at).toLocaleString("id-ID") : "-"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
