'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
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

function riskScoreToLevel(risk_score: number, risk_status: string): RiskLevel {
  return formatRiskLabel(risk_score, risk_status);
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
    const activeLogs = auditLogs.filter((log) => /UPDATE|CREATE|LOGIN|UPLOAD|BULK/.test(log.action.toUpperCase())).length;
    return { totalStudents, highRiskStudents, activeLogs };
  }, [auditLogs, students]);

  const reportItems = useMemo(() => {
    const latestRiskStudent = [...students].sort(
      (left, right) => (right.latestPrediction?.risk_score ?? 0) - (left.latestPrediction?.risk_score ?? 0)
    )[0];
    const latestAuditLog = auditLogs[0];
    return [
      {
        type: 'PDF',
        title: 'Rekapitulasi Siswa Risiko Tinggi',
        description: latestRiskStudent
          ? reportStats.highRiskStudents + ' siswa berisiko tinggi - ' + latestRiskStudent.name
          : 'Belum ada siswa berisiko tinggi yang tercatat.',
        date: latestRiskStudent?.latestPrediction?.created_at ?? null,
        accent: 'bg-red-100 text-red-600',
      },
      {
        type: 'CSV',
        title: 'Data Mentah Prediksi Keseluruhan',
        description: reportStats.totalStudents + ' siswa dievaluasi - data dari tabel students',
        date: null,
        accent: 'bg-emerald-100 text-emerald-600',
      },
      {
        type: 'LOG',
        title: 'Laporan Aktivitas Audit Sistem',
        description: auditLogs.length + ' log aktivitas tersimpan di backend',
        date: latestAuditLog?.created_at ?? null,
        accent: 'bg-blue-100 text-blue-600',
      },
    ];
  }, [auditLogs, reportStats.highRiskStudents, reportStats.totalStudents, students]);

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
    <div className="space-y-6 ">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Laporan & Analitik</h1>
          <p className="text-slate-500 font-medium mt-1">Ringkasan data yang dihitung langsung dari backend.</p>
        </div>
        <Button variant="primary" className="whitespace-nowrap shadow-md">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Buat Laporan Kustom
          </span>
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer transition-all">
          <option>Tahun Ajaran 2025/2026</option>
          <option>Tahun Ajaran 2024/2025</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer transition-all">
          <option>Semester Genap</option>
          <option>Semester Ganjil</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer transition-all">
          <option>Semua Kelas</option>
          <option>Kelas 10</option>
          <option>Kelas 11</option>
          <option>Kelas 12</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Siswa Dievaluasi</p>
          <h2 className="text-4xl font-black text-asgard-primary mt-2">{reportStats.totalStudents}</h2>
          <p className="text-xs font-bold text-emerald-500 mt-2 bg-emerald-50 w-fit px-2 py-1 rounded-md">Data diambil dari students</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tren Risiko Tinggi</p>
          <h2 className="text-4xl font-black text-red-500 mt-2">{reportStats.highRiskStudents}</h2>
          <p className="text-xs font-bold text-red-500 mt-2 bg-red-50 w-fit px-2 py-1 rounded-md">Berdasarkan prediksi terbaru</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Log Aktivitas Sistem</p>
          <h2 className="text-4xl font-black text-blue-500 mt-2">{reportStats.activeLogs}</h2>
          <p className="text-xs font-bold text-slate-400 mt-2">Tercatat di audit log tenant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-100">
          <h3 className="text-lg font-black text-asgard-primary mb-4">Distribusi Risiko per Angkatan</h3>
          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-6">
            <div className="space-y-4">
              {[
                { label: 'Tinggi', count: reportStats.highRiskStudents, color: 'bg-red-500' },
                { label: 'Aman', count: reportStats.totalStudents - reportStats.highRiskStudents, color: 'bg-emerald-500' },
              ].map((item) => (
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

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-100">
          <h3 className="text-lg font-black text-asgard-primary mb-4">Laporan Tersedia (Bulan Ini)</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {reportItems.map((item) => (
              <div key={item.title} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-asgard-primary/30 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={'w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs ' + item.accent}>{item.type}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.date && <span className="text-xs font-bold text-slate-400">{formatDateTime(item.date)}</span>}
                  <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Unduh</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}