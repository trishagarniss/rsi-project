'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { get } from '@/lib/api-client';
import type { Student } from '@/types/student';
import type { AuditLog } from '@/types/audit-log';
interface RiskPredictionRecord {
  id: string;
  student_id: string;
  model_id: string;
  risk_status: 'at_risk' | 'not_at_risk';
  risk_score: number;
  created_at: string;
}

type RiskLevel = 'Tinggi' | 'Sedang' | 'Rendah' | 'Aman';

function formatRiskLabel(risk_score: number, risk_status: string): RiskLevel {
  if (risk_status === 'not_at_risk') return 'Aman';
  if (risk_score >= 0.7) return 'Tinggi';
  if (risk_score >= 0.4) return 'Sedang';
  return 'Rendah';
}


type StudentWithPrediction = Student & {
  latestPrediction: RiskPredictionRecord | null;
  riskLevel: RiskLevel;
};

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ReportsAnalytics() {
  const [students, setStudents] = useState<StudentWithPrediction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReportsData() {
      try {
        setIsLoading(true);
        const [studentRes, auditRes] = await Promise.allSettled([
          get<{ status: string; data: Student[] }>('/students/?skip=0&limit=999999'),
          get<{ status: string; data: AuditLog[] }>('/audit-logs/?skip=0&limit=999999'),
        ]);

        const studentRecords = studentRes.status === 'fulfilled' ? studentRes.value.data : [];
        const logs = auditRes.status === 'fulfilled' ? auditRes.value.data : [];

        const predictionResults = await Promise.allSettled(
          studentRecords.map(async (student) => {
            try {
              const predRes = await get<{ status: string; data: RiskPredictionRecord }>('/predictions/student/' + student.id);
              return { studentId: student.id, prediction: predRes.data };
            } catch {
              return { studentId: student.id, prediction: null as RiskPredictionRecord | null };
            }
          })
        );

        const predictionMap = new Map<string, RiskPredictionRecord | null>();
        predictionResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            predictionMap.set(result.value.studentId, result.value.prediction);
          }
        });

        const nextStudents = studentRecords.map((student) => {
          const latestPrediction = predictionMap.get(student.id) ?? null;
          return {
            ...student,
            latestPrediction,
            riskLevel: latestPrediction
              ? formatRiskLabel(latestPrediction.risk_score, latestPrediction.risk_status)
              : 'Aman' as RiskLevel,
          };
        });

        if (isMounted) {
          setStudents(nextStudents);
          setAuditLogs(logs);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat laporan.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReportsData();
    return () => { isMounted = false; };
  }, []);
  const reportStats = useMemo(() => {
    const totalStudents = students.length;
    const highRiskStudents = students.filter((student) => student.riskLevel === 'Tinggi').length;
    const totalPredicted = students.filter((s) => s.latestPrediction).length;
    const activeLogs = auditLogs.filter((log) => /UPDATE|CREATE|LOGIN|UPLOAD|BULK/.test(log.action.toUpperCase())).length;
    return { totalStudents, highRiskStudents, totalPredicted, activeLogs };
  }, [auditLogs, students]);

  const riskDistribution = useMemo(() => [
    { label: 'Tinggi', count: students.filter((s) => s.riskLevel === 'Tinggi').length, color: 'bg-red-500' },
    { label: 'Sedang', count: students.filter((s) => s.riskLevel === 'Sedang').length, color: 'bg-amber-500' },
    { label: 'Rendah', count: students.filter((s) => s.riskLevel === 'Rendah').length, color: 'bg-yellow-500' },
    { label: 'Aman', count: students.filter((s) => s.riskLevel === 'Aman').length, color: 'bg-emerald-500' },
  ], [students]);

  const topRiskStudents = useMemo(() =>
    [...students].filter((s) => s.latestPrediction).sort((a, b) => (b.latestPrediction?.risk_score ?? 0) - (a.latestPrediction?.risk_score ?? 0)).slice(0, 5),
  [students]);

  const recentLogs = useMemo(() =>
    auditLogs.slice(0, 8),
  [auditLogs]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Memuat laporan dari backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Gagal memuat laporan</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Laporan & Analitik</h1>
          <p className="text-slate-500 font-medium mt-1">Ringkasan data yang dihitung langsung dari backend.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Siswa Dievaluasi</p>
          <h2 className="text-4xl font-black text-asgard-primary mt-2">{reportStats.totalStudents}</h2>
          <p className="text-xs font-bold text-emerald-500 mt-2 bg-emerald-50 w-fit px-2 py-1 rounded-md">Data dari students</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Risiko Tinggi</p>
          <h2 className="text-4xl font-black text-red-500 mt-2">{reportStats.highRiskStudents}</h2>
          <p className="text-xs font-bold text-red-500 mt-2 bg-red-50 w-fit px-2 py-1 rounded-md">Prediksi terbaru</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Prediksi</p>
          <h2 className="text-4xl font-black text-amber-500 mt-2">{reportStats.totalPredicted}</h2>
          <p className="text-xs font-bold text-amber-500 mt-2 bg-amber-50 w-fit px-2 py-1 rounded-md">Siswa sudah diprediksi</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Log Aktivitas</p>
          <h2 className="text-4xl font-black text-blue-500 mt-2">{reportStats.activeLogs}</h2>
          <p className="text-xs font-bold text-slate-400 mt-2 bg-slate-50 w-fit px-2 py-1 rounded-md">Tercatat di audit log</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-asgard-primary mb-4">Distribusi Risiko</h3>
          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-6">
            <div className="space-y-4">
              {riskDistribution.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-black uppercase tracking-wider text-slate-500">{item.label}</span>
                  <div className="h-3 flex-1 rounded-full bg-slate-200 overflow-hidden">
                    <div className={'h-full ' + item.color} style={{ width: Math.max((item.count / Math.max(reportStats.totalStudents, 1)) * 100, item.count > 0 ? 6 : 0) + '%' }} />
                  </div>
                  <span className="w-8 text-right text-sm font-bold text-slate-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-asgard-primary mb-4">Top 5 Risiko Tertinggi</h3>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-2 pr-2">Nama</th>
                  <th className="pb-2 pr-2">NIS</th>
                  <th className="pb-2 pr-2">Skor</th>
                  <th className="pb-2">Level</th>
                </tr>
              </thead>
              <tbody>
                {topRiskStudents.length === 0 && (
                  <tr><td colSpan={4} className="pt-4 text-center text-sm font-medium text-slate-400">Belum ada data prediksi.</td></tr>
                )}
                {topRiskStudents.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50">
                    <td className="py-2 pr-2 font-medium text-slate-800 truncate max-w-[140px]">{s.name}</td>
                    <td className="py-2 pr-2 text-slate-500">{s.nis}</td>
                    <td className="py-2 pr-2 font-bold">{Math.round((s.latestPrediction?.risk_score ?? 0) * 100)}%</td>
                    <td className="py-2">
                      <span className={'text-xs font-bold px-2 py-1 rounded-md ' + (
                        s.riskLevel === 'Tinggi' ? 'bg-red-100 text-red-600' :
                        s.riskLevel === 'Sedang' ? 'bg-amber-100 text-amber-600' :
                        s.riskLevel === 'Rendah' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-emerald-100 text-emerald-600'
                      )}>{s.riskLevel}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <h3 className="text-lg font-black text-asgard-primary mb-4">Log Aktivitas Terbaru</h3>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-2 pr-2">Aksi</th>
                <th className="pb-2 pr-2">Peran</th>
                <th className="pb-2 pr-2">User</th>
                <th className="pb-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.length === 0 && (
                <tr><td colSpan={4} className="pt-4 text-center text-sm font-medium text-slate-400">Belum ada log aktivitas.</td></tr>
              )}
              {recentLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-50">
                  <td className="py-2 pr-2"><span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600">{log.action}</span></td>
                  <td className="py-2 pr-2 text-slate-600 capitalize">{log.user_role || '-'}</td>
                  <td className="py-2 pr-2 text-slate-500 text-xs">{log.user_id.slice(0, 8)}...</td>
                  <td className="py-2 text-xs text-slate-400">{formatDateTime(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}