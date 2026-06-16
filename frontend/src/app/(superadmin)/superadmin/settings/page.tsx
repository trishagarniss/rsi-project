"use client";

import React, { useState, useEffect } from "react";
import {
 Lock, Loader2, ShieldAlert,
 CheckCircle, Eye, EyeOff
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function SuperadminSettingsPage() {
  const [oldPassword, setOldPassword] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");

 const [pwLoading, setPwLoading] = useState(false);
 const [successMsg, setSuccessMsg] = useState("");
 const [errorMsg, setErrorMsg] = useState("");
 const [showOldPw, setShowOldPw] = useState(false);
 const [showNewPw, setShowNewPw] = useState(false);
 const [showConfirmPw, setShowConfirmPw] = useState(false);

 useEffect(() => {
 if (successMsg) { const t = setTimeout(() => setSuccessMsg(""), 5000); return () => clearTimeout(t); }
 }, [successMsg]);
 useEffect(() => {
 if (errorMsg) { const t = setTimeout(() => setErrorMsg(""), 7000); return () => clearTimeout(t); }
 }, [errorMsg]);

 const handleChangePassword = async (e: React.FormEvent) => {
 e.preventDefault();
 setErrorMsg("");

 if (newPassword !== confirmPassword) {
  setErrorMsg("Konfirmasi password tidak cocok.");
  return;
 }
  if (newPassword.length < 8) {
   setErrorMsg("Password baru minimal 8 karakter.");
   return;
  }
  if (oldPassword === newPassword) {
   setErrorMsg("Password baru tidak boleh sama dengan password lama.");
   return;
  }

  setPwLoading(true);
 try {
  const { post } = await import("@/lib/api-client");
  await post("/users/change_password", {
  old_password: oldPassword,
  new_password: newPassword,
  });
  setSuccessMsg("Password berhasil diubah!");
  setOldPassword("");
  setNewPassword("");
  setConfirmPassword("");
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal mengubah password.");
 } finally {
  setPwLoading(false);
 }
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
     <Lock size={14} />
     Keamanan Akun
    </div>
    <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Pengaturan</h1>
    <p className="text-slate-500 text-sm mt-1 font-medium">Kelola password dan pengaturan keamanan akun Anda.</p>
    </div>

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

    {/* GANTI PASSWORD */}
    <div className="bg-white rounded-[28px] border-2 border-slate-200 p-8 max-w-2xl">
     <div className="flex items-center gap-3 mb-8">
     <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl">
      <Lock size={22} />
     </div>
     <div>
      <h2 className="text-lg font-extrabold text-slate-800">Ganti Password</h2>
      <p className="text-xs font-bold text-slate-400 mt-0.5">Minimal 8 karakter</p>
     </div>
     </div>

     <form onSubmit={handleChangePassword} className="space-y-5">
     <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700">Password Lama</label>
      <div className="relative">
      <input
       type={showOldPw ? "text" : "password"}
       required
       value={oldPassword}
       onChange={(e) => setOldPassword(e.target.value)}
       className="w-full px-4 pr-12 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
      />
      <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
       {showOldPw ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      </div>
     </div>
     <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700">Password Baru</label>
      <div className="relative">
      <input
       type={showNewPw ? "text" : "password"}
       required
       value={newPassword}
       onChange={(e) => setNewPassword(e.target.value)}
       className="w-full px-4 pr-12 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
      />
      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
       {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      </div>
     </div>
     <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700">Konfirmasi Password Baru</label>
      <div className="relative">
      <input
       type={showConfirmPw ? "text" : "password"}
       required
       value={confirmPassword}
       onChange={(e) => setConfirmPassword(e.target.value)}
       className="w-full px-4 pr-12 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
      />
      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
       {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      </div>
     </div>
     <button
      type="submit"
      disabled={pwLoading}
      className="w-full py-3.5 bg-asgard-primary hover:bg-[#2434B5] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 border-2 border-asgard-primary/20 hover:border-asgard-secondary disabled:opacity-50 disabled:cursor-not-allowed"
     >
      {pwLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
      Ubah Password
     </button>
     </form>
    </div>
   </main>
   </div>
  </div>
  );
}
