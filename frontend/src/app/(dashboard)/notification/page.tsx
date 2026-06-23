"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Info, CheckCircle, AlertTriangle, XCircle,
  Loader2, ChevronDown, ChevronUp, ExternalLink,
  User, Globe, Clock, Shield, Fingerprint
} from "lucide-react";
import { get } from "@/lib/api-client";
import type { AuditLog } from "@/types/audit-log";

type NotificationType = "Kritis" | "Peringatan" | "Info";

interface NotificationItem extends AuditLog {
  tipe: NotificationType;
  judul: string;
  pesan: string;
  waktu: string;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const typeConfig = {
  Kritis: {
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    hover: "hover:border-red-300",
    iconBg: "bg-red-50",
    iconBorder: "border-red-100",
    iconColor: "text-red-500",
    badge: "bg-red-500 text-white",
  },
  Peringatan: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    hover: "hover:border-amber-300",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-100",
    iconColor: "text-amber-500",
    badge: "bg-amber-500 text-white",
  },
  Info: {
    icon: Info,
    bg: "bg-white",
    border: "border-slate-200",
    hover: "hover:border-slate-300",
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-100",
    iconColor: "text-blue-500",
    badge: "bg-blue-500 text-white",
  },
};

export default function NotificationCenter() {
  const router = useRouter();
  const [logs, setLogs] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<NotificationType | "Semua">("Semua");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLogs() {
      try {
        setIsLoading(true);
        const res = await get<{ status: string; data: AuditLog[] }>("/audit-logs/?skip=0&limit=100");
        const auditLogs = res.data;

        const nextLogs = auditLogs.map((log) => {
          const action = log.action.toUpperCase();
          const tipe: NotificationType =
            /DELETE|REMOVE|ARCHIVE/.test(action) ? "Kritis" :
            /UPDATE|CREATE|UPLOAD|BULK/.test(action) ? "Peringatan" : "Info";

          const detailsSummary = log.details
            ? Object.entries(log.details).slice(0, 2).map(([key, value]) => `${key}: ${String(value)}`).join(" • ")
            : "Tidak ada detail tambahan";

          return {
            ...log,
            tipe,
            judul: (log.action + " " + log.entity_name).replaceAll("_", " ").trim(),
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
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat notifikasi.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLogs();
    return () => { isMounted = false; };
  }, []);

  const visibleLogs = useMemo(
    () => logs.filter((log) => activeFilter === "Semua" || log.tipe === activeFilter),
    [logs, activeFilter]
  );

  const counts = {
    total: logs.length,
    kritis: logs.filter((log) => log.tipe === "Kritis").length,
    peringatan: logs.filter((log) => log.tipe === "Peringatan").length,
    info: logs.filter((log) => log.tipe === "Info").length,
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-asgard-primary" />
        <span className="ml-3 text-sm font-bold text-slate-500">Memuat notifikasi...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-6 flex items-start gap-3">
        <XCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-sm">Gagal memuat notifikasi</p>
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
          <h1 className="text-2xl font-extrabold text-asgard-primary">Pusat Pemberitahuan</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Pantau aktivitas sistem berdasarkan audit log real-time.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        {(["Semua", "Info", "Peringatan", "Kritis"] as const).map((f) => {
          const count = f === "Semua" ? counts.total : f === "Info" ? counts.info : f === "Peringatan" ? counts.peringatan : counts.kritis;
          const colors: Record<string, string> = {
            Semua: "bg-asgard-primary text-white",
            Info: "bg-blue-500 text-white",
            Peringatan: "bg-amber-500 text-white",
            Kritis: "bg-red-500 text-white",
          };
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all whitespace-nowrap ${
                activeFilter === f
                  ? `${colors[f]} border-transparent`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {visibleLogs.map((notif) => {
          const cfg = typeConfig[notif.tipe];
          const Icon = cfg.icon;
          const isExpanded = expandedId === notif.id;

          return (
            <div key={notif.id} className={`${cfg.bg} ${cfg.border} ${cfg.hover} rounded-2xl border-2 transition-all duration-200 ${isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md"}`}>

              {/* Clickable Summary */}
              <button
                onClick={() => toggleExpand(notif.id)}
                className="w-full flex items-start gap-4 p-5 text-left cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl ${cfg.iconBg} ${cfg.iconBorder} border-2 flex items-center justify-center shrink-0 ${cfg.iconColor}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${cfg.badge}`}>
                      {notif.tipe}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">{notif.waktu}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 mt-1.5">{notif.judul}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">{notif.pesan}</p>
                </div>
                <div className="shrink-0 text-slate-400 mt-1">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t-2 border-slate-200/60 px-5 pb-5 pt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-xl">
                      <Shield size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Aksi</p>
                        <p className="text-xs font-bold text-slate-700">{notif.action}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-xl">
                      <Fingerprint size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Entitas</p>
                        <p className="text-xs font-bold text-slate-700">{notif.entity_name || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-xl">
                      <User size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">User ID</p>
                        <p className="text-xs font-bold text-slate-700 truncate">{notif.user_id || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-xl">
                      <Globe size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">IP Address</p>
                        <p className="text-xs font-bold text-slate-700">{notif.ip_address || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-xl sm:col-span-2">
                      <Clock size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Waktu</p>
                        <p className="text-xs font-bold text-slate-700">{notif.waktu}</p>
                      </div>
                    </div>
                  </div>

                  {/* Full Details JSON */}
                  {notif.details && Object.keys(notif.details).length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Detail Lengkap</p>
                      <div className="bg-white/80 border border-slate-200 rounded-xl p-3">
                        <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap break-all leading-relaxed">
                          {JSON.stringify(notif.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {visibleLogs.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <Info size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-400">Tidak ada notifikasi untuk filter ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
