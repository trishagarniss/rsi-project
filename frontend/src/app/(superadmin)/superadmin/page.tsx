"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  Building2, Users, Brain, Activity, ChevronRight,
  TrendingUp, ShieldCheck,
  Database, BarChart3, RefreshCw
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { tenantService } from "@/services/tenant";
import { mlModelService } from "@/services/ml-model";
import { userService } from "@/services/user";
import { predictionService } from "@/services/prediction";

function useCounter(target: number, durationMs: number, enabled: boolean): number {
  const [value, setValue] = React.useState(0);
  const raf = useRef<number>(0);

  React.useEffect(() => {
    if (!enabled) return;
    setValue(0);
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, durationMs, enabled]);

  return value;
}

export default function SuperadminDashboard() {
  const { data: tenants = 0, isSuccess: tenantsLoaded } = useQuery({
    queryKey: ["dashboard", "tenants"],
    queryFn: async () => {
      const r = await tenantService.getAll();
      return r.status === "success" && Array.isArray(r.data) ? r.data.length : 0;
    },
  });

  const { data: users = 0, isSuccess: usersLoaded } = useQuery({
    queryKey: ["dashboard", "users"],
    queryFn: async () => {
      const r = await userService.getAllUsers(0, 10000);
      return r.status === "success" && Array.isArray(r.data) ? r.data.length : 0;
    },
  });

  const { data: models = 0, isSuccess: modelsLoaded } = useQuery({
    queryKey: ["dashboard", "models"],
    queryFn: async () => {
      const r = await mlModelService.getAll();
      return r.status === "success" && Array.isArray(r.data) ? r.data.length : 0;
    },
  });

  const {
    data: predicted = 0,
    isSuccess: predictedLoaded,
  } = useQuery({
    queryKey: ["dashboard", "predicted"],
    queryFn: async () => {
      const r = await predictionService.getCount();
      if (r.status === "success") {
        return r.count;
      }
      return 0;
    },
  });

  const displayTenants = useCounter(tenants, 800, tenantsLoaded);
  const displayUsers = useCounter(users, 800, usersLoaded);
  const displayModels = useCounter(models, 800, modelsLoaded);
  const displayPredicted = useCounter(predicted, 800, predictedLoaded);

  const statCards = [
    { icon: Building2, label: "Total Tenant", value: displayTenants, loaded: tenantsLoaded, color: "from-asgard-primary to-blue-700", link: "/superadmin/kelola-tenant" },
    { icon: Users, label: "Total Pengguna", value: displayUsers, loaded: usersLoaded, color: "from-indigo-600 to-blue-600", link: "/superadmin/kelola-akun" },
    { icon: Brain, label: "Model Aktif", value: displayModels, loaded: modelsLoaded, color: "from-amber-500 to-yellow-500", link: "/models" },
    { icon: Activity, label: "Siswa Terprediksi", value: displayPredicted, loaded: predictedLoaded, color: "from-emerald-500 to-green-600", link: "/superadmin/kelola-tenant" },
  ];

  const quickLinks = [
    { name: "Kelola Tenant", path: "/superadmin/kelola-tenant", desc: "Atur data sekolah/instansi", icon: Building2 },
    { name: "Kelola Akun", path: "/superadmin/kelola-akun", desc: "Kelola pengguna sistem", icon: Users },
    { name: "Kelola Model", path: "/models", desc: "Unggah & kelola ML model", icon: Brain },
    { name: "Monitoring", path: "/superadmin/monitoring", desc: "Pantau server infrastruktur", icon: Activity },
    { name: "Audit Log", path: "/audit", desc: "Lihat aktivitas sistem", icon: Database },
    { name: "Pengaturan", path: "/superadmin/settings", desc: "Atur profil & password", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-asgard-pale font-sans antialiased text-slate-800 overflow-hidden relative">

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-asgard-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-asgard-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-asgard-primary/5 border border-asgard-primary/10 text-asgard-primary text-xs font-bold uppercase tracking-widest mb-3">
                <ShieldCheck size={14} />
                Superadmin Dashboard
              </div>
              <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Beranda</h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Selamat datang kembali! Pantau status sistem ASGARD.
              </p>
            </div>
            <button
              onClick={() => { /* auto-refresh via staleTime */ }}
              disabled
              className="inline-flex items-center gap-2 px-5 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white font-black rounded-xl transition-all disabled:opacity-50 text-xs"
            >
              <RefreshCw size={14} />
              Auto-refresh 30s
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, i) => (
              <Link key={i} href={card.link}>
                <div className="group bg-white rounded-[24px] border-2 border-slate-200 hover:border-asgard-secondary hover:-translate-y-1 transition-all duration-300 p-6 flex items-center gap-5 cursor-pointer min-h-[130px]">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">{card.label}</p>
                    <p className="text-3xl font-extrabold text-asgard-primary tracking-tight">
                      {card.loaded ? card.value.toLocaleString("id-ID") : (
                        <span className="inline-block w-16 h-8 bg-slate-200 rounded-lg animate-pulse" />
                      )}
                    </p>
                    {'total' in card && card.loaded && (
                      <p className="text-xs font-bold text-slate-400 mt-0.5">dari {((card as any).total ?? 0).toLocaleString("id-ID")} siswa</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-asgard-primary" />
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Menu Cepat</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {quickLinks.map((link, i) => (
                <Link key={i} href={link.path}>
                  <div className="group bg-white rounded-[20px] border-2 border-slate-200 hover:border-asgard-secondary hover:-translate-y-1 transition-all duration-300 p-5 flex items-center gap-4 min-h-[80px]">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-asgard-primary group-hover:text-asgard-secondary transition-all duration-300 shrink-0">
                      <link.icon size={20} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-slate-800 group-hover:text-asgard-primary transition-colors">{link.name}</p>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-asgard-secondary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{link.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
