'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Users, Search, Plus, Edit2, ShieldAlert,
  CheckCircle, Loader2, X, Mail, Lock, UserCog, Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/user';
import { User, UserRole, StaffCreateDTO, UserUpdateDTO } from '@/types/user';

const roleLabelMap: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  counselor: 'Konselor (BK)',
};

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ManageAccounts() {
  const { user: currentUser } = useAuth();
  const [accounts, setAccounts] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addForm, setAddForm] = useState({ fullname: '', email: '', password: '', role: UserRole.COUNSELOR });
  const [editForm, setEditForm] = useState({ fullname: '', email: '', is_active: true });

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await userService.getAllUsers(0, 10000);
      if (res.status === 'success') {
        setAccounts(res.data);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memuat data akun.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(null), 5000); return () => clearTimeout(t); }
  }, [successMsg]);
  useEffect(() => {
    if (errorMsg) { const t = setTimeout(() => setErrorMsg(null), 7000); return () => clearTimeout(t); }
  }, [errorMsg]);

  const resetAddForm = () => {
    setAddForm({ fullname: '', email: '', password: '', role: UserRole.COUNSELOR });
  };

  const openAddModal = () => {
    resetAddForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({ fullname: user.fullname, email: user.email, is_active: user.is_active });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const data: StaffCreateDTO = {
        fullname: addForm.fullname,
        email: addForm.email,
        password: addForm.password,
        role: addForm.role,
      };
      const res = await userService.createStaff(data);
      setSuccessMsg(`Akun "${res.data.fullname}" (${roleLabelMap[res.data.role]}) berhasil dibuat!`);
      setIsAddModalOpen(false);
      resetAddForm();
      loadData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal membuat akun.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const data: UserUpdateDTO = {
        fullname: editForm.fullname,
        email: editForm.email || undefined,
        is_active: editForm.is_active,
      };
      await userService.updateUser(selectedUser.id, data);
      setSuccessMsg(`Akun "${editForm.fullname}" berhasil diperbarui.`);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      loadData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memperbarui akun.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const res = await userService.deleteUser(selectedUser.id);
      if (res.status === 'success') {
        setSuccessMsg(`Akun "${selectedUser.fullname}" berhasil dinonaktifkan.`);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        loadData();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menonaktifkan akun.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch = !query || account.fullname.toLowerCase().includes(query) || account.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || account.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? account.is_active : !account.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [accounts, roleFilter, searchValue, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-asgard-primary">Manajemen Akses Sekolah</h1>
          <p className="text-slate-500 font-medium mt-1">Daftar akun Admin dan Konselor di sekolah Anda.</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center gap-2 px-6 py-3 bg-asgard-secondary hover:bg-asgard-accent text-asgard-primary font-black rounded-2xl text-sm transition-all duration-300 border-2 border-asgard-accent hover:border-asgard-secondary">
          <Plus size={18} strokeWidth={3} />
          Daftarkan Staf Baru
        </button>
      </div>

      {/* Messages */}
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

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
          <Search className="w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Cari nama staf atau email..." className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)} className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
            <option value="all">Semua Jabatan</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="counselor">Konselor (BK)</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Non-Aktif</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="text-asgard-primary animate-spin" />
            <p className="text-slate-400 text-xs font-bold">Memuat akun pengguna...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-5 font-black">Informasi Pengguna</th>
                    <th className="px-6 py-5 font-black">Hak Akses (Role)</th>
                    <th className="px-6 py-5 font-black">Status Akses</th>
                    <th className="px-6 py-5 font-black">Terakhir Login</th>
                    <th className="px-6 py-5 font-black text-center">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAccounts.map((akun) => (
                    <tr key={akun.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{akun.fullname}</p>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">{akun.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={'px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ' + (akun.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : akun.role === 'counselor' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200')}>
                          {roleLabelMap[akun.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={'w-2 h-2 rounded-full ' + (akun.is_active ? 'bg-emerald-500' : 'bg-red-400')}></span>
                          <span className="text-sm font-bold text-slate-600">{akun.is_active ? 'Aktif' : 'Non-Aktif'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{formatDateTime(akun.last_login_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          {(() => {
                            const isEditDisabled = akun.role === UserRole.SUPERADMIN || (akun.role === UserRole.ADMIN && akun.id !== currentUser?.id);
                            const editTooltip = akun.role === UserRole.SUPERADMIN ? 'Tidak dapat mengubah Superadmin' : (akun.role === UserRole.ADMIN ? 'Tidak dapat mengubah sesama Admin' : 'Ubah Akses');
                            return (
                              <button onClick={() => !isEditDisabled && openEditModal(akun)} disabled={isEditDisabled} className={'p-2.5 rounded-xl transition-all border-2 ' + (isEditDisabled ? 'text-slate-300 cursor-not-allowed border-transparent' : 'hover:bg-asgard-primary/10 text-slate-500 hover:text-asgard-primary border-transparent hover:border-asgard-primary/20')} title={editTooltip}>
                                <Edit2 size={16} />
                              </button>
                            );
                          })()}
                          {(() => {
                            const isDeleteDisabled = akun.id === currentUser?.id || akun.role === UserRole.ADMIN || akun.role === UserRole.SUPERADMIN;
                            const deleteTooltip = akun.id === currentUser?.id ? 'Tidak dapat menonaktifkan akun sendiri' : (akun.role === UserRole.ADMIN || akun.role === UserRole.SUPERADMIN ? 'Hanya dapat menonaktifkan Konselor' : 'Nonaktifkan Akun');
                            return (
                              <button onClick={() => !isDeleteDisabled && openDeleteModal(akun)} disabled={isDeleteDisabled} className={'p-2.5 rounded-xl transition-all border-2 ' + (isDeleteDisabled ? 'text-slate-300 cursor-not-allowed border-transparent' : 'hover:bg-red-50 text-slate-500 hover:text-red-500 border-transparent hover:border-red-200')} title={deleteTooltip}>
                                <Trash2 size={16} />
                              </button>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredAccounts.length === 0 && (
              <div className="border-t border-slate-100 bg-slate-50/30 px-8 py-6 text-sm font-medium text-slate-500">
                Tidak ada akun yang cocok dengan filter saat ini.
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL TAMBAH STAF */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-[480px] border-2 border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
              <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
                <UserCog className="text-asgard-primary" size={16} />
                Daftarkan Staf Baru
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" required placeholder="Contoh: Budi Santoso" value={addForm.fullname} onChange={(e) => setAddForm(p => ({ ...p, fullname: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Email <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2 px-4 h-[46px] rounded-xl border-2 border-slate-200 focus-within:border-asgard-primary transition-all">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input type="email" required placeholder="staf@sekolah.sch.id" value={addForm.email} onChange={(e) => setAddForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-800 placeholder-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Password <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2 px-4 h-[46px] rounded-xl border-2 border-slate-200 focus-within:border-asgard-primary transition-all">
                  <Lock size={16} className="text-slate-400 shrink-0" />
                  <input type="password" required placeholder="Minimal 8 karakter" value={addForm.password} onChange={(e) => setAddForm(p => ({ ...p, password: e.target.value }))} className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-800 placeholder-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Hak Akses <span className="text-red-500">*</span></label>
                <select value={addForm.role} onChange={(e) => setAddForm(p => ({ ...p, role: e.target.value as UserRole }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-extrabold text-slate-800 bg-white">
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.COUNSELOR}>Konselor (BK)</option>
                </select>
              </div>
              <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={actionLoading} className="px-6 py-3 bg-asgard-primary hover:bg-[#2434B5] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 border-2 border-asgard-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-[480px] border-2 border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
              <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
                <Edit2 className="text-asgard-primary" size={16} />
                Ubah Akses
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" required value={editForm.fullname} onChange={(e) => setEditForm(p => ({ ...p, fullname: e.target.value }))} className="w-full px-4 h-[46px] rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-asgard-primary outline-none transition-all text-sm font-bold text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Email</label>
                <div className="flex items-center gap-2 px-4 h-[46px] rounded-xl border-2 border-slate-200 focus-within:border-asgard-primary transition-all">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-800" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                <div className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${editForm.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => setEditForm(p => ({ ...p, is_active: !p.is_active }))}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${editForm.is_active ? 'translate-x-5' : ''}`} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800">Akun Aktif</p>
                  <p className="text-[10px] font-bold text-slate-500">Nonaktifkan untuk mencegah login.</p>
                </div>
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

      {/* MODAL NONAKTIFKAN */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-[420px] border-2 border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b-2 border-slate-200 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#E0443E]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#DFA123]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#1DAB34]" />
              <div className="ml-3 text-sm font-extrabold text-slate-700 flex items-center gap-2">
                <Trash2 className="text-red-500" size={16} />
                Nonaktifkan Akun
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="ml-auto p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800">Nonaktifkan Akun Pengguna?</h3>
              <p className="text-slate-500 text-sm mt-2 px-2 leading-relaxed font-medium">
                Apakah Anda yakin ingin menonaktifkan akun <strong>{selectedUser.fullname}</strong>? Akun yang dinonaktifkan tidak dapat digunakan untuk login, tetapi dapat diaktifkan kembali melalui menu edit.
              </p>
            </div>
            <div className="px-8 pb-8 flex gap-3">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} disabled={actionLoading} className="flex-1 py-3.5 border-2 border-slate-200 text-xs font-black rounded-xl text-slate-500 bg-white hover:bg-slate-50 transition-colors">Batal</button>
              <button type="button" onClick={handleDelete} disabled={actionLoading} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 border-2 border-red-200">
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                Ya, Nonaktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
