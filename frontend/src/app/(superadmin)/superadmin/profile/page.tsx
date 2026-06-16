"use client";

import React, { useState, useEffect } from "react";
import {
  User, Mail, ShieldCheck, Clock, CalendarDays,
  Save, CheckCircle, ShieldAlert, Loader2,
  Lock, LogOut, History, Globe, Eye, EyeOff,
  Monitor, X, AlertTriangle, KeyRound, Activity,
  RefreshCw, Building2
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user";
import { authService } from "@/services/auth";
import { tenantService } from "@/services/tenant";
import { AuditLog } from "@/types/audit-log";

function PasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!open) {
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      setSuccessMsg(""); setErrorMsg("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (newPassword !== confirmPassword) { setErrorMsg("Konfirmasi password tidak cocok."); return; }
    if (newPassword.length < 8) { setErrorMsg("Password baru minimal 8 karakter."); return; }
    if (oldPassword === newPassword) { setErrorMsg("Password baru tidak boleh sama dengan password lama."); return; }
    setLoading(true);
    try {
      const { post } = await import("@/lib/api-client");
      await post("/users/change_password", { old_password: oldPassword, new_password: newPassword });
      setSuccessMsg("Password berhasil diubah!");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal mengubah password.");
    } finally { setLoading(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[28px] border-2 border-slate-200 p-8 w-full max-w-lg mx-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Ganti Password</h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">Minimal 8 karakter</p>
          </div>
        </div>
        {successMsg && <div className="p-4 mb-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-2xl flex items-center gap-3 text-sm font-bold"><CheckCircle size={20} className="shrink-0 text-green-500" /><span>{successMsg}</span></div>}
        {errorMsg && <div className="p-4 mb-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-bold"><AlertTriangle size={20} className="shrink-0 text-red-500 mt-0.5" /><span>{errorMsg}</span></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Password Lama", val: oldPassword, set: setOldPassword, show: showOld, setShow: setShowOld },
            { label: "Password Baru", val: newPassword, set: setNewPassword, show: showNew, setShow: setShowNew },
            { label: "Konfirmasi Password Baru", val: confirmPassword, set: setConfirmPassword, show: showConfirm, setShow: setShowConfirm },
          ].map((f, i) => (
            <div key={i} className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">{f.label}</label>
              <div className="relative">
                <input type={f.show ? "text" : "password"} required value={f.val} onChange={(e) => f.set(e.target.value)} className="w-full px-4 pr-12 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
                <button type="button" onClick={() => f.setShow(!f.show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {f.show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-asgard-primary hover:bg-[#2434B5] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 border-2 border-asgard-primary/20 disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            Ubah Password
          </button>
        </form>
      </div>
    </div>
  );
}

function SessionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionMsg, setSessionMsg] = useState("");
  const [loginHistory, setLoginHistory] = useState<AuditLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!open) { setSessionMsg(""); return; }
    loadLoginHistory();
  }, [open]);

  const loadLoginHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await authService.getLoginHistory();
      if (res.status === "success") setLoginHistory(res.data);
    } catch { /* */ }
    finally { setHistoryLoading(false); }
  };

  const handleLogoutAll = async () => {
    setSessionLoading(true);
    setSessionMsg("");
    try {
      const res = await authService.logoutAllDevices();
      if (res.status === "success") setSessionMsg("Perangkat lain telah di-logout.");
    } catch (err: unknown) {
      setSessionMsg(err instanceof Error ? err.message : "Gagal.");
    } finally { setSessionLoading(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[28px] border-2 border-slate-200 p-8 w-full max-w-lg mx-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl">
            <LogOut size={22} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Manajemen Sesi</h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">Kelola perangkat yang terhubung ke akun Anda.</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          Jika Anda mencurigai akun Anda digunakan di perangkat lain, klik tombol di bawah.
        </p>
        <button onClick={handleLogoutAll} disabled={sessionLoading} className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
          {sessionLoading ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
          Logout Semua Perangkat
        </button>
        {sessionMsg && <p className="mt-3 text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle size={16} />{sessionMsg}</p>}

        <hr className="my-6 border-slate-200" />

        <div className="flex items-center gap-3 mb-4">
          <History size={18} className="text-blue-500" />
          <h3 className="text-sm font-extrabold text-slate-800">Riwayat Login</h3>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-6"><Loader2 size={20} className="animate-spin text-asgard-primary" /></div>
        ) : loginHistory.length === 0 ? (
          <div className="text-center py-6"><Monitor size={28} className="mx-auto text-slate-300 mb-2" /><p className="text-xs font-bold text-slate-400">Belum ada riwayat login.</p></div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {loginHistory.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
                <div className="h-8 w-8 shrink-0 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                  <Globe size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800">
                    {new Date(log.created_at).toLocaleString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500">
                    {log.ip_address ? `IP: ${log.ip_address} · ` : ""}
                    {log.details?.email ? `${log.details.email}` : "Login"}
                  </p>
                </div>
                <span className="shrink-0 px-2.5 py-1 bg-blue-50 text-blue-600 border-2 border-blue-200 rounded-lg text-[9px] font-black uppercase">Login</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuperadminProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formName, setFormName] = useState(() => user?.fullname ?? "");
  const [formEmail, setFormEmail] = useState(() => user?.email ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [tenantName, setTenantName] = useState<string | null>(null);

  useEffect(() => {
    if (user?.tenant_id) {
      tenantService.getById(user.tenant_id).then((res) => {
        if (res.data?.name) setTenantName(res.data.name);
      }).catch(() => {});
    }
  }, [user?.tenant_id]);

  useEffect(() => {
    const modal = searchParams.get("modal");
    if (modal === "password") setShowPasswordModal(true);
    else if (modal === "session") setShowSessionModal(true);
  }, [searchParams]);

  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(""), 5000); return () => clearTimeout(t); }
  }, [successMsg]);
  useEffect(() => {
    if (errorMsg) { const t = setTimeout(() => setErrorMsg(""), 7000); return () => clearTimeout(t); }
  }, [errorMsg]);

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
    } finally { setProfileLoading(false); }
  };

  const closeModals = () => {
    setShowPasswordModal(false);
    setShowSessionModal(false);
    router.replace("/superadmin/profile", undefined);
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
  const updatedAt = user.updated_at
    ? new Date(user.updated_at).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "-";

  return (
    <div className="flex h-screen bg-asgard-pale font-sans antialiased text-slate-800 overflow-hidden relative">

      <PasswordModal open={showPasswordModal} onClose={closeModals} />
      <SessionModal open={showSessionModal} onClose={closeModals} />

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

          {/* Detail Akun + Aktivitas Akun + Edit Profil & Keamanan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Detail Akun & Aktivitas Akun */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Detail Akun */}
              <div className="bg-white rounded-[24px] border-2 border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-asgard-primary to-blue-700 text-white rounded-xl">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Detail Akun</h3>
                    <p className="text-[10px] font-bold text-slate-400">Informasi dasar akun</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "Email", val: user.email },
                    { icon: ShieldCheck, label: "Peran", val: roleLabel },
                    { icon: KeyRound, label: "ID User", val: `${user.id.substring(0, 4)}...${user.id.substring(user.id.length - 4)}` },
                    { icon: CheckCircle, label: "Status", val: user.is_active ? "Aktif" : "Nonaktif" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
                      <item.icon size={16} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-extrabold text-slate-800 truncate">{item.val}</p>
                      </div>
                    </div>
                  ))}
                  {tenantName && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
                      <Building2 size={16} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Tenant</p>
                        <p className="text-xs font-extrabold text-slate-800 truncate">{tenantName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Aktivitas Akun */}
              <div className="bg-white rounded-[24px] border-2 border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Aktivitas Akun</h3>
                    <p className="text-[10px] font-bold text-slate-400">Riwayat waktu akun</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: CalendarDays, label: "Bergabung Sejak", val: createdAt },
                    { icon: Clock, label: "Terakhir Login", val: lastLogin },
                    { icon: RefreshCw, label: "Terakhir Diperbarui", val: updatedAt },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
                      <item.icon size={16} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-extrabold text-slate-800 truncate">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Edit Profil + Keamanan */}
            <div className="space-y-6">
              {/* Edit Profil */}
              <div className="bg-white rounded-[24px] border-2 border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-xl">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Edit Profil</h3>
                    <p className="text-[10px] font-bold text-slate-400">Nama & email</p>
                  </div>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-3">
                  <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nama Lengkap" className="w-full px-3.5 h-[42px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-xs font-bold text-slate-800" />
                  <input type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="Email" className="w-full px-3.5 h-[42px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-xs font-bold text-slate-800" />
                  <button type="submit" disabled={profileLoading} className="w-full py-3 bg-asgard-primary hover:bg-[#2434B5] text-white font-extrabold rounded-xl transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-2">
                    {profileLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Simpan
                  </button>
                </form>
              </div>

              {/* Ganti Password */}
              <button onClick={() => { setShowPasswordModal(true); router.replace("/superadmin/profile?modal=password", undefined); }} className="w-full bg-white rounded-[24px] border-2 border-slate-200 hover:border-asgard-secondary hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-center gap-4 group text-left cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <Lock size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-800 group-hover:text-asgard-primary transition-colors">Ganti Password</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Perbarui password akun Anda</p>
                </div>
              </button>

              {/* Keamanan Sesi */}
              <button onClick={() => { setShowSessionModal(true); router.replace("/superadmin/profile?modal=session", undefined); }} className="w-full bg-white rounded-[24px] border-2 border-slate-200 hover:border-asgard-secondary hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-center gap-4 group text-left cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldAlert size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-800 group-hover:text-asgard-primary transition-colors">Keamanan Sesi</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Logout perangkat lain & riwayat login</p>
                </div>
              </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
