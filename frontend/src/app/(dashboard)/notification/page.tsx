"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Info, CheckCircle, AlertTriangle, XCircle,
  Loader2, ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";
import { notificationService } from "@/services/notification";
import type { Notification } from "@/types/notification";

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const typeConfig: Record<string, {
  icon: typeof Info;
  bg: string;
  border: string;
  hover: string;
  iconBg: string;
  iconColor: string;
  badge: string;
}> = {
  error: {
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200", hover: "hover:border-red-300",
    iconBg: "bg-red-100", iconColor: "text-red-600",
    badge: "bg-red-500 text-white",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200", hover: "hover:border-amber-300",
    iconBg: "bg-amber-100", iconColor: "text-amber-600",
    badge: "bg-amber-500 text-white",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-50",
    border: "border-emerald-200", hover: "hover:border-emerald-300",
    iconBg: "bg-emerald-100", iconColor: "text-emerald-600",
    badge: "bg-emerald-500 text-white",
  },
  info: {
    icon: Info,
    bg: "bg-white",
    border: "border-slate-200", hover: "hover:border-slate-300",
    iconBg: "bg-blue-100", iconColor: "text-blue-600",
    badge: "bg-blue-500 text-white",
  },
};

const typeLabel: Record<string, string> = {
  error: "Kritis",
  warning: "Peringatan",
  success: "Sukses",
  info: "Info",
};

const filterLabels = ["Semua", "error", "warning", "success", "info"] as const;
type FilterType = (typeof filterLabels)[number];

export default function NotificationPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("Semua");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadNotifs = async () => {
    try {
      setIsLoading(true);
      const res = await notificationService.getAll(0, 100);
      if (res.status === "success") {
        setNotifs(res.data);
        setUnreadCount(res.unread_count);
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat notifikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const visibleNotifs = useMemo(
    () =>
      activeFilter === "Semua"
        ? notifs
        : notifs.filter((n) => n.type === activeFilter),
    [notifs, activeFilter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { total: notifs.length };
    for (const n of notifs) {
      c[n.type] = (c[n.type] || 0) + 1;
    }
    return c;
  }, [notifs]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleMarkRead = async (n: Notification) => {
    if (n.is_read) return;
    try {
      await notificationService.markRead(n.id);
      setNotifs((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      /* ignore */
    }
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
          <p className="text-slate-500 text-sm font-medium mt-1">
            {unreadCount > 0
              ? `${unreadCount} notifikasi belum dibaca`
              : "Semua notifikasi sudah dibaca"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={async () => {
              try {
                await notificationService.markAllRead();
                setNotifs((prev) => prev.map((x) => ({ ...x, is_read: true })));
                setUnreadCount(0);
              } catch { /* ignore */ }
            }}
            className="px-4 py-2 text-xs font-bold bg-asgard-primary text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        {filterLabels.map((f) => {
          const label = f === "Semua" ? "Semua" : typeLabel[f];
          const count = counts[f] || 0;
          const colorMap: Record<string, string> = {
            Semua: "bg-asgard-primary text-white",
            error: "bg-red-500 text-white",
            warning: "bg-amber-500 text-white",
            success: "bg-emerald-500 text-white",
            info: "bg-blue-500 text-white",
          };
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all whitespace-nowrap ${
                activeFilter === f
                  ? `${colorMap[f]} border-transparent`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {visibleNotifs.map((n) => {
          const cfg = typeConfig[n.type] || typeConfig.info;
          const Icon = cfg.icon;
          const isExpanded = expandedId === n.id;

          return (
            <div
              key={n.id}
              className={`${cfg.bg} ${cfg.border} ${cfg.hover} rounded-2xl border-2 transition-all duration-200 ${isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md"} ${!n.is_read ? "ring-2 ring-asgard-secondary/30" : ""}`}
            >
              {/* Clickable Summary */}
              <button
                onClick={() => toggleExpand(n.id)}
                className="w-full flex items-start gap-4 p-5 text-left cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl ${cfg.iconBg} border-2 ${cfg.border} flex items-center justify-center shrink-0 ${cfg.iconColor}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${cfg.badge}`}>
                        {typeLabel[n.type]}
                      </span>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-asgard-secondary" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
                      {formatDateTime(n.created_at)}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 mt-1.5">{n.title}</h3>
                  {n.message && (
                    <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">{n.message}</p>
                  )}
                </div>
                <div className="shrink-0 text-slate-400 mt-1">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t-2 border-slate-200/60 px-5 pb-5 pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-xl">
                      <Info size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Tipe</p>
                        <p className="text-xs font-bold text-slate-700 capitalize">{n.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-xl">
                      <CheckCircle size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                        <p className="text-xs font-bold text-slate-700">
                          {n.is_read ? "Sudah dibaca" : "Belum dibaca"}
                        </p>
                      </div>
                    </div>
                    {n.reference_type && (
                      <div className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-xl">
                        <ExternalLink size={14} className="text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Referensi</p>
                          <p className="text-xs font-bold text-slate-700">
                            {n.reference_type} {n.reference_id ? `#${n.reference_id.slice(0, 12)}` : ""}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {n.message && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Pesan</p>
                      <div className="bg-white/80 border border-slate-200 rounded-xl p-3">
                        <p className="text-sm text-slate-700 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  )}

                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n)}
                      className="text-xs font-bold text-asgard-primary hover:underline"
                    >
                      Tandai sudah dibaca
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {visibleNotifs.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <Info size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-400">Tidak ada notifikasi untuk filter ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
