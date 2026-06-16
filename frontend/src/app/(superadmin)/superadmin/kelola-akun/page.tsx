"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  CheckCircle, 
  Loader2, 
  X, 
  UserPlus,
  School,
  Mail,
  UserCheck,
  Lock,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Bottombar from "@/components/Bottombar";
import { userService, Tenant } from "@/services/user";
import { User, UserRole, SuperadminStaffCreateDTO } from "@/types/user";

export default function KelolaAkunPage() {
 const { user: currentUser } = useAuth();
 
 const [users, setUsers] = useState<User[]>([]);
 const [tenants, setTenants] = useState<Tenant[]>([]);
 const [loading, setLoading] = useState(true);
 const [actionLoading, setActionLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");
 const [successMsg, setSuccessMsg] = useState("");

 const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "SUPERADMIN" | "ADMIN" | "COUNSELOR">("ALL");
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5;

 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

 const [selectedUser, setSelectedUser] = useState<User | null>(null);
 const [formData, setFormData] = useState({
 fullname: "",
 email: "",
 password: "",
 role: "admin",
 tenant_id: "",
 is_active: true
 });

 const loadData = async () => {
 setLoading(true);
 setErrorMsg("");
 try {
  const [usersRes, tenantsRes] = await Promise.all([
   userService.getAllUsers(0, 10000),
  userService.getAllTenants()
  ]);
  if (usersRes.status === "success") {
  setUsers(usersRes.data);
  }
  if (tenantsRes.status === "success") {
  setTenants(tenantsRes.data);
  }
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal memuat data dari server.");
 } finally {
  setLoading(false);
 }
 };

useEffect(() => { loadData(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

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

 const handleAddAccount = async (e: React.FormEvent) => {
 e.preventDefault();
 setActionLoading(true);
 setErrorMsg("");

     try {
      if (!formData.tenant_id) {
   throw new Error("Pilihlah salah satu instansi/sekolah.");
   }

   const roleLabel = formData.role === "superadmin" ? "Super Admin" : formData.role === "admin" ? "Admin Sekolah" : "Guru BK / Konselor";

   const payload: SuperadminStaffCreateDTO = {
   fullname: formData.fullname,
   email: formData.email,
   password: formData.password,
   role: formData.role as SuperadminStaffCreateDTO["role"],
   tenant_id: formData.tenant_id,
   };
   await userService.createSuperadminStaff(payload);

   setSuccessMsg(`Akun ${roleLabel} "${formData.fullname}" berhasil dibuat!`);
   setIsAddModalOpen(false);
   resetForm();
   loadData();
  } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan akun.");
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
   const updatePayload: { fullname: string; is_active: boolean; email?: string } = {
   fullname: formData.fullname, is_active: formData.is_active
   };
   if (formData.email && formData.email !== selectedUser.email) {
   updatePayload.email = formData.email;
   }
   const updateRes = await userService.updateUser(selectedUser.id, updatePayload);

  if (updateRes.status === "success") {
  setSuccessMsg(`Profil akun "${formData.fullname}" berhasil diperbarui.`);
  setIsEditModalOpen(false);
  resetForm();
  loadData();
  }
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal memperbarui profil pengguna.");
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
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal menghapus akun pengguna.");
 } finally {
  setActionLoading(false);
 }
 };

 const getTenantName = (tenantId: string | null) => {
 if (!tenantId) return "Superadmin Portal";
 const found = tenants.find(t => t.id === tenantId);
 return found ? found.name : "Instansi Tidak Dikenal";
 };

 const filteredUsers = users.filter(user => {
 const query = searchQuery.toLowerCase();
 const matchesSearch = 
  user.fullname.toLowerCase().includes(query) ||
  user.email.toLowerCase().includes(query) ||
  getTenantName(user.tenant_id).toLowerCase().includes(query);

  if (roleFilter === "SUPERADMIN") {
   return matchesSearch && user.role === UserRole.SUPERADMIN;
  }
  if (roleFilter === "ADMIN") {
   return matchesSearch && user.role === UserRole.ADMIN;
  }
  if (roleFilter === "COUNSELOR") {
   return matchesSearch && user.role === UserRole.COUNSELOR;
  }
 return matchesSearch;
 });

 const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
 const paginatedUsers = filteredUsers.slice(
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
   
   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
   <div>
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-asgard-primary/5 border border-asgard-primary/10 text-asgard-primary text-xs font-bold uppercase tracking-widest mb-3">
    <Users size={14} />
    Manajemen Akun Terpusat
    </div>
    <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Kelola Akun</h1>
    <p className="text-slate-500 text-sm mt-1 font-medium">
    Buat dan kelola akun Admin Sekolah serta pantau daftar Guru BK/Konselor di seluruh instansi.
    </p>
   </div>
   
   <button
    onClick={openAddModal}
    className="inline-flex items-center gap-2 px-6 py-3.5 bg-asgard-secondary hover:bg-asgard-accent text-asgard-primary font-black rounded-2xl text-sm transition-all duration-300 border-2 border-asgard-accent hover:border-asgard-secondary hover:-translate-y-0.5"
   >
    <Plus size={18} strokeWidth={3} />
    Tambah Akun
   </button>
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

   <div className="bg-white rounded-[28px] border-2 border-slate-200 overflow-hidden">
   
   <div className="p-6 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
    
    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl self-start">
    <button
     onClick={() => { setRoleFilter("ALL"); setCurrentPage(1); }}
     className={`px-5 py-2.5 text-xs font-black rounded-lg transition-all ${
     roleFilter === "ALL" 
      ? "bg-white text-asgard-primary border-2 border-asgard-primary/20" 
      : "text-slate-500 hover:text-asgard-primary"
     }`}
    >
     Semua
    </button>
    <button
      onClick={() => { setRoleFilter("SUPERADMIN"); setCurrentPage(1); }}
      className={`px-5 py-2.5 text-xs font-black rounded-lg transition-all ${
      roleFilter === "SUPERADMIN" 
       ? "bg-white text-asgard-primary border-2 border-asgard-primary/20" 
       : "text-slate-500 hover:text-asgard-primary"
      }`}
     >
      Super Admin
     </button>
     <button
      onClick={() => { setRoleFilter("ADMIN"); setCurrentPage(1); }}
      className={`px-5 py-2.5 text-xs font-black rounded-lg transition-all ${
      roleFilter === "ADMIN" 
       ? "bg-white text-asgard-primary border-2 border-asgard-primary/20" 
       : "text-slate-500 hover:text-asgard-primary"
      }`}
     >
      Admin
     </button>
     <button
      onClick={() => { setRoleFilter("COUNSELOR"); setCurrentPage(1); }}
     className={`px-5 py-2.5 text-xs font-black rounded-lg transition-all ${
     roleFilter === "COUNSELOR" 
      ? "bg-white text-asgard-primary border-2 border-asgard-primary/20" 
      : "text-slate-500 hover:text-asgard-primary"
     }`}
    >
     Konselor
    </button>
    </div>

    <div className="relative max-w-sm w-full">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <input
     type="text"
     placeholder="Cari nama, email, atau instansi..."
     value={searchQuery}
     onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
     className="w-full pl-11 pr-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
    />
    </div>

   </div>

   <div className="overflow-x-auto">
    {loading ? (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
     <Loader2 size={36} className="text-asgard-primary animate-spin" />
     <p className="text-slate-400 text-xs font-bold">Memuat data pengguna...</p>
    </div>
    ) : filteredUsers.length === 0 ? (
    <div className="text-center py-20">
     <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
     <Users size={28} />
     </div>
     <p className="text-slate-800 font-extrabold">Tidak ada data ditemukan</p>
     <p className="text-slate-400 text-xs mt-1 font-medium">Coba cari dengan kata kunci lain atau buat akun baru.</p>
    </div>
    ) : (
    <table className="w-full text-left border-collapse">
     <thead>
     <tr className="bg-asgard-primary text-white">
      <th className="px-8 py-4 text-center w-[60px] font-black text-[10px] uppercase tracking-widest">No</th>
      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Nama Lengkap</th>
      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Email</th>
      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Peran</th>
      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Instansi / Tenant</th>
      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Terakhir Login</th>
      <th className="px-6 py-4 text-center font-black text-[10px] uppercase tracking-widest">Status</th>
      <th className="px-8 py-4 text-center w-[140px] font-black text-[10px] uppercase tracking-widest">Aksi</th>
     </tr>
     </thead>
     <tbody className="divide-y divide-slate-100">
     {paginatedUsers.map((user, index) => {
      const userIndex = (currentPage - 1) * itemsPerPage + index + 1;
      const isSelf = currentUser?.id === user.id;
      
      return (
      <tr key={user.id} className="hover:bg-asgard-primary/5 transition-colors group border-b-2 border-transparent hover:border-asgard-secondary/30">
       <td className="px-8 py-4 text-center font-extrabold text-slate-400 text-sm">{userIndex}</td>
       
       <td className="px-6 py-4">
       <span className="font-extrabold text-slate-800 text-sm block leading-tight">{user.fullname}</span>
       {isSelf && (
        <span className="inline-block mt-1 text-[9px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-black">Anda</span>
       )}
       </td>
       
       <td className="px-6 py-4 font-bold text-slate-500 text-sm">{user.email}</td>
       
       <td className="px-6 py-4">
       <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border-2 ${
        user.role === UserRole.SUPERADMIN 
        ? "bg-purple-50 text-purple-600 border-purple-200" 
        : user.role === UserRole.ADMIN 
         ? "bg-blue-50 text-blue-600 border-blue-200" 
         : "bg-indigo-50 text-indigo-600 border-indigo-200"
       }`}>
        {user.role === UserRole.SUPERADMIN 
        ? "Super Admin" 
        : user.role === UserRole.ADMIN 
         ? "Admin Sekolah" 
         : "Guru BK / Konselor"}
       </span>
       </td>
       
      <td className="px-6 py-4 font-extrabold text-slate-600 text-sm">
       {getTenantName(user.tenant_id)}
      </td>
      
      <td className="px-6 py-4">
       <span className="font-bold text-slate-500 text-sm flex items-center gap-1.5">
       <Clock size={14} className="shrink-0 text-slate-400" />
       {user.last_login_at
        ? new Date(user.last_login_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : "-"}
       </span>
      </td>
      
      <td className="px-6 py-4 text-center">
       <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 ${
        user.is_active 
        ? "bg-green-50 text-green-700 border-green-200" 
        : "bg-slate-50 text-slate-500 border-slate-200"
       }`}>
        <span className={`h-2 w-2 rounded-full ${user.is_active ? "bg-green-500" : "bg-slate-400"}`} />
        {user.is_active ? "Aktif" : "Nonaktif"}
       </span>
       </td>
       
       <td className="px-8 py-4 text-center">
       <div className="flex justify-center items-center gap-2">
        <button
        onClick={() => openEditModal(user)}
        className="p-2.5 hover:bg-asgard-primary/10 text-slate-500 hover:text-asgard-primary rounded-xl transition-all border-2 border-transparent hover:border-asgard-primary/20"
        title="Edit Akun"
        >
        <Edit2 size={16} />
        </button>
        
        <button
        onClick={() => openDeleteModal(user)}
        disabled={isSelf}
        className={`p-2.5 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-all border-2 border-transparent hover:border-red-200 ${
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

  {/* MODAL ADD */}
  {isAddModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
   <div className="bg-white rounded-[28px] w-full max-w-[520px] border-2 border-slate-200 overflow-hidden">
   
   <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
    <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
    <UserPlus className="text-asgard-primary" size={16} />
    Tambah Akun Baru
    </div>
    <button onClick={() => setIsAddModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
    <X size={18} />
    </button>
   </div>

   <form onSubmit={handleAddAccount} className="p-8 space-y-5">
    
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Peran / Role</label>
    <select
     value={formData.role}
     onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
     className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-extrabold text-slate-800 bg-white"
    >
     <option value="admin">Admin Sekolah</option>
     <option value="superadmin">Super Admin</option>
    </select>
    <p className="text-[11px] text-amber-600 font-bold leading-relaxed mt-1 flex items-start gap-1">
     <ShieldAlert size={14} className="shrink-0 mt-0.5" />
     <span>Superadmin dapat membuat akun Super Admin atau Admin Sekolah. Konselor/Guru BK didaftarkan langsung oleh Admin Sekolah masing-masing.</span>
    </p>
    </div>

    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Instansi / Sekolah</label>
    <div className="relative">
     <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
     <select
     value={formData.tenant_id}
     onChange={(e) => setFormData(prev => ({ ...prev, tenant_id: e.target.value }))}
      className="w-full pl-11 pr-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-extrabold text-slate-800 bg-white"
     >
     {tenants.map(t => (
      <option key={t.id} value={t.id}>{t.name}</option>
     ))}
     </select>
    </div>
    </div>

    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Nama Lengkap</label>
    <div className="relative">
     <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
     <input
     type="text"
     required
     placeholder="Contoh: Budi Santoso, M.Pd."
     value={formData.fullname}
     onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
     className="w-full pl-11 pr-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
     />
    </div>
    </div>

    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Alamat Email</label>
    <div className="relative">
     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
     <input
     type="email"
     required
     placeholder="Contoh: budi@sekolah.sch.id"
     value={formData.email}
     onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
     className="w-full pl-11 pr-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
     />
    </div>
    </div>

    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Password</label>
    <div className="relative">
     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
     <input
     type="password"
     required
     placeholder="Minimal 8 karakter"
     value={formData.password}
     onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
     className="w-full pl-11 pr-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
     />
    </div>
    </div>

    <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
    <button
     type="button"
     onClick={() => setIsAddModalOpen(false)}
     className="px-6 py-3 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
    >
     Batal
    </button>
    <button
     type="submit"
     disabled={actionLoading}
     className="px-6 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 border-2 border-asgard-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
     {actionLoading && <Loader2 size={14} className="animate-spin" />}
     Simpan Akun
    </button>
    </div>

   </form>
   </div>
  </div>
  )}

  {/* MODAL EDIT */}
  {isEditModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
   <div className="bg-white rounded-[28px] w-full max-w-[480px] border-2 border-slate-200 overflow-hidden">
   
   <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
    <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
    <Edit2 className="text-asgard-primary" size={16} />
    Edit Profil Akun
    </div>
    <button onClick={() => setIsEditModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
    <X size={18} />
    </button>
   </div>

   <form onSubmit={handleEditAccount} className="p-8 space-y-5">
    
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Nama Lengkap</label>
    <input
     type="text"
     required
     value={formData.fullname}
     onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
     className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
    />
    </div>

    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Alamat Email</label>
    <input
     type="email"
     required
     value={formData.email}
     onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
     className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800"
    />
    </div>

    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
    <div>
     <span className="text-sm font-extrabold text-slate-800 block">Status Akun Aktif</span>
     <span className="text-[10px] font-bold text-slate-500">Nonaktifkan akun untuk mencabut izin masuk.</span>
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

    <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
    <button
     type="button"
     onClick={() => setIsEditModalOpen(false)}
     className="px-6 py-3 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
    >
     Batal
    </button>
    <button
     type="submit"
     disabled={actionLoading}
     className="px-6 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 border-2 border-asgard-primary/20 disabled:opacity-50"
    >
     {actionLoading && <Loader2 size={14} className="animate-spin" />}
     Simpan Perubahan
    </button>
    </div>

   </form>
   </div>
  </div>
  )}

  {/* MODAL DELETE */}
  {isDeleteModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
   <div className="bg-white rounded-[28px] w-full max-w-[420px] border-2 border-slate-200 overflow-hidden">
   
   <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
    <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
    <Trash2 className="text-red-500" size={16} />
    Hapus Akun
    </div>
    <button onClick={() => setIsDeleteModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
    <X size={18} />
    </button>
   </div>

   <div className="p-8 text-center">
    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
    <Trash2 size={28} />
    </div>
    <h3 className="text-xl font-extrabold text-slate-800">Hapus Akun Pengguna?</h3>
    <p className="text-slate-500 text-sm mt-2 px-2 leading-relaxed font-medium">
    Apakah Anda yakin ingin menghapus akun **{selectedUser?.fullname}**? Tindakan ini permanen dan tidak dapat dibatalkan.
    </p>
   </div>

   <div className="px-8 pb-8 flex gap-3">
    <button
    type="button"
    onClick={() => setIsDeleteModalOpen(false)}
    disabled={actionLoading}
    className="flex-1 py-3.5 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 bg-white hover:bg-slate-50 transition-colors"
    >
    Batal
    </button>
    <button
    type="button"
    onClick={handleDeleteAccount}
    disabled={actionLoading}
    className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 border-2 border-red-200"
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
