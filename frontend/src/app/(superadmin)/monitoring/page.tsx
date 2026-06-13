"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  Activity, 
  Server, 
  HardDrive, 
  Cpu, 
  RefreshCw, 
  ExternalLink,
  TrendingUp,
  CirclePlay,
  CheckCircle,
  XCircle,
  Database
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

// Types for connection status
interface ConnectionStatus {
  online: boolean | null;
  latency: number | null;
  timestamp: string | null;
  message?: string;
}

export default function MonitoringPage() {
  // Simulated live metrics
  const [ramUsage, setRamUsage] = useState(4.2);
  const [cpuUsage, setCpuUsage] = useState(32);
  const [activeConnections, setActiveConnections] = useState(1);
  
  // Chart interaction states
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Connection checker state
  const [status, setStatus] = useState<ConnectionStatus>({
    online: null,
    latency: null,
    timestamp: null
  });
  const [isChecking, setIsChecking] = useState(false);

  // Function to ping backend server
  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    const startTime = Date.now();
    try {
      // Fetch status from user's active backend IP
      const res = await fetch("http://100.126.164.53:8000/", {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      const latency = Date.now() - startTime;
      setStatus({
        online: true,
        latency,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        message: data.message || "Koneksi Berhasil"
      });
    } catch (err) {
      setStatus({
        online: false,
        latency: null,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        message: "Server tidak merespon (Offline)"
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Run initial check and set intervals
  useEffect(() => {
    checkConnection();
    
    // Auto-ping every 10 seconds
    const pingInterval = setInterval(checkConnection, 10000);

    // Simulate minor live resource usage fluctuation
    const resourceInterval = setInterval(() => {
      setRamUsage(prev => {
        const delta = (Math.random() - 0.5) * 0.1;
        return parseFloat(Math.min(Math.max(prev + delta, 3.8), 4.8).toFixed(2));
      });
      setCpuUsage(prev => {
        const delta = Math.round((Math.random() - 0.5) * 6);
        return Math.min(Math.max(prev + delta, 15), 75);
      });
    }, 3000);

    return () => {
      clearInterval(pingInterval);
      clearInterval(resourceInterval);
    };
  }, [checkConnection]);

  // Server Load Trend Data (Line chart points)
  const lineChartData = [
    { month: "Jan", load: 22 },
    { month: "Feb", load: 45 },
    { month: "Mar", load: 30 },
    { month: "Apr", load: 82 }, // Peak load
    { month: "May", load: 50 },
    { month: "Jun", load: 65 }
  ];

  // SVG parameters for Line Chart
  const svgWidth = 500;
  const svgHeight = 220;
  const padding = 40;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  const getX = (index: number) => padding + (index * (chartWidth / (lineChartData.length - 1)));
  const getY = (value: number) => svgHeight - padding - (value * (chartHeight / 100));

  // Generate SVG path for the line
  const linePath = lineChartData.reduce((path, item, idx) => {
    return path + `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(item.load)}`;
  }, "");

  // Generate SVG area path for gradient fill
  const areaPath = `${linePath} L ${getX(lineChartData.length - 1)} ${svgHeight - padding} L ${getX(0)} ${svgHeight - padding} Z`;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800 overflow-hidden">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <Sidebar />

      {/* ================= RIGHT SIDE CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ================= TOP BAR ================= */}
        <TopBar />

        {/* ================= MAIN CONTENT BODY ================= */}
        <main className="flex-1 overflow-y-auto p-8 bg-linear-to-br from-[#F8FAFC] to-[#EEF2FF]">
          
          {/* Title Area */}
          <div className="mb-8" data-aos="fade-down">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-asgard-primary/5 border border-asgard-primary/10 text-asgard-primary text-xs font-bold mb-3">
              <Activity size={14} className="animate-pulse text-green-500" />
              Sistem Pemantauan Infrastruktur
            </div>
            <h1 className="text-3xl font-black text-asgard-primary tracking-tight">
              Server Monitoring
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium leading-relaxed">
              Dashboard pemantauan load server untuk deteksi dini serangan cyber dan load tak wajar.
            </p>
          </div>

          {/* ================= STATS CARDS GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* RAM Usage Card */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(22,29,111,0.02)] flex flex-col justify-between" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                  <Cpu size={22} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RAM Usage</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-800">{ramUsage} GB</p>
                  <p className="text-xs font-bold text-slate-400 mt-1">Kapasitas: 8.0 GB</p>
                </div>
                
                {/* Circular Gauge Indicator */}
                <div className="relative h-16 w-16">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500 transition-all duration-500 ease-out"
                      strokeWidth="3.5"
                      strokeDasharray={`${(ramUsage / 8.0) * 100}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700">
                    {Math.round((ramUsage / 8.0) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Card */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(22,29,111,0.02)] flex flex-col justify-between" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                  <HardDrive size={22} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disk Storage</span>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-2xl font-black text-slate-800">50.1 GB</p>
                  <p className="text-xs font-bold text-slate-400">Total: 256 GB</p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(50.1 / 256) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-slate-400">
                  <span>Terpakai: 19.5%</span>
                  <span>Sisa: 205.9 GB</span>
                </div>
              </div>
            </div>

            {/* Backend Server Status Card (Interactive) */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(22,29,111,0.02)] flex flex-col justify-between" data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                  <Server size={22} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Server Backend</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">IP SERVER</span>
                    <span className="text-sm font-black text-slate-800 tracking-tight">100.126.164.53:8000</span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      status.online === null 
                        ? "bg-amber-400 animate-pulse" 
                        : status.online 
                          ? "bg-green-500 animate-[ping_2s_infinite]" 
                          : "bg-red-500"
                    }`} />
                    <span className="text-[10px] font-black uppercase text-slate-700">
                      {status.online === null 
                        ? "Checking" 
                        : status.online 
                          ? "Online" 
                          : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-400">
                    {status.latency && <span>Latency: <strong className="text-slate-700">{status.latency} ms</strong></span>}
                    {!status.latency && <span>Pengecekan gagal</span>}
                  </div>
                  
                  <button 
                    onClick={checkConnection}
                    disabled={isChecking}
                    className="p-1.5 bg-asgard-primary hover:bg-[#2434B5] text-white rounded-lg flex items-center gap-1 transition-all disabled:opacity-50 text-[10px] font-black"
                  >
                    <RefreshCw size={12} className={isChecking ? "animate-spin" : ""} />
                    Ping
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ================= CHARTS GRID ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Server Load Line Chart */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,29,111,0.04)]" data-aos="fade-right">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                    <TrendingUp size={18} className="text-asgard-primary" />
                    Server Load Trend (%)
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">Pemantauan persentase penggunaan resource CPU terintegrasi</p>
                </div>
                
                <div className="flex items-center gap-4 text-[10px] font-black">
                  <div className="flex items-center gap-1.5 text-blue-500">
                    <span className="w-3 h-3 bg-blue-500 rounded-full" /> Load CPU
                  </div>
                  <div className="text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                    Live Updates
                  </div>
                </div>
              </div>

              {/* Native SVG Chart */}
              <div className="relative flex justify-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible">
                  <defs>
                    {/* Glowing effect for the line */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#3B82F6" floodOpacity="0.4" />
                    </filter>
                    {/* Linear gradient for filling under the line */}
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal gridlines */}
                  {[0, 25, 50, 75, 100].map((val) => (
                    <g key={val} className="opacity-40">
                      <line
                        x1={padding}
                        y1={getY(val)}
                        x2={svgWidth - padding}
                        y2={getY(val)}
                        stroke="#E2E8F0"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding - 10}
                        y={getY(val) + 4}
                        textAnchor="end"
                        className="text-[9px] font-bold fill-slate-400"
                      >
                        {val}%
                      </text>
                    </g>
                  ))}

                  {/* Gradient area underneath */}
                  <path d={areaPath} fill="url(#areaGradient)" />

                  {/* Glowing main path */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />

                  {/* Interaction and data points */}
                  {lineChartData.map((item, idx) => {
                    const cx = getX(idx);
                    const cy = getY(item.load);
                    const isHovered = hoveredMonth === idx;

                    return (
                      <g key={idx} className="cursor-pointer">
                        {/* Hover activation area */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="16"
                          fill="transparent"
                          onMouseEnter={() => setHoveredMonth(idx)}
                          onMouseLeave={() => setHoveredMonth(null)}
                        />
                        {/* Core point */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? "7" : "5"}
                          fill="#FFFFFF"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          className="transition-all duration-200"
                        />
                        {/* Month labels */}
                        <text
                          x={cx}
                          y={svgHeight - 15}
                          textAnchor="middle"
                          className={`text-[10px] font-black transition-colors ${
                            isHovered ? "fill-blue-600 font-black" : "fill-slate-400"
                          }`}
                        >
                          {item.month}
                        </text>

                        {/* Custom Tooltip */}
                        {isHovered && (
                          <g>
                            <rect
                              x={cx - 35}
                              y={cy - 35}
                              width="70"
                              height="24"
                              rx="6"
                              fill="#1E293B"
                              className="shadow-md"
                            />
                            <text
                              x={cx}
                              y={cy - 19}
                              textAnchor="middle"
                              fill="#FFFFFF"
                              className="text-[9px] font-bold"
                            >
                              Load: {item.load}%
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Storage Allocation Donut Chart */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,29,111,0.04)]" data-aos="fade-left">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-1">
                  <Database size={18} className="text-asgard-primary" />
                  Storage Allocation Breakdown
                </h3>
                <p className="text-[11px] font-bold text-slate-400">Pembagian alokasi ruang disk sistem ASGARD</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-6 items-center mt-6">
                
                {/* SVG Donut */}
                <div className="flex justify-center relative">
                  <svg width="180" height="180" viewBox="0 0 200 200" className="transform -rotate-90">
                    <circle cx="100" cy="100" r="75" fill="transparent" stroke="#F1F5F9" strokeWidth="20" />
                    
                    {/* Free Space segment (35%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="75"
                      fill="transparent"
                      stroke="#E2E8F0"
                      strokeWidth="20"
                      strokeDasharray="471.2"
                      strokeDashoffset="164.9" // 35% of 471.2
                    />
                    
                    {/* ML Model segment (30%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="75"
                      fill="transparent"
                      stroke="#FFC107"
                      strokeWidth="20"
                      strokeDasharray="471.2"
                      strokeDashoffset="329.8" // 30% of 471.2
                      transform="rotate(126 100 100)" // 35% * 360 = 126
                    />

                    {/* App Data segment (25%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="75"
                      fill="transparent"
                      stroke="#22C55E"
                      strokeWidth="20"
                      strokeDasharray="471.2"
                      strokeDashoffset="353.4" // 25% of 471.2
                      transform="rotate(234 100 100)" // (35% + 30%) * 360 = 234
                    />

                    {/* System segment (10%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="75"
                      fill="transparent"
                      stroke="#EF4444"
                      strokeWidth="20"
                      strokeDasharray="471.2"
                      strokeDashoffset="424.1" // 10% of 471.2
                      transform="rotate(324 100 100)" // (35% + 30% + 25%) * 360 = 324
                    />
                  </svg>
                  
                  {/* Center percentage label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-800">19.5%</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Terpakai</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 bg-[#22C55E] rounded-md flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-600">App Data</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">12.5 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 bg-[#FFC107] rounded-md flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-600">ML Model</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">25.0 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 bg-[#EF4444] rounded-md flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-600">System</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">12.6 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 bg-[#E2E8F0] rounded-md flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-600">Free Space</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">205.9 GB</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ================= BOTTOM PREVIEW/UTILITY CARD ================= */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,29,111,0.04)] mb-8" data-aos="fade-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <CirclePlay size={20} className="text-asgard-primary" />
                  Web Server Connectivity & Preview
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Memantau status koneksi dan merutekan request ke API server ASGARD.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600">
                    Host: <strong className="text-slate-800">100.126.164.53:8000</strong>
                  </div>
                  <div className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600">
                    Root URL: <Link href="http://100.126.164.53:8000/" target="_blank" className="text-blue-500 hover:underline inline-flex items-center gap-1">Visit <ExternalLink size={10} /></Link>
                  </div>
                  <div className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600">
                    Swagger API Docs: <Link href="http://100.126.164.53:8000/docs" target="_blank" className="text-blue-500 hover:underline inline-flex items-center gap-1">Docs <ExternalLink size={10} /></Link>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex flex-col gap-3 min-w-[220px]">
                <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#2434B5]/10 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Connection Status</span>
                  {status.online === null ? (
                    <p className="text-sm font-black text-amber-500 animate-pulse mt-1">Checking Server...</p>
                  ) : status.online ? (
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-green-600">
                      <CheckCircle size={16} />
                      <p className="text-sm font-black">Connected ({status.latency}ms)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-red-500">
                      <XCircle size={16} />
                      <p className="text-sm font-black">Failed (Offline)</p>
                    </div>
                  )}
                  {status.timestamp && (
                    <span className="text-[9px] text-slate-400 block mt-1.5">Last Checked: {status.timestamp}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
