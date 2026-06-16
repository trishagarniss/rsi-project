"use client";

import React, { useEffect, useState } from "react";
import {
 Building2, Search, Plus, Edit2, Trash2, ShieldAlert,
 CheckCircle, Loader2, X, RefreshCw,
 Mail, MapPin, Key
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Bottombar from "@/components/Bottombar";
import { tenantService } from "@/services/tenant";
import { Tenant, TenantCreateDTO, TenantUpdateDTO } from "@/types/tenant";

const statusBadge = (status: string) => {
 const map: Record<string, { bg: string; dot: string; label: string }> = {
 active: { bg: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-500", label: "Aktif" },
 inactive: { bg: "bg-slate-50 border-slate-200 text-slate-500", dot: "bg-slate-400", label: "Nonaktif" },
 trial: { bg: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500", label: "Trial" },
 };
 const s = map[status] || map.inactive;
 return (
 <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 ${s.bg}`}>
  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
  {s.label}
 </span>
 );
};

export default function KelolaTenantPage() {
 const [tenants, setTenants] = useState<Tenant[]>([]);
 const [loading, setLoading] = useState(true);
 const [actionLoading, setActionLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");
 const [successMsg, setSuccessMsg] = useState("");

 const [searchQuery, setSearchQuery] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5;

 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

 const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
 const [formData, setFormData] = useState({
 name: "",
 address: "",
 contact_email: "",
 status: "active" as "active" | "inactive" | "trial",
 });
  const [regCode, setRegCode] = useState<string | null>(null);

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeModalTenant, setCodeModalTenant] = useState<Tenant | null>(null);
  const [fetchedCode, setFetchedCode] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);

  const [createdRegCode, setCreatedRegCode] = useState<string | null>(null);

 const loadData = async () => {
 setLoading(true);
 setErrorMsg("");
 try {
  const res = await tenantService.getAll();
  if (res.status === "success") {
  const sorted = [...res.data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  setTenants(sorted);
  }
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal memuat data tenant.");
 } finally {
  setLoading(false);
 }
 };

useEffect(() => { loadData(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

 useEffect(() => {
 if (successMsg) { const t = setTimeout(() => setSuccessMsg(""), 5000); return () => clearTimeout(t); }
 }, [successMsg]);
 useEffect(() => {
 if (errorMsg) { const t = setTimeout(() => setErrorMsg(""), 7000); return () => clearTimeout(t); }
 }, [errorMsg]);

 const resetForm = () => {
 setFormData({ name: "", address: "", contact_email: "", status: "active" });
 setRegCode(null);
 setSelectedTenant(null);
 };

 const openAddModal = () => {
 resetForm();
 setIsAddModalOpen(true);
 };

  const openEditModal = (t: Tenant) => {
    setSelectedTenant(t);
    setFormData({
    name: t.name,
    address: t.address || "",
    contact_email: t.contact_email || "",
    status: t.status,
    });
    setRegCode(null);
    setIsEditModalOpen(true);
    tenantService.getRegistrationCode(t.id).then(res => {
    setRegCode(res.data.registration_code);
    }).catch(() => {
    setRegCode(null);
    });
  };

 const openDeleteModal = (t: Tenant) => {
 setSelectedTenant(t);
 setIsDeleteModalOpen(true);
 };

  const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();
  setActionLoading(true);
  setErrorMsg("");
  setCreatedRegCode(null);
  try {
   const data: TenantCreateDTO = {
   name: formData.name,
   address: formData.address || undefined,
   contact_email: formData.contact_email || undefined,
   status: formData.status,
   };
   const res = await tenantService.create(data);
   const code = res.data?.registration_code || null;
   setCreatedRegCode(code);
   setSuccessMsg(`Tenant "${res.data.name}" berhasil dibuat!`);
   setIsAddModalOpen(false);
   resetForm();
   loadData();
  } catch (err: unknown) {
   setErrorMsg(err instanceof Error ? err.message : "Gagal membuat tenant.");
  } finally {
   setActionLoading(false);
  }
  };

 const handleUpdate = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!selectedTenant) return;
 setActionLoading(true);
 setErrorMsg("");
 try {
  const data: TenantUpdateDTO = {
  name: formData.name,
  address: formData.address || undefined,
  contact_email: formData.contact_email || undefined,
  status: formData.status,
  };
  await tenantService.update(selectedTenant.id, data);
  setSuccessMsg(`Tenant "${formData.name}" berhasil diperbarui.`);
  setIsEditModalOpen(false);
  resetForm();
  loadData();
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal memperbarui tenant.");
 } finally {
  setActionLoading(false);
 }
 };

 const handleDelete = async () => {
 if (!selectedTenant) return;
 setActionLoading(true);
 setErrorMsg("");
 try {
  await tenantService.delete(selectedTenant.id);
  setSuccessMsg(`Tenant "${selectedTenant.name}" berhasil dihapus.`);
  setIsDeleteModalOpen(false);
  setSelectedTenant(null);
  loadData();
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal menghapus tenant.");
 } finally {
  setActionLoading(false);
 }
 };

  const openCodeModal = async (t: Tenant) => {
    setCodeModalTenant(t);
    setFetchedCode(null);
    setIsCodeModalOpen(true);
    setCodeLoading(true);
    try {
    const res = await tenantService.getRegistrationCode(t.id);
    setFetchedCode(res.data.registration_code);
    } catch {
    setFetchedCode(null);
    } finally {
    setCodeLoading(false);
    }
  };

  const handleRegenerateCode = async () => {
 if (!selectedTenant) return;
 setActionLoading(true);
 setErrorMsg("");
 try {
  const res = await tenantService.regenerateCode(selectedTenant.id);
  setRegCode(res.data.new_registration_code);
  setSuccessMsg("Kode registrasi berhasil dibuat ulang!");
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal membuat ulang kode registrasi.");
 } finally {
  setActionLoading(false);
 }
 };

 const filteredTenants = tenants.filter((t) => {
 const q = searchQuery.toLowerCase();
 return (
  t.name.toLowerCase().includes(q) ||
  (t.address || "").toLowerCase().includes(q) ||
  (t.contact_email || "").toLowerCase().includes(q)
 );
 });

 const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
 const paginatedTenants = filteredTenants.slice(
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
    <Building2 size={14} />
    Manajemen Sekolah / Instansi
    </div>
    <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Kelola Tenant</h1>
    <p className="text-slate-500 text-sm mt-1 font-medium">
    Kelola data sekolah dan instansi yang terdaftar di platform ASGARD.
    </p>
   </div>
   <button onClick={openAddModal} className="inline-flex items-center gap-2 px-6 py-3.5 bg-asgard-secondary hover:bg-asgard-accent text-asgard-primary font-black rounded-2xl text-sm transition-all duration-300 border-2 border-asgard-accent hover:border-asgard-secondary hover:-translate-y-0.5">
    <Plus size={18} strokeWidth={3} />
    Tambah Tenant
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

    {createdRegCode && (
    <div className="bg-white rounded-[28px] border-2 border-asgard-secondary/30 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-asgard-primary">
            <Key size={20} />
            <h3 className="font-extrabold">Kode Registrasi Tenant</h3>
          </div>
          <button onClick={() => setCreatedRegCode(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3 p-4 bg-asgard-primary/5 rounded-2xl border-2 border-asgard-primary/20">
          <code className="text-2xl font-black text-asgard-primary tracking-[0.25em] select-all flex-1">{createdRegCode}</code>
          <button onClick={() => { navigator.clipboard.writeText(createdRegCode); setSuccessMsg("Kode berhasil disalin!"); }} className="px-5 py-2.5 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all border-2 border-asgard-primary/20 whitespace-nowrap">
            Salin Kode
          </button>
        </div>
        <p className="text-xs font-bold text-slate-400">Berlaku 24 jam. Bagikan kode ini ke admin sekolah untuk registrasi akun mereka.</p>
      </div>
    </div>
    )}

    <div className="bg-white rounded-[28px] border-2 border-slate-200 overflow-hidden">
   
   {/* Search / Filter Bar */}
   <div className="p-6 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
    <div className="relative max-w-sm w-full">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <input
     type="text"
     placeholder="Cari nama, alamat, atau email..."
     value={searchQuery}
     onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
     className="w-full pl-11 pr-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800 bg-white"
    />
    </div>
   </div>

   {/* Table */}
   <div className="overflow-x-auto">
    {loading ? (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
     <Loader2 size={36} className="text-asgard-primary animate-spin" />
     <p className="text-slate-400 text-xs font-bold">Memuat data tenant...</p>
    </div>
    ) : filteredTenants.length === 0 ? (
    <div className="text-center py-20">
     <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-asgard-primary group-hover:text-asgard-secondary transition-all">
     <Building2 size={28} />
     </div>
     <p className="text-slate-800 font-extrabold">Tidak ada data ditemukan</p>
     <p className="text-slate-400 text-xs mt-1 font-medium">Coba cari dengan kata kunci lain atau buat tenant baru.</p>
    </div>
    ) : (
    <table className="w-full text-left border-collapse">
     <thead>
     <tr className="bg-asgard-primary text-white">
      <th className="px-8 py-4 text-center w-[60px] font-black text-[10px] uppercase tracking-widest">No</th>
      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Nama Instansi</th>
      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Alamat</th>
      <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest">Email</th>
      <th className="px-6 py-4 text-center font-black text-[10px] uppercase tracking-widest">Status</th>
      <th className="px-8 py-4 text-center w-[140px] font-black text-[10px] uppercase tracking-widest">Aksi</th>
     </tr>
     </thead>
     <tbody className="divide-y divide-slate-100">
     {paginatedTenants.map((t, index) => {
      const idx = (currentPage - 1) * itemsPerPage + index + 1;
      return (
      <tr key={t.id} className="hover:bg-asgard-primary/5 transition-colors group border-b-2 border-transparent hover:border-asgard-secondary/30">
       <td className="px-8 py-4 text-center font-extrabold text-slate-400 text-sm">{idx}</td>
       <td className="px-6 py-4">
       <span className="font-extrabold text-slate-800 text-sm block leading-tight">{t.name}</span>
       </td>
       <td className="px-6 py-4">
       <span className="font-bold text-slate-500 text-sm flex items-center gap-1.5">
        <MapPin size={14} className="shrink-0 text-slate-400" />
        {t.address || "-"}
       </span>
       </td>
       <td className="px-6 py-4">
       <span className="font-bold text-slate-500 text-sm flex items-center gap-1.5">
        <Mail size={14} className="shrink-0 text-slate-400" />
        {t.contact_email || "-"}
       </span>
       </td>
       <td className="px-6 py-4 text-center">{statusBadge(t.status)}</td>
       <td className="px-8 py-4 text-center">
       <div className="flex justify-center items-center gap-2">
        <button onClick={() => openCodeModal(t)} className="p-2.5 hover:bg-asgard-primary/10 text-slate-500 hover:text-asgard-primary rounded-xl transition-all border-2 border-transparent hover:border-asgard-primary/20" title="Lihat Kode Registrasi">
         <Key size={16} />
        </button>
        <button onClick={() => openEditModal(t)} className="p-2.5 hover:bg-asgard-primary/10 text-slate-500 hover:text-asgard-primary rounded-xl transition-all border-2 border-transparent hover:border-asgard-primary/20" title="Edit Tenant">
         <Edit2 size={16} />
        </button>
        <button onClick={() => openDeleteModal(t)} className="p-2.5 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-all border-2 border-transparent hover:border-red-200" title="Hapus Tenant">
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

   {filteredTenants.length > 0 && (
    <Bottombar
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={(page) => setCurrentPage(page)}
    itemsPerPage={itemsPerPage}
    totalItems={filteredTenants.length}
    />
   )}
   </div>
  </main>
  </div>

  {/* MODAL TAMBAH */}
  {isAddModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
   <div className="bg-white rounded-[28px] w-full max-w-[520px] border-2 border-slate-200 overflow-hidden">
   
   {/* Mac Window Chrome */}
   <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
    <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
    <Plus className="text-asgard-primary" size={16} />
    Tambah Tenant Baru
    </div>
    <button onClick={() => setIsAddModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
    <X size={18} />
    </button>
   </div>

   <form onSubmit={handleCreate} className="p-8 space-y-5">
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Nama Instansi <span className="text-red-500">*</span></label>
    <input type="text" required placeholder="Contoh: SMAN 1 Surakarta" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
    </div>
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Alamat</label>
    <input type="text" placeholder="Jl. Contoh No. 123" value={formData.address} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
    </div>
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Email Kontak</label>
    <input type="email" placeholder="admin@sekolah.sch.id" value={formData.contact_email} onChange={(e) => setFormData(p => ({ ...p, contact_email: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
    </div>
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Status</label>
    <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as "active" | "inactive" | "trial" }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-extrabold text-slate-800 bg-white">
     <option value="active">Aktif</option>
     <option value="inactive">Nonaktif</option>
     <option value="trial">Trial</option>
    </select>
    </div>
    <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">Batal</button>
    <button type="submit" disabled={actionLoading} className="px-6 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 border-2 border-asgard-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
     {actionLoading && <Loader2 size={14} className="animate-spin" />}
     Simpan Tenant
    </button>
    </div>
   </form>
   </div>
  </div>
  )}

  {/* MODAL EDIT */}
  {isEditModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
   <div className="bg-white rounded-[28px] w-full max-w-[520px] border-2 border-slate-200 overflow-hidden">
   
   <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
    <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
    <Edit2 className="text-asgard-primary" size={16} />
    Edit Tenant
    </div>
    <button onClick={() => setIsEditModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
    <X size={18} />
    </button>
   </div>

   <form onSubmit={handleUpdate} className="p-8 space-y-5">
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Nama Instansi <span className="text-red-500">*</span></label>
    <input type="text" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
    </div>
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Alamat</label>
    <input type="text" value={formData.address} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
    </div>
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Email Kontak</label>
    <input type="email" value={formData.contact_email} onChange={(e) => setFormData(p => ({ ...p, contact_email: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
    </div>
    <div className="space-y-1.5">
    <label className="block text-xs font-extrabold text-slate-700">Status</label>
    <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as "active" | "inactive" | "trial" }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-extrabold text-slate-800 bg-white">
     <option value="active">Aktif</option>
     <option value="inactive">Nonaktif</option>
     <option value="trial">Trial</option>
    </select>
    </div>

    <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
    <div className="flex items-center justify-between">
     <div>
     <span className="text-sm font-extrabold text-slate-800 block">Kode Registrasi</span>
     <span className="text-[10px] font-bold text-slate-500">Digunakan admin sekolah untuk mendaftar.</span>
     </div>
     <button type="button" onClick={handleRegenerateCode} disabled={actionLoading} className="px-4 py-2.5 bg-asgard-primary hover:bg-[#2434B5] text-white text-[10px] font-black rounded-xl flex items-center gap-1 transition-all border-2 border-asgard-primary/20 disabled:opacity-50">
     <RefreshCw size={12} className={actionLoading ? "animate-spin" : ""} />
     Generate
     </button>
    </div>
     {regCode ? (
      <div className="flex items-center gap-2 p-3 bg-white rounded-xl border-2 border-asgard-primary/20">
      <Key size={16} className="text-asgard-primary shrink-0" />
      <code className="text-sm font-black text-asgard-primary tracking-widest">{regCode}</code>
      </div>
     ) : (
      <p className="text-xs font-bold text-slate-400">Belum ada kode registrasi. Klik Generate untuk membuat kode baru.</p>
     )}
    </div>

    <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">Batal</button>
    <button type="submit" disabled={actionLoading} className="px-6 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 border-2 border-asgard-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
     {actionLoading && <Loader2 size={14} className="animate-spin" />}
     Simpan Perubahan
    </button>
    </div>
   </form>
   </div>
  </div>
  )}

  {/* MODAL LIHAT KODE */}
  {isCodeModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
   <div className="bg-white rounded-[28px] w-full max-w-[420px] border-2 border-slate-200 overflow-hidden">

   <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
    <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
    <Key className="text-asgard-primary" size={16} />
    Kode Registrasi
    </div>
    <button onClick={() => setIsCodeModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
    <X size={18} />
    </button>
   </div>

   <div className="p-8 text-center space-y-4">
    <p className="text-slate-500 text-sm font-medium">
    Kode registrasi untuk <strong className="text-slate-800">{codeModalTenant?.name}</strong>
    </p>
    {codeLoading ? (
    <div className="flex items-center justify-center py-6">
     <Loader2 size={28} className="animate-spin text-asgard-primary" />
    </div>
    ) : fetchedCode ? (
    <div className="p-5 bg-asgard-primary/5 rounded-2xl border-2 border-asgard-primary/20">
     <code className="text-2xl font-black text-asgard-primary tracking-[0.25em] select-all">{fetchedCode}</code>
    </div>
    ) : (
    <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
     <p className="text-slate-400 font-bold text-sm">Belum ada kode registrasi. Buat kode baru melalui menu Edit.</p>
    </div>
    )}
    <p className="text-[10px] font-bold text-slate-400">
    Kode ini berlaku selama 24 jam sejak dibuat/di-generate ulang.
    </p>
   </div>

   <div className="px-8 pb-8 flex gap-3">
    <button type="button" onClick={() => setIsCodeModalOpen(false)} className="flex-1 py-3.5 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 bg-white hover:bg-slate-50 transition-colors">
    Tutup
    </button>
    {fetchedCode && (
    <button type="button" onClick={() => { navigator.clipboard.writeText(fetchedCode); }} className="flex-1 py-3.5 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all border-2 border-asgard-primary/20 flex items-center justify-center gap-1.5">
     <CheckCircle size={14} />
     Salin Kode
    </button>
    )}
   </div>
   </div>
  </div>
  )}

  {/* MODAL HAPUS */}
  {isDeleteModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
   <div className="bg-white rounded-[28px] w-full max-w-[420px] border-2 border-slate-200 overflow-hidden">
   
   <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
    <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
    <Trash2 className="text-red-500" size={16} />
    Hapus Tenant
    </div>
    <button onClick={() => setIsDeleteModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
    <X size={18} />
    </button>
   </div>

   <div className="p-8 text-center">
    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
    <Trash2 size={28} />
    </div>
    <h3 className="text-xl font-extrabold text-slate-800">Hapus Tenant?</h3>
    <p className="text-slate-500 text-sm mt-2 px-2 leading-relaxed font-medium">
    Apakah Anda yakin ingin menghapus <strong className="text-slate-800">{selectedTenant?.name}</strong>? Semua data terkait (user, siswa, dll) akan ikut terhapus.
    </p>
   </div>
   <div className="px-8 pb-8 flex gap-3">
    <button type="button" onClick={() => setIsDeleteModalOpen(false)} disabled={actionLoading} className="flex-1 py-3.5 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 bg-white hover:bg-slate-50 transition-colors">Batal</button>
    <button type="button" onClick={handleDelete} disabled={actionLoading} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 border-2 border-red-200">
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
