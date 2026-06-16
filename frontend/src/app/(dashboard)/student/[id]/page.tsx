'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import RiskBadge from '@/components/ui/RiskBadge';
import Button from '@/components/ui/Button';
import { get } from '@/lib/api-client';
import type { Student, StudentAcademic, StudentAttendance, StudentSocioEconomic } from '@/types/student';

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

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(value: number | null): string {
  if (value == null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

type TabKey = 'akademik' | 'sosek' | 'konseling';

export default function StudentDetail() {
  const params = useParams<{ id: string }>();
  const studentId = params?.id;
  const [activeTab, setActiveTab] = useState<TabKey>('akademik');

  const [student, setStudent] = useState<Student | null>(null);
  const [academics, setAcademics] = useState<StudentAcademic[]>([]);
  const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
  const [socioEconomic, setSocioEconomic] = useState<StudentSocioEconomic | null>(null);
  const [latestPrediction, setLatestPrediction] = useState<RiskPredictionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;
    let isMounted = true;

    async function loadStudentDetail() {
      try {
        setIsLoading(true);

        const [studentRes, academicsRes, attendancesRes, socioRes, predictionRes] = await Promise.allSettled([
          get<{ status: string; data: Student }>('/students/' + studentId),
          get<{ status: string; data: StudentAcademic[] }>('/academics/student/' + studentId),
          get<{ status: string; data: StudentAttendance[] }>('/attendances/student/' + studentId),
          get<{ status: string; data: StudentSocioEconomic }>('/socio-economics/student/' + studentId),
          get<{ status: string; data: RiskPredictionRecord }>('/predictions/student/' + studentId),
        ]);

        if (!isMounted) return;

        if (studentRes.status === 'fulfilled') setStudent(studentRes.value.data);
        if (academicsRes.status === 'fulfilled') setAcademics(academicsRes.value.data);
        if (attendancesRes.status === 'fulfilled') setAttendances(attendancesRes.value.data);
        if (socioRes.status === 'fulfilled') setSocioEconomic(socioRes.value.data);
        if (predictionRes.status === 'fulfilled') setLatestPrediction(predictionRes.value.data);
        setError(null);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat detail siswa.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStudentDetail();
    return () => { isMounted = false; };
  }, [studentId]);

  const latestAcademic = [...academics].sort((a, b) => b.semester - a.semester)[0] ?? null;
  const latestAttendance = [...attendances].sort((a, b) => b.semester - a.semester)[0] ?? null;
  const riskLevel = latestPrediction ? formatRiskLabel(latestPrediction.risk_score, latestPrediction.risk_status) : 'Aman';
  const attendancePercent = latestAttendance?.attendance_percentage ?? 0;
  const genderLabel = student?.gender === 'male' ? 'Laki-laki' : student?.gender === 'female' ? 'Perempuan' : '-';

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Memuat detail siswa dari backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Gagal memuat detail siswa</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-8 text-amber-700 shadow-sm">
        <h3 className="text-base font-black">Siswa tidak ditemukan</h3>
        <p className="mt-2 text-sm font-medium">ID siswa yang diminta tidak ada di database backend.</p>
      </div>
    );
  }

  const renderEmptyState = (title: string, description: string) => (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <p className="text-base font-black text-slate-500">{title}</p>
      <p className="mt-2 text-sm font-medium text-slate-400">{description}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Link href="/student" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-asgard-primary transition-colors w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Daftar Siswa
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-asgard-primary">{student.name}</h1>
            <p className="text-slate-500 font-medium mt-1">NIS: {student.nis} • NISN: {student.nisn ?? '-'} • {genderLabel}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200">Unduh Laporan PDF</Button>
            <Button variant="danger">Intervensi Segera</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Status Risiko</h3>
              <RiskBadge level={riskLevel} />
            </div>

            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">Alamat</p>
                <p className="text-sm font-bold text-slate-700 mt-1">{student.address ?? '-'}</p>
              </div>
              <div className="pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">Prediksi Terakhir</p>
                <p className="text-sm font-bold text-slate-700 mt-1">{formatDateTime(latestPrediction?.created_at)}</p>
              </div>
              <div className="pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">Skor Risiko</p>
                <p className="text-sm font-bold text-slate-700 mt-1">{latestPrediction ? (Math.round(latestPrediction.risk_score * 100)) + '%' : '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Status Keaktifan</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                  {student.is_active ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex border-b border-slate-100 px-2 pt-2 bg-slate-50/50 overflow-x-auto">
            {([
              { id: 'akademik', label: 'Riwayat Akademik' },
              { id: 'sosek', label: 'Data Sosio-Ekonomi' },
              { id: 'konseling', label: 'Riwayat Konseling' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={'px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ' + (activeTab === tab.id ? 'border-asgard-primary text-asgard-primary' : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 flex-1 min-h-100">
            {activeTab === 'akademik' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                <h3 className="text-lg font-black text-asgard-primary">Grafik Nilai & Kehadiran</h3>

                {latestAcademic ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Tahun Ajaran</p>
                      <p className="text-base font-black text-slate-700 mt-1">{latestAcademic.academic_year}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Rata-rata Nilai</p>
                      <p className="text-base font-black text-slate-700 mt-1">{latestAcademic.average_score.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Tugas Belum Selesai</p>
                      <p className="text-base font-black text-slate-700 mt-1">{latestAcademic.incomplete_assignments_count}</p>
                    </div>
                  </div>
                ) : renderEmptyState('Belum ada data akademik', 'Backend belum menyimpan riwayat akademik untuk siswa ini.')}

                {academics.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-4 py-3 font-bold">Semester</th>
                          <th className="px-4 py-3 font-bold">Tahun Ajaran</th>
                          <th className="px-4 py-3 font-bold">Nilai Rata-rata</th>
                          <th className="px-4 py-3 font-bold">Mapel Tidak Lulus</th>
                          <th className="px-4 py-3 font-bold">Tugas Belum Selesai</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {academics.map((record) => (
                          <tr key={record.id}>
                            <td className="px-4 py-3 text-sm font-bold text-slate-700">{record.semester}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{record.academic_year}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{record.average_score.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{record.failed_subjects_count}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{record.incomplete_assignments_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sosek' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                <h3 className="text-lg font-black text-asgard-primary">Indikator Sosio-Ekonomi</h3>

                {socioEconomic ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Penerima KIP/KKS</p>
                      <p className="text-base font-black text-slate-700 mt-1">{socioEconomic.has_kip_scholarship ? 'Ya' : 'Tidak'}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Penghasilan Orang Tua</p>
                      <p className="text-base font-black text-slate-700 mt-1">{formatCurrency(socioEconomic.parents_income)}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Pengeluaran Bulanan</p>
                      <p className="text-base font-black text-slate-700 mt-1">{formatCurrency(socioEconomic.monthly_expenses)}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Jarak ke Sekolah</p>
                      <p className="text-base font-black text-slate-700 mt-1">{socioEconomic.distance_to_school_km ?? '-'} km</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Pendidikan Orang Tua</p>
                      <p className="text-base font-black text-slate-700 mt-1">{socioEconomic.parents_education_level ?? '-'}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Akses Internet Rumah</p>
                      <p className="text-base font-black text-slate-700 mt-1">{socioEconomic.has_internet_access ? 'Ada' : 'Tidak Ada'}</p>
                    </div>
                  </div>
                ) : renderEmptyState('Belum ada data sosio-ekonomi', 'Backend belum menyimpan profil sosio-ekonomi untuk siswa ini.')}
              </div>
            )}

            {activeTab === 'konseling' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-asgard-primary">Riwayat Penanganan BK</h3>
                  <Button variant="secondary" size="sm">Tambah Catatan Baru</Button>
                </div>

                {latestPrediction ? (
                  <div className="space-y-4">
                    <div className="p-6 rounded-xl border border-amber-200 bg-amber-50">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <RiskBadge level={riskLevel} />
                        <span className="text-sm font-bold text-amber-700">{formatDateTime(latestPrediction.created_at)}</span>
                      </div>
                      <p className="text-sm text-amber-900 font-medium leading-relaxed">
                        Skor risiko: {Math.round(latestPrediction.risk_score * 100)}% — Status: {latestPrediction.risk_status === 'at_risk' ? 'Berisiko' : 'Aman'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase">Skor Risiko</p>
                        <p className="text-base font-black text-slate-700 mt-1">{Math.round(latestPrediction.risk_score * 100)}%</p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase">Status Prediksi</p>
                        <p className="text-base font-black text-slate-700 mt-1">{latestPrediction.risk_status === 'at_risk' ? 'Berisiko' : 'Aman'}</p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase">Kehadiran Terakhir</p>
                        <p className="text-base font-black text-slate-700 mt-1">{attendancePercent ? attendancePercent.toFixed(2) + '%' : '-'}</p>
                      </div>
                    </div>

                    {latestAttendance ? (
                      <div className="p-6 rounded-xl border border-slate-100 bg-white">
                        <p className="text-sm font-black text-slate-700 mb-3">Ringkasan Absensi Terbaru</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Hadir</p>
                            <p className="mt-1 font-black text-slate-700">{latestAttendance.present_count}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Sakit</p>
                            <p className="mt-1 font-black text-slate-700">{latestAttendance.sick_count}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Izin</p>
                            <p className="mt-1 font-black text-slate-700">{latestAttendance.excused_count}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Alpha</p>
                            <p className="mt-1 font-black text-slate-700">{latestAttendance.unexcused_count}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : renderEmptyState('Belum ada riwayat prediksi', 'Backend belum menyimpan prediksi risiko untuk siswa ini.')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}