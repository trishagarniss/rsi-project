"use client";

import React, { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';
import {
  fetchAllStudents,
  fetchLatestPrediction,
  formatDateTime,
  formatRiskLabel,
  riskScoreToLevel,
  type StudentRecord,
  type RiskPredictionRecord,
} from '@/lib/dashboard-api';

type StudentWithPrediction = StudentRecord & {
  latestPrediction: RiskPredictionRecord | null;
  riskLevel: ReturnType<typeof riskScoreToLevel>;
};

export default function DashboardOverview() {
  const [students, setStudents] = useState<StudentWithPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);

        const studentRecords = await fetchAllStudents(100);
        const predictionPairs = await Promise.all(
          studentRecords.map(async (student) => ({
            studentId: student.id,
            prediction: await fetchLatestPrediction(student.id),
          }))
        );

        const studentMap = new Map(
          predictionPairs.map(({ studentId, prediction }) => [studentId, prediction])
        );

        const nextStudents = studentRecords.map((student) => {
          const latestPrediction = studentMap.get(student.id) ?? null;

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
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat data dashboard.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalStudents = students.length;
  const highRiskStudents = students.filter((student) => student.riskLevel === 'Tinggi');
  const interventionStudents = students.filter((student) => student.riskLevel !== 'Aman');

  const riskDistribution = {
    tinggi: highRiskStudents.length,
    sedang: students.filter((student) => student.riskLevel === 'Sedang').length,
    rendah: students.filter((student) => student.riskLevel === 'Rendah').length,
    aman: students.filter((student) => student.riskLevel === 'Aman').length,
  };

  const totalPredicted = students.filter((student) => student.latestPrediction).length || 1;
  const topCriticalStudents = [...students]
    .sort((left, right) => {
      const rightScore = right.latestPrediction?.risk_score ?? -1;
      const leftScore = left.latestPrediction?.risk_score ?? -1;
      return rightScore - leftScore;
    })
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Memuat data dashboard dari backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Gagal memuat dashboard</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= BARIS 1: STATISTIC CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Siswa Aktif" 
          value={totalStudents} 
          subtitle="Terdaftar pada sistem"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          }
        />
        <StatCard 
          title="Berisiko Tinggi" 
          value={highRiskStudents.length} 
          trend="up"
          subtitle="Berdasarkan prediksi terbaru"
          icon={
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
          }
        />
        <StatCard 
          title="Butuh Intervensi" 
          value={interventionStudents.length} 
          trend="neutral"
          subtitle="Prediksi terbaru masih aktif"
          icon={
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          }
        />
      </div>

      {/* ================= BARIS 2: CHARTS (PLACEHOLDER MOCKUP) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Trend Prediksi */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-87.5">
          <h3 className="text-base font-black text-asgard-primary mb-6">Tren Prediksi Risiko Dropout</h3>
          <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-6">
            <div className="grid grid-cols-2 gap-4 text-sm font-bold text-slate-600">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-slate-400">Siswa dengan prediksi</p>
                <p className="mt-2 text-3xl text-asgard-primary">{totalPredicted}</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-slate-400">Rata-rata status aman</p>
                <p className="mt-2 text-3xl text-emerald-600">{Math.round((riskDistribution.aman / Math.max(totalStudents, 1)) * 100)}%</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: 'Tinggi', count: riskDistribution.tinggi, bar: 'bg-red-500' },
                { label: 'Sedang', count: riskDistribution.sedang, bar: 'bg-amber-400' },
                { label: 'Rendah', count: riskDistribution.rendah, bar: 'bg-emerald-500' },
                { label: 'Aman', count: riskDistribution.aman, bar: 'bg-slate-300' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-16 text-xs font-black uppercase tracking-wider text-slate-500">{item.label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${item.bar}`}
                      style={{ width: `${Math.max((item.count / Math.max(totalStudents, 1)) * 100, item.count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-bold text-slate-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Distribusi Risiko */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-87.5">
          <h3 className="text-base font-black text-asgard-primary mb-6">Distribusi Tingkat Risiko</h3>
          <div className="flex-1 flex items-center justify-center gap-8">
            <div className="w-40 h-40 rounded-full border-16 border-slate-100 shadow-inner overflow-hidden">
              <div className="h-full w-full rotate-45" style={{
                background: `conic-gradient(#ef4444 0 ${Math.max((riskDistribution.tinggi / Math.max(totalStudents, 1)) * 100, 1)}%, #f59e0b ${Math.max((riskDistribution.tinggi / Math.max(totalStudents, 1)) * 100, 1)}% ${Math.max(((riskDistribution.tinggi + riskDistribution.sedang) / Math.max(totalStudents, 1)) * 100, 2)}%, #10b981 ${Math.max(((riskDistribution.tinggi + riskDistribution.sedang) / Math.max(totalStudents, 1)) * 100, 2)}% 100%)`,
              }} />
            </div>
            <div className="space-y-3 text-sm font-bold text-slate-600">
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400" /> Tinggi ({Math.round((riskDistribution.tinggi / Math.max(totalStudents, 1)) * 100)}%)</div>
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400" /> Sedang ({Math.round((riskDistribution.sedang / Math.max(totalStudents, 1)) * 100)}%)</div>
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400" /> Rendah/Aman ({Math.round(((riskDistribution.rendah + riskDistribution.aman) / Math.max(totalStudents, 1)) * 100)}%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BARIS 3: MINI TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-black text-asgard-primary">Siswa Peringatan Kritis Teratas</h3>
          <Button variant="outline" size="sm">Lihat Semua</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Nama Siswa</th>
                <th className="px-6 py-4 font-bold">NISN</th>
                <th className="px-6 py-4 font-bold">Kelas</th>
                <th className="px-6 py-4 font-bold">Prediksi Risiko</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topCriticalStudents.map((siswa) => (
                <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-800">{siswa.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{siswa.nisn ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{siswa.nis}</td>
                  <td className="px-6 py-4">
                    <RiskBadge level={siswa.riskLevel} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-xs font-semibold text-slate-400">
                        {formatDateTime(siswa.latestPrediction?.created_at)}
                      </span>
                      <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100">
                        Intervensi
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}