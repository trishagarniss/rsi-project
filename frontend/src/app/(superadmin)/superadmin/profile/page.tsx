"use client";

import React, { useState } from "react";
import {
  User, Mail, ShieldCheck, Clock, CalendarDays,
  Save, CheckCircle, ShieldAlert, Loader2,
  ArrowRight, Lock
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user";

export default function SuperadminProfilePage() {
  const { user, refreshUser } = useAuth();

  const [formName, setFormName] = useState(() => user?.fullname ?? "");
  const [formEmail, setFormEmail] = useState(() => user?.email ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileLoading(true);
    setErrorMsg("");
    try {
      const res = await userService.updateUser(user.id, {
        fullname: formName,
        email: formEmail !== user.email ? formEmail : undefined,
      });
      if (res.data) refreshUser(res.data);
      setSuccessMsg("Profil berhasil diperbarui!");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memperbarui profil.");
    } finally {
      setProfileLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen bg-asgard-pale items-center justify-center">
        <p className="text-slate-400 font-bold">Memuat data pengguna...</p>
      </div>
    );
  }

  const roleLabel = user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Admin Sekolah" : "Guru BK";
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "-";
  const lastLogin = user.last_login_at
    ? new Date(user.last_login_at).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "Belum pernah login";

  return (
    <div className="flex h-screen bg-asgard-pale font-sans antialiased text-slate-800 overflow-hidden relative">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-asgard-secondary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-asgard-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {successMsg && (
            <div className="p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <CheckCircle size={20} className="shrink-0 text-green-500" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-bold">
              <ShieldAlert size={20} className="shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-asgard-secondary flex items-center justify-center text-asgard-primary font-black text-2xl shrink-0 border-4 border-asgard-secondary/30">
              {user.fullname.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-asgard-primary tracking-tight">{user.fullname}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-600 border-2 border-purple-200 text-[10px] font-black uppercase">
                  <ShieldCheck size={12} />
                  {roleLabel}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 text-[10px] font-black uppercase ${
                  user.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  {user.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Akun */}
          <div className="bg-white rounded-[24px] border-2 border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-asgard-primary to-blue-700 text-white rounded-2xl">
                <User size={22} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">Info Akun</h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Data akun Anda di sistem ASGARD</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <Mail size={18} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-extrabold text-slate-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <CalendarDays size={18} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Bergabung Sejak</p>
                  <p className="text-sm font-extrabold text-slate-800">{createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <Clock size={18} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Terakhir Login</p>
                  <p className="text-sm font-extrabold text-slate-800">{lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <ShieldCheck size={18} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Peran</p>
                  <p className="text-sm font-extrabold text-slate-800">{roleLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profil */}
          <div className="bg-white rounded-[24px] border-2 border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-2xl">
                <User size={22} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">Edit Profil</h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Perbarui nama dan alamat email Anda</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-asgard-primary hover:bg-[#2434B5] text-white font-extrabold rounded-xl transition-all border-2 border-asgard-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {profileLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Simpan Perubahan
              </button>
            </form>
          </div>

          {/* Keamanan */}
          <div className="bg-white rounded-[24px] border-2 border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-2xl">
                <Lock size={22} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">Keamanan</h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Ganti password akun Anda</p>
              </div>
            </div>
            <a
              href="/superadmin/settings"
              className="inline-flex items-center gap-3 px-6 py-4 bg-slate-50 border-2 border-slate-200 hover:border-asgard-primary rounded-2xl transition-all group"
            >
              <Lock size={18} className="text-slate-400 group-hover:text-asgard-primary transition-colors" />
              <div className="flex-1">
                <p className="text-sm font-extrabold text-slate-800 group-hover:text-asgard-primary transition-colors">Ganti Password</p>
                <p className="text-[10px] font-bold text-slate-400">Buka halaman pengaturan untuk mengganti password</p>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-asgard-primary transition-colors" />
            </a>
          </div>

        </main>
      </div>
    </div>
  );
}
