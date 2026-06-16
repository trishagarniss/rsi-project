"use client";

import React, { useEffect, useState } from "react";
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Loader2, Inbox } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Bottombar from "@/components/Bottombar";
import { notificationService } from "@/services/notification";
import { Notification as NotifType } from "@/types/notification";

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    info: "bg-blue-50 text-blue-600 border-blue-200",
    success: "bg-green-50 text-green-600 border-green-200",
    warning: "bg-amber-50 text-amber-600 border-amber-200",
    error: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 ${map[type] || map.info}`}>
      {type}
    </span>
  );
};

const typeIcon = (type: string) => {
  switch (type) {
    case "success": return <CheckCircle size={18} className="text-green-500" />;
    case "warning": return <AlertTriangle size={18} className="text-amber-500" />;
    case "error": return <XCircle size={18} className="text-red-500" />;
    default: return <Info size={18} className="text-blue-500" />;
  }
};

const typeFilterOptions = [
  { label: "Semua", value: "ALL" },
  { label: "Info", value: "info" },
  { label: "Sukses", value: "success" },
  { label: "Peringatan", value: "warning" },
  { label: "Error", value: "error" },
];

export default function NotificationPage() {
  const [notifs, setNotifs] = useState<NotifType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [readFilter, setReadFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const itemsPerPage = 10;

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await notificationService.getAll(0, 500);
      if (res.status === "success") {
        setNotifs(res.data);
        setUnreadCount(res.unread_count);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat notifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const filtered = notifs.filter((n) => {
    const matchType = typeFilter === "ALL" || n.type === typeFilter;
    const matchRead = readFilter === "ALL" || (readFilter === "unread" && !n.is_read) || (readFilter === "read" && n.is_read);
    return matchType && matchRead;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex h-screen bg-asgard-pale font-sans antialiased text-slate-800 overflow-hidden relative">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-asgard-secondary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-asgard-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-asgard-primary/5 border border-asgard-primary/10 text-asgard-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Bell size={14} />
              Pusat Notifikasi
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Notifikasi</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  Semua pemberitahuan dan aktivitas sistem.
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-6 py-3.5 text-xs font-black bg-asgard-primary/5 border-2 border-asgard-primary/10 text-asgard-primary rounded-2xl hover:bg-asgard-primary/10 transition-colors"
                >
                  Tandai Semua Dibaca ({unreadCount})
                </button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-xs font-bold text-asgard-primary mt-2">
                {unreadCount} notifikasi belum dibaca
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-bold">
              <AlertTriangle size={20} className="shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-white rounded-[28px] border-2 border-slate-200 overflow-hidden">
            <div className="p-6 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl self-start">
                {typeFilterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setTypeFilter(opt.value); setCurrentPage(1); }}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                      typeFilter === opt.value
                        ? "bg-white text-asgard-primary"
                        : "text-slate-500 hover:text-asgard-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl self-start">
                {[
                  { label: "Semua", value: "ALL" },
                  { label: "Belum Dibaca", value: "unread" },
                  { label: "Sudah Dibaca", value: "read" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setReadFilter(opt.value); setCurrentPage(1); }}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                      readFilter === opt.value
                        ? "bg-white text-asgard-primary"
                        : "text-slate-500 hover:text-asgard-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 size={36} className="text-asgard-primary animate-spin" />
                  <p className="text-slate-400 text-xs font-bold">Memuat notifikasi...</p>
                </div>
              ) : sorted.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Inbox size={24} />
                  </div>
                  <p className="text-slate-800 font-black">Tidak ada notifikasi</p>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Belum ada notifikasi yang masuk.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {paginated.map((n) => (
                    <div
                      key={n.id}
                      className={`px-8 py-5 flex items-start gap-5 transition-colors border-l-4 ${
                        !n.is_read ? "bg-asgard-primary/[0.02] border-l-asgard-secondary" : "hover:bg-slate-50/50 border-l-transparent hover:border-l-asgard-secondary"
                      }`}
                    >
                      <div className="h-10 w-10 shrink-0 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center mt-0.5">
                        {typeIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          {typeBadge(n.type)}
                          <span className="font-bold text-sm text-slate-800">{typeof n.title === 'string' ? n.title : ''}</span>
                          {!n.is_read && <div className="w-2 h-2 rounded-full bg-asgard-primary shrink-0" />}
                        </div>
                        {typeof n.message === 'string' && (
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400">
                          <span>{new Date(n.created_at).toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                      {!n.is_read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="shrink-0 px-4 py-2 text-[10px] font-black bg-asgard-primary/5 border-2 border-asgard-primary/10 text-asgard-primary rounded-xl hover:bg-asgard-primary/10 transition-colors"
                        >
                          Tandai Dibaca
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {sorted.length > 0 && (
              <Bottombar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                itemsPerPage={itemsPerPage}
                totalItems={sorted.length}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
