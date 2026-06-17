"use client";

import React, { useEffect, useState } from "react";
import {
 Brain, Plus, Edit2, Trash2, ShieldAlert,
 CheckCircle, Loader2, X
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Bottombar from "@/components/Bottombar";
import { mlModelService } from "@/services/ml-model";
import { MlModel, MlModelUpdateDTO } from "@/types/ml-model";

export default function ModelsPage() {
 const [models, setModels] = useState<MlModel[]>([]);
 const [loading, setLoading] = useState(true);
 const [actionLoading, setActionLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");
 const [successMsg, setSuccessMsg] = useState("");

 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5;

 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

 const [selectedModel, setSelectedModel] = useState<MlModel | null>(null);
const [formData, setFormData] = useState({
  version: "",
  algorithm: "",
  file: null as File | null,
  accuracy_score: "",
  is_active: false,
});

 const loadData = async () => {
 setLoading(true);
 setErrorMsg("");
 try {
  const res = await mlModelService.getAll();
  if (res.status === "success") setModels(res.data);
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal memuat data model.");
 } finally {
  setLoading(false);
 }
 };

 useEffect(() => { loadData(); // eslint-disable-line react-hooks/set-state-in-effect
 }, []);
 useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(""), 5000); return () => clearTimeout(t); } }, [successMsg]);
 useEffect(() => { if (errorMsg) { const t = setTimeout(() => setErrorMsg(""), 7000); return () => clearTimeout(t); } }, [errorMsg]);

 const resetForm = () => setFormData({ version: "", algorithm: "", file: null, accuracy_score: "", is_active: false });

 const openAddModal = () => { resetForm(); setIsAddModalOpen(true); };

  const openEditModal = (m: MlModel) => {
  setSelectedModel(m);
  setFormData({
   version: m.version,
   algorithm: m.algorithm,
   file: null,
   accuracy_score: m.accuracy_score?.toString() || "",
   is_active: m.is_active,
  });
  setIsEditModalOpen(true);
  };

 const openDeleteModal = (m: MlModel) => { setSelectedModel(m); setIsDeleteModalOpen(true); };

  const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.file) { setErrorMsg("Pilih file .pkl terlebih dahulu."); return; }
  setActionLoading(true);
  setErrorMsg("");
  try {
   const fd = new FormData();
   fd.append("file", formData.file);
   fd.append("version", formData.version);
   fd.append("algorithm", formData.algorithm);
   if (formData.accuracy_score) fd.append("accuracy_score", formData.accuracy_score);
   fd.append("is_active", String(formData.is_active));
   await mlModelService.create(fd);
  setSuccessMsg(`Model ${data.version} berhasil ditambahkan!`);
  setIsAddModalOpen(false);
  resetForm();
  loadData();
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal menambahkan model.");
 } finally {
  setActionLoading(false);
 }
 };

 const handleUpdate = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!selectedModel) return;
 setActionLoading(true);
 setErrorMsg("");
 try {
  const data: MlModelUpdateDTO = {
  version: formData.version,
  algorithm: formData.algorithm,
  accuracy_score: formData.accuracy_score ? parseFloat(formData.accuracy_score) : undefined,
  is_active: formData.is_active,
  };
  await mlModelService.update(selectedModel.id, data);
  setSuccessMsg(`Model ${formData.version} berhasil diperbarui.`);
  setIsEditModalOpen(false);
  resetForm();
  loadData();
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal memperbarui model.");
 } finally {
  setActionLoading(false);
 }
 };

 const handleDelete = async () => {
 if (!selectedModel) return;
 setActionLoading(true);
 setErrorMsg("");
 try {
  await mlModelService.delete(selectedModel.id);
  setSuccessMsg(`Model ${selectedModel.version} berhasil dihapus.`);
  setIsDeleteModalOpen(false);
  setSelectedModel(null);
  loadData();
 } catch (err: unknown) {
  setErrorMsg(err instanceof Error ? err.message : "Gagal menghapus model.");
 } finally {
  setActionLoading(false);
 }
 };

 const totalPages = Math.ceil(models.length / itemsPerPage);
 const paginatedModels = models.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
     <Brain size={14} />
     Manajemen Model Prediksi
     </div>
     <h1 className="text-4xl font-extrabold text-asgard-primary tracking-tight">Kelola Model</h1>
     <p className="text-slate-500 text-sm mt-1 font-medium">
     Unggah dan kelola model Machine Learning untuk prediksi risiko putus sekolah.
     </p>
    </div>
    <button onClick={openAddModal} className="inline-flex items-center gap-2 px-6 py-3.5 bg-asgard-secondary hover:bg-asgard-accent text-asgard-primary font-black rounded-2xl text-sm transition-all duration-300 border-2 border-asgard-accent hover:border-asgard-secondary hover:-translate-y-0.5">
     <Plus size={18} strokeWidth={3} />
     Tambah Model
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
   <div className="overflow-x-auto">
    {loading ? (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
     <Loader2 size={36} className="text-asgard-primary animate-spin" />
     <p className="text-slate-400 text-xs font-bold">Memuat data model...</p>
    </div>
    ) : models.length === 0 ? (
     <div className="text-center py-20">
      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Brain size={24} />
      </div>
      <p className="text-slate-800 font-black">Belum ada model</p>
      <p className="text-slate-400 text-xs mt-1 font-medium">Tambahkan model ML pertama Anda.</p>
    </div>
    ) : (
    <table className="w-full text-left border-collapse">
     <thead>
      <tr className="bg-asgard-primary text-white text-[10px] font-black uppercase tracking-widest">
       <th className="px-8 py-4 text-center w-[80px]">No</th>
       <th className="px-6 py-4">Version</th>
       <th className="px-6 py-4">Algorithm</th>
       <th className="px-6 py-4">Accuracy</th>
       <th className="px-6 py-4 text-center">Status</th>
       <th className="px-6 py-4">Dibuat</th>
       <th className="px-8 py-4 text-center w-[160px]">Aksi</th>
     </tr>
     </thead>
     <tbody className="divide-y divide-slate-100">
     {paginatedModels.map((m, index) => {
      const idx = (currentPage - 1) * itemsPerPage + index + 1;
      return (
      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group border-l-4 border-l-transparent hover:border-l-asgard-secondary">
       <td className="px-8 py-4 text-center font-bold text-slate-400 text-sm">{idx}</td>
       <td className="px-6 py-4">
       <span className="font-bold text-slate-800 text-sm">{m.version}</span>
       </td>
       <td className="px-6 py-4">
       <span className="font-medium text-slate-500 text-sm">{m.algorithm}</span>
       </td>
       <td className="px-6 py-4">
       <span className="font-bold text-slate-700 text-sm">{m.accuracy_score != null ? `${(m.accuracy_score * 100).toFixed(1)}%` : "-"}</span>
       </td>
       <td className="px-6 py-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black border-2 rounded-xl ${
         m.is_active
         ? "bg-green-50 text-green-600 border-green-300"
         : "bg-slate-50 text-slate-400 border-slate-200"
        }`}>
         <span className={`h-1.5 w-1.5 rounded-full ${m.is_active ? "bg-green-500" : "bg-slate-400"}`} />
         {m.is_active ? "Aktif" : "Nonaktif"}
       </span>
       </td>
       <td className="px-6 py-4">
       <span className="font-medium text-slate-400 text-sm">{new Date(m.created_at).toLocaleDateString("id-ID")}</span>
       </td>
       <td className="px-8 py-4 text-center">
        <div className="flex justify-center items-center gap-2">
         <button onClick={() => openEditModal(m)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-asgard-primary rounded-xl transition-all border border-transparent hover:border-asgard-primary/20" title="Edit Model">
         <Edit2 size={16} />
         </button>
         <button onClick={() => openDeleteModal(m)} className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-200" title="Hapus Model">
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
   {models.length > 0 && (
    <Bottombar
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={(page) => setCurrentPage(page)}
    itemsPerPage={itemsPerPage}
    totalItems={models.length}
    />
   )}
   </div>
  </main>
  </div>

  {/* MODAL TAMBAH */}
  {isAddModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
    <div className="bg-white rounded-[28px] w-full max-w-[500px] border-2 border-slate-200 overflow-hidden">
     <div className="px-8 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2">
     <div className="flex gap-1.5">
      <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
      <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
     </div>
     <h3 className="text-sm font-black text-slate-500 ml-2">
      Tambah Model Baru
     </h3>
     <button onClick={() => setIsAddModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
      <X size={16} />
     </button>
     </div>
    <form onSubmit={handleCreate} className="p-8 space-y-5">
     <div className="space-y-1.5">
     <label className="block text-xs font-bold text-slate-700">Versi <span className="text-red-500">*</span></label>
     <input type="text" required placeholder="v1.0.0" value={formData.version} onChange={(e) => setFormData(p => ({ ...p, version: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:border-asgard-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800" />
     </div>
     <div className="space-y-1.5">
     <label className="block text-xs font-bold text-slate-700">Algoritma <span className="text-red-500">*</span></label>
     <input type="text" required placeholder="Random Forest" value={formData.algorithm} onChange={(e) => setFormData(p => ({ ...p, algorithm: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:border-asgard-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800" />
     </div>
      <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700">File Model (.pkl) <span className="text-red-500">*</span></label>
      <input type="file" accept=".pkl" required onChange={(e) => setFormData(p => ({ ...p, file: e.target.files?.[0] || null }))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-asgard-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-asgard-primary file:text-white hover:file:bg-[#2434B5]" />
      </div>
     <div className="space-y-1.5">
     <label className="block text-xs font-bold text-slate-700">Accuracy Score (0.0 - 1.0)</label>
     <input type="number" step="0.01" min="0" max="1" placeholder="0.95" value={formData.accuracy_score} onChange={(e) => setFormData(p => ({ ...p, accuracy_score: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:border-asgard-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800" />
     </div>
     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
     <div>
      <span className="text-sm font-bold text-slate-800 block">Aktifkan Model</span>
      <span className="text-[10px] font-bold text-slate-400">Model aktif akan digunakan untuk prediksi.</span>
     </div>
     <label className="relative inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))} className="sr-only peer" />
      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
     </label>
     </div>
     <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
     <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 border-2 border-slate-200 text-xs font-black rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors">Batal</button>
     <button type="submit" disabled={actionLoading} className="px-6 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-2xl transition-all flex items-center gap-1.5 border-2 border-asgard-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
      {actionLoading && <Loader2 size={14} className="animate-spin" />}
      Simpan Model
     </button>
     </div>
    </form>
   </div>
  </div>
  )}

  {/* MODAL EDIT */}
  {isEditModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
    <div className="bg-white rounded-[28px] w-full max-w-[500px] border-2 border-slate-200 overflow-hidden">
     <div className="px-8 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2">
     <div className="flex gap-1.5">
      <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
      <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
     </div>
     <h3 className="text-sm font-black text-slate-500 ml-2">
      Edit Model
     </h3>
     <button onClick={() => setIsEditModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
      <X size={16} />
     </button>
     </div>
    <form onSubmit={handleUpdate} className="p-8 space-y-5">
     <div className="space-y-1.5">
     <label className="block text-xs font-bold text-slate-700">Versi</label>
     <input type="text" required value={formData.version} onChange={(e) => setFormData(p => ({ ...p, version: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:border-asgard-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800" />
     </div>
     <div className="space-y-1.5">
     <label className="block text-xs font-bold text-slate-700">Algoritma</label>
     <input type="text" required value={formData.algorithm} onChange={(e) => setFormData(p => ({ ...p, algorithm: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:border-asgard-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800" />
     </div>
     <div className="space-y-1.5">
     <label className="block text-xs font-bold text-slate-700">Accuracy Score (0.0 - 1.0)</label>
     <input type="number" step="0.01" min="0" max="1" value={formData.accuracy_score} onChange={(e) => setFormData(p => ({ ...p, accuracy_score: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:border-asgard-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800" />
     </div>
     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
     <div>
      <span className="text-sm font-bold text-slate-800 block">Aktifkan Model</span>
      <span className="text-[10px] font-bold text-slate-400">Model aktif akan digunakan untuk prediksi.</span>
     </div>
     <label className="relative inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))} className="sr-only peer" />
      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
     </label>
     </div>
     <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
     <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 border-2 border-slate-200 text-xs font-black rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors">Batal</button>
     <button type="submit" disabled={actionLoading} className="px-6 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-2xl transition-all flex items-center gap-1.5 border-2 border-asgard-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
      {actionLoading && <Loader2 size={14} className="animate-spin" />}
      Simpan Perubahan
     </button>
     </div>
    </form>
   </div>
  </div>
  )}

  {/* MODAL HAPUS */}
  {isDeleteModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
    <div className="bg-white rounded-[28px] w-full max-w-[400px] border-2 border-slate-200 overflow-hidden">
     <div className="px-8 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2">
     <div className="flex gap-1.5">
      <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
      <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
     </div>
     <h3 className="text-sm font-black text-slate-500 ml-2">Konfirmasi Hapus</h3>
     </div>
     <div className="p-6 text-center">
     <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
      <Trash2 size={28} />
     </div>
     <h3 className="text-lg font-black text-slate-800">Hapus Model?</h3>
     <p className="text-slate-400 text-xs mt-2 px-4 leading-relaxed font-medium">
      Apakah Anda yakin ingin menghapus model <strong>{selectedModel?.version}</strong>?
     </p>
     </div>
     <div className="p-6 bg-slate-50/50 border-t-2 border-slate-100 flex gap-3">
     <button type="button" onClick={() => setIsDeleteModalOpen(false)} disabled={actionLoading} className="flex-1 py-3.5 border-2 border-slate-200 text-xs font-black rounded-2xl text-slate-500 bg-white hover:bg-slate-50 transition-colors">Batal</button>
     <button type="button" onClick={handleDelete} disabled={actionLoading} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5 border-2 border-red-200">
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
