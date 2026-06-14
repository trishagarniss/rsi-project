'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { fetchAllAuditLogs, formatDateTime, type AuditLogRecord } from '@/lib/dashboard-api';

type NotificationType = 'Kritis' | 'Peringatan' | 'Info';

type NotificationItem = AuditLogRecord & {
  tipe: NotificationType;
  judul: string;
  pesan: string;
  waktu: string;
};

export default function NotificationCenter() {
  const [logs, setLogs] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'Semua'>('Semua');

  useEffect(() => {
    let isMounted = true;

    async function loadLogs() {
      try {
        setIsLoading(true);
        const auditLogs = await fetchAllAuditLogs(100);

        const nextLogs = auditLogs.map((log) => {
          const action = log.action.toUpperCase();
          const tipe: NotificationType =
            /DELETE|REMOVE|ARCHIVE/.test(action)
              ? 'Kritis'
              : /UPDATE|CREATE|UPLOAD|BULK/.test(action)
                ? 'Peringatan'
                : 'Info';
          const detailsSummary = log.details ? Object.entries(log.details).slice(0, 2).map(([key, value]) => `${key}: ${String(value)}`).join(' • ') : 'Tidak ada detail tambahan';

          return {
            ...log,
            tipe,
            judul: `${log.action} ${log.entity_name}`.replaceAll('_', ' '),
            pesan: detailsSummary,
            waktu: formatDateTime(log.created_at),
          };
        });

        if (isMounted) {
          setLogs(nextLogs);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Gagal memuat notifikasi.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleLogs = useMemo(
    () => logs.filter((log) => activeFilter === 'Semua' || log.tipe === activeFilter),
    [logs, activeFilter]
  );

  const counts = {
    total: logs.length,
    kritis: logs.filter((log) => log.tipe === 'Kritis').length,
    peringatan: logs.filter((log) => log.tipe === 'Peringatan').length,
    info: logs.filter((log) => log.tipe === 'Info').length,
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Memuat notifikasi dari audit log backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
        <h3 className="text-base font-black">Gagal memuat notifikasi</h3>
        <p className="mt-2 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Pusat Pemberitahuan</h1>
          <p className="text-slate-500 font-medium mt-1">Pantau aktivitas sistem berdasarkan audit log real-time.</p>
        </div>
        
        <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200">
                Pengaturan Notifikasi
            </Button>
            <Button variant="primary" className="shadow-md">
                Tandai Semua Dibaca
            </Button>
        </div>
      </div>

      {/* ================= KONTROL FILTER ================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <button onClick={() => setActiveFilter('Semua')} className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${activeFilter === 'Semua' ? 'bg-asgard-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
          Semua ({counts.total})
        </button>
        <button onClick={() => setActiveFilter('Info')} className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${activeFilter === 'Info' ? 'bg-asgard-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
          Info ({counts.info})
        </button>
        <button onClick={() => setActiveFilter('Peringatan')} className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${activeFilter === 'Peringatan' ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 hover:bg-amber-50 border border-slate-200'}`}>
          Peringatan ({counts.peringatan})
        </button>
        <button onClick={() => setActiveFilter('Kritis')} className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${activeFilter === 'Kritis' ? 'bg-red-500 text-white' : 'bg-white text-red-500 hover:bg-red-50 border border-slate-200'}`}>
          Kritis ({counts.kritis})
        </button>
      </div>

      {/* ================= DAFTAR NOTIFIKASI ================= */}
      <div className="space-y-4">
        {visibleLogs.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row gap-5 ${
                notif.tipe === 'Kritis'
                ? 'bg-red-50 border-red-100 shadow-sm hover:shadow-md'
                : notif.tipe === 'Peringatan'
                ? 'bg-amber-50 border-amber-100 shadow-sm hover:shadow-md'
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
            }`}
          >
            
            {/* Ikon Urgensi */}
            <div className="flex-shrink-0 mt-1">
                {notif.tipe === 'Kritis' && (
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                )}
                {notif.tipe === 'Peringatan' && (
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                )}
                {notif.tipe === 'Info' && (
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                )}
            </div>

            {/* Konten Utama */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                        <h3 className={`text-base font-black ${notif.tipe === 'Info' ? 'text-slate-800' : 'text-slate-900'}`}>
                            {notif.judul}
                        </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                        {notif.waktu}
                    </span>
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${notif.tipe === 'Info' ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                    {notif.pesan}
                </p>
                
                {/* Tombol Aksi Kontekstual */}
                <div className="flex items-center gap-3">
                    {notif.tipe === 'Kritis' && <Button variant="danger" size="sm" className="text-xs">Lihat Daftar Siswa</Button>}
                    {notif.tipe === 'Peringatan' && <Button variant="secondary" size="sm" className="text-xs">Buka Modul Konseling</Button>}
                    {notif.tipe === 'Info' && <Button variant="outline" size="sm" className="text-xs">Lihat Detail</Button>}
                </div>
            </div>

          </div>
        ))}

        {visibleLogs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
            Tidak ada notifikasi untuk filter yang dipilih.
          </div>
        )}
      </div>

    </div>
  );
}