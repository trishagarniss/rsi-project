"use client";

import React, { useEffect, useState } from "react";
import {
  ClipboardList, Search, ShieldAlert, Loader2, Clock,
  FileText, AlertTriangle, LogIn, Globe, Edit3, Trash2, UserCircle
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Bottombar from "@/components/Bottombar";
import { auditLogService } from "@/services/audit-log";
import { AuditLog } from "@/types/audit-log";

const actionBadge = (action: string) => {
  const map: Record<string, string> = {
    CREATE: "bg-green-50 text-green-600 border-green-200",
    UPDATE: "bg-blue-50 text-blue-600 border-blue-200",
    DELETE: "bg-red-50 text-red-600 border-red-200",
    LOGIN: "bg-purple-50 text-purple-600 border-purple-200",
  };
  return (
    <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 ${map[action] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {action}
    </span>
  );
};

const roleBadge = (role?: string) => {
  const map: Record<string, string> = {
    superadmin: "bg-purple-50 text-purple-600 border-purple-200",
    admin: "bg-blue-50 text-blue-600 border-blue-200",
    counselor: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };
  const labels: Record<string, string> = {
    superadmin: "Superadmin",
    admin: "Admin",
    counselor: "Guru BK",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border-2 ${map[role || ""] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {labels[role || ""] || role || "Unknown"}
    </span>
  );
};

const actionIcon = (action: string, size = 18) => {
  switch (action) {
    case "LOGIN": return <LogIn size={size} />;
    case "CREATE": return <FileText size={size} />;
    case "UPDATE": return <Edit3 size={size} />;
    case "DELETE": return <Trash2 size={size} />;
    default: return <AlertTriangle size={size} />;
  }
};

function DetailChanges({ details }: { details: Record<string, unknown> }) {
  const entries = Object.entries(details);
  if (entries.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <FileText size={11} />
        Detail Perubahan
      </p>
      <div className="space-y-1">
        {entries.map(([key, val]) => {
          const displayVal = typeof val === "string" ? val : JSON.stringify(val);
          return (
            <div key={key} className="flex items-start gap-2 text-[11px] leading-relaxed">
              <span className="font-extrabold text-slate-600 shrink-0 min-w-[80px]">{key.replace(/_/g, " ")}:</span>
              <span className="text-slate-500 font-medium break-all">{displayVal}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await auditLogService.getAll(0, 500);
      if (res.status === "success") setLogs(res.data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat log aktivitas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      log.entity_name.toLowerCase().includes(q) ||
      log.entity_id?.toLowerCase().includes(q) ||
      log.user_role?.toLowerCase().includes(q) ||
      log.ip_address?.toLowerCase().includes(q);
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              <ClipboardList size={14} />
              Audit Trail Sistem
            </div>
            <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Audit Log</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Riwayat aktivitas dan perubahan data di seluruh platform ASGARD.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-bold">
              <ShieldAlert size={20} className="shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-white rounded-[28px] border-2 border-slate-200 overflow-hidden">
            <div className="p-6 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl self-start">
                {["ALL", "CREATE", "UPDATE", "DELETE", "LOGIN"].map((act) => (
                  <button
                    key={act}
                    onClick={() => { setActionFilter(act); setCurrentPage(1); }}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                      actionFilter === act
                        ? "bg-white text-asgard-primary border-2 border-asgard-primary/20"
                        : "text-slate-500 hover:text-asgard-primary"
                    }`}
                  >
                    {act === "ALL" ? "Semua" : act}
                  </button>
                ))}
              </div>
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari aksi, entitas, role, atau IP..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-11 pr-4 h-[46px] rounded-xl border-2 border-slate-200 focus:border-asgard-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 size={36} className="text-asgard-primary animate-spin" />
                  <p className="text-slate-400 text-xs font-bold">Memuat log aktivitas...</p>
                </div>
              ) : sortedLogs.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ClipboardList size={24} />
                  </div>
                  <p className="text-slate-800 font-black">Tidak ada log ditemukan</p>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Belum ada aktivitas yang tercatat.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {paginatedLogs.map((log) => (
                    <div key={log.id} className="px-8 py-5 hover:bg-slate-50/50 transition-colors border-l-4 border-l-transparent hover:border-l-asgard-secondary">
                      <div className="flex items-start gap-5">

                        <div className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center mt-0.5 border-2 ${
                          log.action === "CREATE" ? "bg-green-50 text-green-500 border-green-200" :
                          log.action === "UPDATE" ? "bg-blue-50 text-blue-500 border-blue-200" :
                          log.action === "DELETE" ? "bg-red-50 text-red-500 border-red-200" :
                          log.action === "LOGIN" ? "bg-purple-50 text-purple-500 border-purple-200" :
                          "bg-slate-100 text-slate-400 border-slate-100"
                        }`}>
                          {actionIcon(log.action)}
                        </div>

                        <div className="flex-1 min-w-0">

                          {/* Top row: action badge + entity */}
                          <div className="flex items-center gap-3 flex-wrap">
                            {actionBadge(log.action)}
                            <span className="font-bold text-slate-800 text-sm">{log.entity_name}</span>
                            {log.entity_id && (
                              <code className="text-[10px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                ID: {log.entity_id}
                              </code>
                            )}
                          </div>

                          {/* Who — role badge + user_id */}
                          <div className="flex items-center gap-2 mt-2.5">
                            <UserCircle size={14} className="text-slate-400 shrink-0" />
                            {roleBadge(log.user_role)}
                            <span className="text-[11px] font-mono font-medium text-slate-400">
                              {log.user_id.substring(0, 8)}...{log.user_id.substring(log.user_id.length - 4)}
                            </span>
                          </div>

                          {/* When + Where */}
                          <div className="flex items-center gap-4 mt-1.5 text-[11px] font-medium text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Clock size={12} className="shrink-0" />
                              {new Date(log.created_at).toLocaleString("id-ID", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                            {log.ip_address && (
                              <span className="flex items-center gap-1.5">
                                <Globe size={12} className="shrink-0" />
                                {log.ip_address}
                              </span>
                            )}
                          </div>

                          {/* Detail Perubahan (details JSON) */}
                          {log.details && Object.keys(log.details).length > 0 && (
                            <DetailChanges details={log.details} />
                          )}

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {sortedLogs.length > 0 && (
              <Bottombar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                itemsPerPage={itemsPerPage}
                totalItems={sortedLogs.length}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
