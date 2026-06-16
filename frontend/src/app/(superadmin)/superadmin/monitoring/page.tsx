"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  Activity, Server, Database, RefreshCw, CheckCircle, XCircle,
  Clock, Cpu, HardDrive, Wifi, AlertTriangle,
  BookOpen, ExternalLink, FileJson
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

interface HealthData {
  status: string;
  uptime: string;
  uptime_seconds: number;
  database: string;
  redis: string;
  cpu_percent: number;
  memory_percent: number;
  memory_used_gb: number;
  memory_total_gb: number;
  disk_percent: number;
  disk_used_gb: number;
  disk_total_gb: number;
  timestamp: string;
}

interface ConnectionStatus {
  online: boolean | null;
  latency: number | null;
  timestamp: string | null;
  message?: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace("/api/v1", "");

function getHealthColor(percent: number): string {
  if (percent < 60) return "text-green-500 bg-green-50 border-green-200";
  if (percent < 80) return "text-amber-500 bg-amber-50 border-amber-200";
  return "text-red-500 bg-red-50 border-red-200";
}

function getStatusBadge(ok: boolean) {
  return ok
    ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-green-50 text-green-600 border-2 border-green-200 text-[10px] font-black"><CheckCircle size={12} />Connected</span>
    : <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-red-50 text-red-600 border-2 border-red-200 text-[10px] font-black"><XCircle size={12} />Disconnected</span>;
}

export default function MonitoringPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState("");

  const [connection, setConnection] = useState<ConnectionStatus>({ online: null, latency: null, timestamp: null });
  const [pingLoading, setPingLoading] = useState(false);

