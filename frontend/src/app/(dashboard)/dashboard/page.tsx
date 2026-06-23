"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';
import { get } from '@/lib/api-client';

// --- TIPE DATA BINER ---
interface DashboardSummary {
  totalStudents: number;
  riskDistribution: {
    berisiko: number;
    aman: number;
  };
  topCriticalStudents: any[];
}

export default function DashboardOverview() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk memicu animasi grafik setelah data siap
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);

        const [studentsResponse, predictionsResponse, countResponse] = await Promise.all([
          get('/api/v1/students/?skip=0&limit=10000').catch(() => []),
          get('/api/v1/predictions/?skip=0&limit=10000').catch(() => get('/api/v1/predictions/student/all')).catch(() => []),
          get('/api/v1/students/count').catch(() => 0)
        ]);

        // Super Extractor
        const extractArray = (res: any) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (res.data && Array.isArray(res.data)) return res.data;
          if (res.data?.items && Array.isArray(res.data.items)) return res.data.items;
          if (res.items && Array.isArray(res.items)) return res.items;
          return [];
        };

        const studentsArray = extractArray(studentsResponse);
        const predictionsArray = extractArray(predictionsResponse);

        const totalSiswaAktif = typeof countResponse === 'number'
          ? countResponse
          : (countResponse?.data?.total_active ?? countResponse?.count ?? countResponse?.total ?? studentsArray.length);

        // Group predictions by student_id to get only the latest prediction for each student
        const latestPredictionsMap = new Map<string, any>();
        predictionsArray.forEach((pred: any) => {
          const studentId = pred.student_id;
          if (!studentId) return;
          const existing = latestPredictionsMap.get(studentId);
          if (!existing || new Date(pred.created_at) > new Date(existing.created_at)) {
            latestPredictionsMap.set(studentId, pred);
          }
        });

        let berisiko = 0, aman = 0;
        const criticalList: any[] = [];

        latestPredictionsMap.forEach((pred: any) => {
          const rawScore = pred.risk_score !== undefined ? pred.risk_score : pred.risk_status;

          // Deteksi apakah siswa berisiko secara komprehensif (status 'at_risk' atau skor desimal >= 0.75)
          const isBerisiko = pred.risk_status === 'at_risk' ||
            pred.is_at_risk === true ||
            (typeof pred.risk_score === 'number' && (pred.risk_score >= 0.75 || pred.risk_score >= 50)) ||
            (rawScore === 1 || rawScore === '1' || rawScore === true);

          if (isBerisiko) berisiko++;
          else aman++;

          const studentInfo = studentsArray.find((s: any) => s.id === pred.student_id) || {};

          // Format tampilan skor: jika desimal < 1, tampilkan persentase bulat
          let formattedScore = rawScore;
          if (typeof rawScore === 'number' && rawScore > 0 && rawScore < 1) {
            formattedScore = `${Math.round(rawScore * 100)}%`;
          }

          criticalList.push({
            id: pred.student_id || Math.random().toString(),
            name: studentInfo.name || 'Nama Tidak Diketahui',
            nis: studentInfo.nis || '-',
            nisn: studentInfo.nisn || '-',
            riskLevel: isBerisiko ? 'Berisiko' : 'Aman',
            rawScore: formattedScore,
            latestPrediction: pred
          });
        });

        criticalList.sort((a, b) => {
          const scoreA = a.riskLevel === 'Berisiko' ? 1 : 0;
          const scoreB = b.riskLevel === 'Berisiko' ? 1 : 0;
          if (scoreA !== scoreB) return scoreB - scoreA;
          
          const valA = typeof a.latestPrediction.risk_score === 'number' ? a.latestPrediction.risk_score : 0;
          const valB = typeof b.latestPrediction.risk_score === 'number' ? b.latestPrediction.risk_score : 0;
          return valB - valA;
        });

        if (isMounted) {
          setSummary({
            totalStudents: totalSiswaAktif,
            riskDistribution: { berisiko, aman },
            topCriticalStudents: criticalList.slice(0, 5)
          });
          setError(null);

          // Memicu animasi 100ms setelah data dirender agar efek transisinya terlihat
          setTimeout(() => setAnimateCharts(true), 100);
        }

      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat data dashboard.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500 animate-pulse">Menghitung model prediksi dan memuat analitik...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Gagal memuat dashboard</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  const { totalStudents, riskDistribution, topCriticalStudents } = summary;
  const totalPredicted = riskDistribution.berisiko + riskDistribution.aman;
  
  const persentaseAmanVal = totalPredicted > 0 ? (riskDistribution.aman / totalPredicted) * 100 : 0;
  const persentaseAman = persentaseAmanVal % 1 === 0 ? persentaseAmanVal.toFixed(0) : persentaseAmanVal.toFixed(1);

  const persentaseBerisikoVal = totalPredicted > 0 ? (riskDistribution.berisiko / totalPredicted) * 100 : 0;
  const persentaseBerisiko = persentaseBerisikoVal % 1 === 0 ? persentaseBerisikoVal.toFixed(0) : persentaseBerisikoVal.toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ================= BARIS 1: STATISTIC CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Siswa Aktif"
          value={totalStudents}
          subtitle="Terdaftar pada sistem"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <StatCard
          title="Siswa Berisiko Dropout"
          value={riskDistribution.berisiko}
          trend="up"
          subtitle="Membutuhkan intervensi segera"
          icon={<svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <StatCard
          title="Siswa Status Aman"
          value={riskDistribution.aman}
          trend="down"
          subtitle={totalPredicted === 0 ? "Belum ada prediksi" : `Atau ${persentaseAman}% dari siswa dievaluasi`}
          icon={<svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* ================= BARIS 2: CHARTS (ANIMATED) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-87.5">
          <h3 className="text-base font-black text-asgard-primary mb-6">Tren Prediksi Risiko Dropout</h3>
          <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-6 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4 text-sm font-bold text-slate-600 mb-8">
              <div className="rounded-xl bg-white p-4 shadow-sm transition-transform duration-500 hover:scale-105">
                <p className="text-xs uppercase tracking-wider text-slate-400">Total Dievaluasi</p>
                <p className="mt-2 text-3xl text-asgard-primary">{totalPredicted}</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm transition-transform duration-500 hover:scale-105">
                <p className="text-xs uppercase tracking-wider text-slate-400">Persentase Aman</p>
                <p className="mt-2 text-3xl text-emerald-600">{persentaseAman}%</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Berisiko', count: riskDistribution.berisiko, bar: 'bg-red-500', text: 'text-red-600' },
                { label: 'Aman', count: riskDistribution.aman, bar: 'bg-emerald-500', text: 'text-emerald-600' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className={`w-20 text-xs font-black uppercase tracking-wider ${item.text}`}>{item.label}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${item.bar} transition-all duration-1000 ease-out`}
                      // Animasi: Mulai dari 0%, memanjang saat state animateCharts berubah menjadi true
                      style={{ width: animateCharts ? `${Math.max((item.count / Math.max(totalPredicted, 1)) * 100, item.count > 0 ? 3 : 0)}%` : '0%' }}
                    />
                  </div>
                  <span className="w-10 text-right text-base font-black text-slate-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-87.5">
          <h3 className="text-base font-black text-asgard-primary mb-6">Distribusi Klasifikasi Model AI</h3>
          <div className="flex-1 flex items-center justify-center gap-10">
            <div className="w-48 h-48 rounded-full border-[20px] border-slate-50 shadow-inner overflow-hidden relative group cursor-pointer">
              <div
                className="h-full w-full rotate-45 transition-all duration-[1500ms] ease-out"
                style={{
                  // Animasi: Donat berwarna abu-abu dulu, lalu diisi warna sesuai persentase
                  background: (!animateCharts || totalPredicted === 0)
                    ? '#f1f5f9'
                    : `conic-gradient(#ef4444 0 ${Math.max((riskDistribution.berisiko / totalPredicted) * 100, 1)}%, #10b981 ${Math.max((riskDistribution.berisiko / totalPredicted) * 100, 1)}% 100%)`,
                }}
              />
              <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="text-sm font-black text-slate-400">ASGARD</span>
              </div>
            </div>
            <div className="space-y-4 text-base font-bold text-slate-600">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-red-500 shadow-sm" />
                Berisiko <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md text-xs">{persentaseBerisiko}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm" />
                Aman <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">{persentaseAman}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BARIS 3: MINI TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-black text-asgard-primary">Siswa Peringatan Kritis Teratas</h3>
          {/* Menghubungkan tombol Lihat Semua ke halaman Daftar Siswa */}
          <Link href="/student">
            <Button variant="outline" size="sm" className="hover:bg-asgard-primary hover:text-white transition-colors">
              Lihat Semua
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Nama Siswa</th>
                <th className="px-6 py-4 font-bold">NISN</th>
                <th className="px-6 py-4 font-bold text-center">Prediksi AI</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topCriticalStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-bold">
                    Belum ada data siswa yang dievaluasi oleh model AI.
                  </td>
                </tr>
              ) : topCriticalStudents.map((siswa) => (
                <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-800 uppercase">{siswa.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{siswa.nisn ?? '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-mono text-sm font-bold px-2 py-1 rounded ${siswa.riskLevel === 'Berisiko' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {siswa.rawScore !== undefined ? siswa.rawScore : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${siswa.riskLevel === 'Berisiko' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>
                      {siswa.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
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