"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  X, 
  UserPlus,
  RefreshCw,
  School,
  Mail,
  UserCheck,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Bottombar from "@/components/Bottombar";
import { userService, Tenant } from "@/services/user";
import { User, UserRole } from "@/types/user";

export default function KelolaAkunPage() {
  const { user: currentUser } = useAuth();
  
  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search, Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "COUNSELOR">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "admin", // "admin" or "counselor"
    tenant_id: "",
    is_active: true
  });

  // Fetch Data Function
  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [usersRes, tenantsRes] = await Promise.all([
        userService.getAllUsers(0, 200),
        userService.getAllTenants()
      ]);
      if (usersRes.status === "success") {
        setUsers(usersRes.data);
      }
      if (tenantsRes.status === "success") {
        setTenants(tenantsRes.data);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Flash messages timer
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 7000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Reset form helper
  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      role: "admin",
      tenant_id: "",
      is_active: true
    });
    setSelectedUser(null);
  };

  // Open modals helper
  const openAddModal = () => {
    resetForm();
    if (tenants.length > 0) {
      setFormData(prev => ({ ...prev, tenant_id: tenants[0].id }));
    }
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullname: user.fullname,
      email: user.email,
      password: "",
      role: user.role,
      tenant_id: user.tenant_id || "",
      is_active: user.is_active
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handlers
  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");

    try {
      if (formData.role === "counselor") {
        setErrorMsg("Sebagai Superadmin, Anda hanya dapat membuat akun Admin Sekolah. Guru BK/Konselor harus didaftarkan langsung oleh Admin Sekolah di dashboard sekolah mereka.");
        setActionLoading(false);
        return;
      }

      if (!formData.tenant_id) {
        throw new Error("Pilihlah salah satu instansi/sekolah.");
      }

      // 1. Regenerate registration code for the selected school
      const codeRes = await userService.regenerateTenantCode(formData.tenant_id);
      if (codeRes.status !== "success" || !codeRes.data?.new_registration_code) {
        throw new Error("Gagal membuat kode registrasi untuk instansi.");
      }

      const regCode = codeRes.data.new_registration_code;

      // 2. Register admin using the generated code
      const registerRes = await userService.registerAdmin(regCode, {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password
      });

      setSuccessMsg(`Akun Admin Sekolah "${formData.fullname}" berhasil didaftarkan!`);
      setIsAddModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setErrorMsg(err?.message || "Terjadi kesalahan saat menambahkan akun.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);
    setErrorMsg("");

    try {
      const updateRes = await userService.updateUser(selectedUser.id, {
        fullname: formData.fullname,
        is_active: formData.is_active
      });

      if (updateRes.status === "success") {
        setSuccessMsg(`Profil akun "${formData.fullname}" berhasil diperbarui.`);
        setIsEditModalOpen(false);
        resetForm();
        loadData();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal memperbarui profil pengguna.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setErrorMsg("");

    try {
      const deleteRes = await userService.deleteUser(selectedUser.id);
      if (deleteRes.status === "success") {
        setSuccessMsg(`Akun pengguna "${selectedUser.fullname}" berhasil dihapus.`);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        loadData();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal menghapus akun pengguna.");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to resolve tenant name
  const getTenantName = (tenantId: string | null) => {
    if (!tenantId) return "Superadmin Portal";
    const found = tenants.find(t => t.id === tenantId);
    return found ? found.name : "Instansi Tidak Dikenal";
  };

  // Search & Filtering Logic
  const filteredUsers = users.filter(user => {
    // 1. Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      user.fullname.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      getTenantName(user.tenant_id).toLowerCase().includes(query);

    // 2. Role Filter
    if (roleFilter === "ADMIN") {
      return matchesSearch && user.role === UserRole.ADMIN;
    }
    if (roleFilter === "COUNSELOR") {
      return matchesSearch && user.role === UserRole.COUNSELOR;
    }
    return matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-asgard-primary/5 border border-asgard-primary/10 text-asgard-primary text-xs font-bold mb-3">
                <Users size={14} className="text-asgard-accent" />
                Manajemen Akun Terpusat
              </div>
              <h1 className="text-3xl font-black text-asgard-primary tracking-tight">
                Kelola Akun
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium leading-relaxed">
                Buat dan kelola akun Admin Sekolah serta pantau daftar Guru BK/Konselor di seluruh instansi.
              </p>
            </div>
            
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-3 bg-asgard-secondary hover:bg-[#E0A800] text-asgard-primary font-black rounded-xl text-sm transition-all duration-300 shadow-[0_10px_20px_rgba(255,193,7,0.25)] hover:shadow-[0_15px_30px_rgba(255,193,7,0.35)] hover:-translate-y-0.5"
            >
              <Plus size={18} strokeWidth={3} />
              Tambah Akun
            </button>
          </div>

          {/* Flash Alert Messages */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-xs animate-fade-in">
              <CheckCircle size={20} className="shrink-0 text-green-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-bold shadow-xs animate-fade-in">
              <ShieldAlert size={20} className="shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= TABLE & UTILITIES CONTAINER ================= */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,29,111,0.03)] overflow-hidden">
            
            {/* Action/Filter Controls Bar */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              
              {/* Tabs filter role (ALL, ADMIN, COUNSELOR) */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl self-start">
                <button
                  onClick={() => { setRoleFilter("ALL"); setCurrentPage(1); }}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                    roleFilter === "ALL" 
                      ? "bg-white text-asgard-primary shadow-xs" 
                      : "text-slate-500 hover:text-asgard-primary"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => { setRoleFilter("ADMIN"); setCurrentPage(1); }}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                    roleFilter === "ADMIN" 
                      ? "bg-white text-asgard-primary shadow-xs" 
                      : "text-slate-500 hover:text-asgard-primary"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => { setRoleFilter("COUNSELOR"); setCurrentPage(1); }}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                    roleFilter === "COUNSELOR" 
                      ? "bg-white text-asgard-primary shadow-xs" 
                      : "text-slate-500 hover:text-asgard-primary"
                  }`}
                >
                  Konselor
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau instansi..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-11 pr-4 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-asgard-primary outline-none transition-all text-sm font-medium text-slate-800"
                />
              </div>

            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 size={36} className="text-asgard-primary animate-spin" />
                  <p className="text-slate-400 text-xs font-bold">Memuat data pengguna...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20">
                  <div className="h-14 w-14 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users size={24} />
                  </div>
                  <p className="text-slate-800 font-bold">Tidak ada data ditemukan</p>
                  <p className="text-slate-400 text-xs mt-1">Coba cari dengan kata kunci lain atau buat akun baru.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                      <th className="px-8 py-4 text-center w-[80px]">No</th>
                      <th className="px-6 py-4">Nama Lengkap</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Peran</th>
                      <th className="px-6 py-4">Instansi / Tenant</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-8 py-4 text-center w-[160px]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedUsers.map((user, index) => {
                      const userIndex = (currentPage - 1) * itemsPerPage + index + 1;
                      const isSelf = currentUser?.id === user.id;
                      
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                          {/* 1. No */}
                          <td className="px-8 py-4 text-center font-bold text-slate-400 text-sm">{userIndex}</td>
                          
                          {/* 2. Nama Lengkap */}
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800 text-sm block leading-tight">{user.fullname}</span>
                            {isSelf && (
                              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-sm font-bold">Anda</span>
                            )}
                          </td>
                          
                          {/* 3. Email */}
                          <td className="px-6 py-4 font-medium text-slate-500 text-sm">{user.email}</td>
                          
                          {/* 4. Peran */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              user.role === UserRole.SUPERADMIN 
                                ? "bg-purple-50 text-purple-600 border border-purple-100" 
                                : user.role === UserRole.ADMIN 
                                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                                  : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            }`}>
                              {user.role === UserRole.SUPERADMIN 
                                ? "Super Admin" 
                                : user.role === UserRole.ADMIN 
                                  ? "Admin Sekolah" 
                                  : "Guru BK / Konselor"}
                            </span>
                          </td>
                          
                          {/* 5. Instansi / Tenant */}
                          <td className="px-6 py-4 font-bold text-slate-600 text-sm">
                            {getTenantName(user.tenant_id)}
                          </td>
                          
                          {/* 6. Status */}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              user.is_active 
                                ? "bg-green-50/80 text-green-600 border-green-100" 
                                : "bg-slate-50 text-slate-400 border-slate-200"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-green-500" : "bg-slate-400"}`} />
                              {user.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>
                          
                          {/* 7. Aksi */}
                          <td className="px-8 py-4 text-center">
                            <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-2 hover:bg-slate-100 text-slate-500 hover:text-asgard-primary rounded-xl transition-all"
                                title="Edit Akun"
                              >
                                <Edit2 size={16} />
                              </button>
                              
                              <button
                                onClick={() => openDeleteModal(user)}
                                disabled={isSelf}
                                className={`p-2 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-all ${
                                  isSelf ? "opacity-30 cursor-not-allowed" : ""
                                }`}
                                title={isSelf ? "Anda tidak bisa menghapus akun Anda sendiri" : "Hapus Akun"}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls Footer */}
            {filteredUsers.length > 0 && (
              <Bottombar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            )}

          </div>

        </main>
      </div>

      {/* ================= MODAL: ADD ACCOUNT ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-[500px] border border-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-zoom-in">
            
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <UserPlus className="text-asgard-primary" size={20} />
                Tambah Akun Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="p-8 space-y-5">
              
              {/* Form Input: Peran */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Peran / Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800 bg-white"
                >
                  <option value="admin">Admin Sekolah</option>
                  <option value="counselor">Guru BK / Konselor</option>
                </select>
                
                {formData.role === "counselor" && (
                  <p className="text-[11px] text-amber-600 font-medium leading-relaxed mt-1 flex items-start gap-1">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <span>Sebagai Superadmin, Anda hanya dapat mendaftarkan Admin Sekolah. Akun Konselor harus didaftarkan langsung oleh Admin Sekolah di dashboard sekolah mereka.</span>
                  </p>
                )}
              </div>

              {/* Form Input: Instansi / Tenant */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Instansi / Sekolah</label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={formData.tenant_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, tenant_id: e.target.value }))}
                    disabled={formData.role === "counselor"}
                    className="w-full pl-11 pr-4 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800 bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form Input: Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Nama Lengkap</label>
                <div className="relative">
                  <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, M.Pd."
                    value={formData.fullname}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                    disabled={formData.role === "counselor"}
                    className="w-full pl-11 pr-4 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-asgard-primary outline-none transition-all text-sm font-medium text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Form Input: Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="Contoh: budi@sekolah.sch.id"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={formData.role === "counselor"}
                    className="w-full pl-11 pr-4 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-asgard-primary outline-none transition-all text-sm font-medium text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Form Input: Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={formData.role === "counselor"}
                    className="w-full pl-11 pr-4 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-asgard-primary outline-none transition-all text-sm font-medium text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-xs font-black rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || formData.role === "counselor"}
                  className="px-5 py-2.5 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-[0_8px_16px_rgba(22,29,111,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  Simpan Akun
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT STATUS / NAME ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-[450px] border border-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-zoom-in">
            
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Edit2 className="text-asgard-primary" size={18} />
                Edit Profil Akun
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditAccount} className="p-8 space-y-5">
              
              {/* Form Input: Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.fullname}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                  className="w-full px-4 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-asgard-primary outline-none transition-all text-sm font-medium text-slate-800"
                />
              </div>

              {/* Form Input: Email (Readonly) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400">Alamat Email (Tidak dapat diubah)</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 h-[44px] rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm font-medium cursor-not-allowed"
                />
              </div>

              {/* Form Input: Status Keaktifan */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Status Akun Aktif</span>
                  <span className="text-[10px] font-bold text-slate-400">Nonaktifkan akun untuk mencabut izin masuk.</span>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-xs font-black rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-[0_8px_16px_rgba(22,29,111,0.15)]"
                >
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-[400px] border border-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-zoom-in">
            
            <div className="p-6 text-center">
              <div className="h-16 w-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Trash2 size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-800">Hapus Akun Pengguna?</h3>
              <p className="text-slate-400 text-xs mt-2 px-4 leading-relaxed font-medium">
                Apakah Anda yakin ingin menghapus akun **{selectedUser?.fullname}**? Tindakan ini permanen dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={actionLoading}
                className="flex-1 py-3 border border-slate-200 text-xs font-black rounded-xl text-slate-500 bg-white hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={actionLoading}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_8px_16px_rgba(239,68,68,0.15)]"
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                Ya, Hapus
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