  const fetchHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/health`, {
        method: "GET",
        cache: "no-store",
        headers: { "Accept": "application/json" }
      });
      if (!res.ok) throw new Error("Health endpoint tidak tersedia");
      const data: HealthData = await res.json();
      setHealth(data);
      setHealthError("");
    } catch {
      setHealthError("Gagal memuat data kesehatan server.");
    } finally {
      setHealthLoading(false);
    }
  }, []);

  const pingServer = useCallback(async () => {
    setPingLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(`${API_BASE}/api/v1/health`, { method: "GET", cache: "no-store", headers: { "Accept": "application/json" } });
      const data = await res.json();
      setConnection({
        online: true,
        latency: Date.now() - start,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        message: data.status || "OK"
      });
    } catch {
      setConnection({
        online: false, latency: null,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        message: "Tidak ada response"
      });
    } finally {
      setPingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth(); pingServer(); // eslint-disable-line react-hooks/set-state-in-effect
    const hInterval = setInterval(fetchHealth, 30000);
    const pInterval = setInterval(pingServer, 30000);
    return () => { clearInterval(hInterval); clearInterval(pInterval); };
  }, [fetchHealth, pingServer]);

  return (
    <div className="flex h-screen bg-asgard-pale font-sans antialiased text-slate-800 overflow-hidden relative">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-asgard-secondary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-asgard-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-asgard-primary/5 border border-asgard-primary/10 text-asgard-primary text-xs font-bold uppercase tracking-widest mb-3">
                <Activity size={14} />
                Server Infrastructure
              </div>
              <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Server Monitoring</h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Pantau kesehatan server, database, dan resource sistem secara real-time.
              </p>
            </div>
            <button onClick={() => { fetchHealth(); pingServer(); }} disabled={healthLoading || pingLoading} className="inline-flex items-center gap-2 px-5 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white font-black rounded-xl transition-all disabled:opacity-50 text-xs">
              <RefreshCw size={14} className={healthLoading || pingLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {healthError && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-bold">
              <AlertTriangle size={20} className="shrink-0 text-red-500 mt-0.5" />
              <span>{healthError}</span>
            </div>
          )}

          {/* Connection Status */}
          <div className="bg-white rounded-[20px] border-2 border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                connection.online === null ? "bg-amber-50" : connection.online ? "bg-green-50" : "bg-red-50"
              }`}>
                {connection.online === null ? (
                  <RefreshCw size={22} className="text-amber-500 animate-spin" />
                ) : connection.online ? (
                  <CheckCircle size={22} className="text-green-500" />
                ) : (
                  <XCircle size={22} className="text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-extrabold text-slate-800">
                    {connection.online === null ? "Memeriksa Server..." : connection.online ? "Server Terkoneksi" : "Server Offline"}
                  </h3>
                  {getStatusBadge(connection.online === true)}
                </div>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  {connection.online === null ? "Menunggu respons..." : connection.message}
                  {connection.latency && ` (${connection.latency}ms)`}
                  {connection.timestamp && ` — ${connection.timestamp}`}
                </p>
              </div>
              <button onClick={pingServer} disabled={pingLoading} className="px-5 py-2.5 bg-asgard-primary hover:bg-[#2434B5] text-white text-[10px] font-black rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5">
                <RefreshCw size={12} className={pingLoading ? "animate-spin" : ""} />
                Ping
              </button>
            </div>
          </div>

          {/* Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Database */}
            <div className="bg-white rounded-[20px] border-2 border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <Database size={20} />
                </div>
                {health ? getStatusBadge(health.database === "connected") : <div className="w-20 h-6 bg-slate-100 rounded-lg animate-pulse" />}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Database (PostgreSQL)</p>
              <p className="text-sm font-extrabold text-slate-800">PostgreSQL {health ? health.database === "connected" ? "● Active" : "● Down" : "..."}</p>
            </div>

            {/* Redis */}
            <div className="bg-white rounded-[20px] border-2 border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
                  <Wifi size={20} />
                </div>
                {health ? getStatusBadge(health.redis === "connected") : <div className="w-20 h-6 bg-slate-100 rounded-lg animate-pulse" />}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Redis</p>
              <p className="text-sm font-extrabold text-slate-800">Redis {health ? health.redis === "connected" ? "● Active" : "● Down" : "..."}</p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-[20px] border-2 border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                  <Clock size={20} />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Uptime Server</p>
              <p className="text-xl font-extrabold text-slate-800">
                {health ? health.uptime : <span className="text-slate-300">--</span>}
              </p>
            </div>

            {/* CPU */}
            <div className="bg-white rounded-[20px] border-2 border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white">
                  <Cpu size={20} />
                </div>
                {health && (
                  <span className={`inline-flex px-3 py-1 rounded-xl border-2 text-xs font-black ${getHealthColor(health.cpu_percent)}`}>
                    {health.cpu_percent.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CPU Usage</p>
              {health ? (
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${health.cpu_percent}%` }} />
                </div>
              ) : (
                <div className="w-full h-2.5 bg-slate-100 rounded-full animate-pulse" />
              )}
            </div>

            {/* Memory */}
            <div className="bg-white rounded-[20px] border-2 border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                  <Server size={20} />
                </div>
                {health && (
                  <span className={`inline-flex px-3 py-1 rounded-xl border-2 text-xs font-black ${getHealthColor(health.memory_percent)}`}>
                    {health.memory_percent.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Memory (RAM)</p>
              {health ? (
                <>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${health.memory_percent}%` }} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500">
                    {health.memory_used_gb} GB / {health.memory_total_gb} GB
                  </p>
                </>
              ) : (
                <div className="w-full h-2.5 bg-slate-100 rounded-full animate-pulse" />
              )}
            </div>

            {/* Disk */}
            <div className="bg-white rounded-[20px] border-2 border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white">
                  <HardDrive size={20} />
                </div>
                {health && (
                  <span className={`inline-flex px-3 py-1 rounded-xl border-2 text-xs font-black ${getHealthColor(health.disk_percent)}`}>
                    {health.disk_percent.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Disk Usage</p>
              {health ? (
                <>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-green-500" style={{ width: `${health.disk_percent}%` }} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500">
                    {health.disk_used_gb} GB / {health.disk_total_gb} GB
                  </p>
                </>
              ) : (
                <div className="w-full h-2.5 bg-slate-100 rounded-full animate-pulse" />
              )}
            </div>

          </div>

          {/* API Documentation */}
          <div className="bg-white rounded-[20px] border-2 border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">API Documentation</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dokumentasi Endpoint API</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href={`${API_BASE}/docs`} target="_blank" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-asgard-primary hover:bg-asgard-primary/[0.02] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">S</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-800 group-hover:text-asgard-primary">Swagger UI</p>
                  <p className="text-[10px] font-bold text-slate-400">Interactive API explorer</p>
                </div>
                <ExternalLink size={16} className="text-slate-300 group-hover:text-asgard-primary shrink-0" />
              </a>
              <a href={`${API_BASE}/redoc`} target="_blank" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-asgard-primary hover:bg-asgard-primary/[0.02] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 font-black text-sm shrink-0">R</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-800 group-hover:text-asgard-primary">ReDoc</p>
                  <p className="text-[10px] font-bold text-slate-400">Clean API reference</p>
                </div>
                <ExternalLink size={16} className="text-slate-300 group-hover:text-asgard-primary shrink-0" />
              </a>
              <a href={`${API_BASE}/openapi.json`} target="_blank" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-asgard-primary hover:bg-asgard-primary/[0.02] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                  <FileJson size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-800 group-hover:text-asgard-primary">OpenAPI JSON</p>
                  <p className="text-[10px] font-bold text-slate-400">Raw schema spec</p>
                </div>
                <ExternalLink size={16} className="text-slate-300 group-hover:text-asgard-primary shrink-0" />
              </a>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-[20px] border-2 border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-asgard-primary to-blue-700 flex items-center justify-center text-white">
                <Server size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">System Overview</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ringkasan Sistem</p>
              </div>
            </div>
            {health ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Database</p>
                  <p className={`text-lg font-extrabold mt-1 ${health.database === "connected" ? "text-green-600" : "text-red-600"}`}>
                    {health.database === "connected" ? "Active" : "Down"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Redis</p>
                  <p className={`text-lg font-extrabold mt-1 ${health.redis === "connected" ? "text-green-600" : "text-red-600"}`}>
                    {health.redis === "connected" ? "Active" : "Down"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">CPU</p>
                  <p className="text-lg font-extrabold text-slate-800 mt-1">{health.cpu_percent.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Memory</p>
                  <p className="text-lg font-extrabold text-slate-800 mt-1">{health.memory_percent.toFixed(1)}%</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 animate-pulse">
                    <div className="h-3 w-16 bg-slate-200 rounded mx-auto mb-2" />
                    <div className="h-6 w-12 bg-slate-200 rounded mx-auto" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
