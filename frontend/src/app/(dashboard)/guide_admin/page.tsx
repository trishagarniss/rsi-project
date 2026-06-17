"use client";

import React from "react";
import {
  BookOpen, Users, Building2, ClipboardList, Settings2, 
  GraduationCap, UserPlus, UploadCloud, PieChart, ExternalLink
} from "lucide-react";
import RoleGuard from "@/components/RoleGuard";

const sections = [
  // ... (Data sections tetap sama persis seperti sebelumnya) ...
  {
    icon: Building2,
    title: "Tentang Admin Sekolah",
    desc: "Admin Sekolah adalah pengelola utama untuk satu instansi/sekolah di dalam sistem ASGARD. Anda bertanggung jawab untuk mengelola data siswa, memantau statistik sekolah, dan memberikan akses kepada Konselor/Guru BK.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: PieChart,
    title: "Dashboard Sekolah",
    desc: "Halaman utama yang menampilkan ringkasan statistik sekolah Anda, termasuk total siswa, persentase tingkat risiko putus sekolah, dan tren performa siswa secara keseluruhan.",
    features: [
      "Lihat statistik ringkas siswa",
      "Pantau grafik distribusi risiko",
      "Akses cepat ke daftar siswa berisiko tinggi",
    ],
    link: "/dashboard",
  },
  {
    icon: Users,
    title: "Kelola Akun Konselor",
    desc: "Manajemen akun untuk staf Konselor atau Guru BK di sekolah Anda. Hanya akun yang Anda buat di sini yang dapat mengakses data prediksi siswa untuk melakukan intervensi.",
    features: [
      "Buat akun Konselor/Guru BK baru",
      "Edit profil & reset password Konselor",
      "Aktifkan / nonaktifkan akun staf",
    ],
    link: "/dashboard/kelola-konselor",
  },
  {
    icon: GraduationCap,
    title: "Kelola Data Siswa",
    desc: "Pusat manajemen data siswa. Anda dapat menambahkan siswa secara manual atau mengunggah data massal menggunakan file CSV/Excel agar dapat dianalisis oleh model Machine Learning.",
    features: [
      "Unggah data siswa massal (Import CSV/Excel)",
      "Tambah, edit, dan hapus data siswa",
      "Lihat status dan hasil prediksi sementara",
    ],
    link: "/dashboard/data-siswa",
  },
  {
    icon: ClipboardList,
    title: "Log Aktivitas Sekolah",
    desc: "Pantau aktivitas pengguna di lingkungan sekolah Anda. Melihat kapan Konselor login dan pembaruan data apa saja yang telah dilakukan terhadap profil siswa.",
    features: [
      "Lihat riwayat login Konselor",
      "Pantau perubahan data siswa",
    ],
    link: "/dashboard/audit",
  },
  {
    icon: Settings2,
    title: "Pengaturan Instansi & Profil",
    desc: "Kelola informasi profil sekolah Anda dan atur keamanan akun Admin Anda.",
    features: [
      "Perbarui profil sekolah (Nama, Alamat, Kontak)",
      "Ubah nama lengkap & email Admin",
      "Ganti password akun",
    ],
    link: "/dashboard/settings",
  },
];

const quickTips = [
  // ... (Data quickTips tetap sama) ...
  {
    icon: UploadCloud,
    title: "Import Data Massal",
    desc: "Gunakan template Excel yang disediakan di menu Data Siswa untuk menghindari error saat mengunggah ratusan data siswa sekaligus.",
  },
  {
    icon: UserPlus,
    title: "Akun Konselor",
    desc: "Pastikan Anda memberikan akses Konselor hanya kepada Guru BK atau staf yang berwenang, karena mereka akan melihat data sensitif hasil prediksi risiko siswa.",
  },
  {
    icon: PieChart,
    title: "Pantau Dashboard",
    desc: "Dashboard akan otomatis diperbarui setiap kali ada data siswa baru yang dianalisis oleh model prediksi ASGARD.",
  },
];

export default function AdminGuidePage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="relative font-sans antialiased text-slate-800 space-y-10">
      {/* Background Decorators (Opsional, dibiarkan jika ingin efek cahaya) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-[28px] p-8 md:p-12 text-white relative z-10 shadow-sm">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-widest mb-4">
          <BookOpen size={14} />
          Panduan Penggunaan
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Panduan Admin Sekolah
        </h1>
        <p className="text-white/80 text-base mt-3 max-w-2xl leading-relaxed">
          Selamat datang di panel Admin ASGARD. Panduan ini akan membantu Anda mengelola infrastruktur data siswa dan staf BK di sekolah Anda.
        </p>
      </div>

      {/* Quick Tips */}
      <div className="relative z-10">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <ExternalLink size={20} className="text-blue-600" />
          Tips Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickTips.map((tip, i) => (
            <div key={i} className="bg-white rounded-[20px] border border-slate-200 p-6 hover:border-blue-500 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <tip.icon size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-2">{tip.title}</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Sections */}
      <div className="relative z-10 pb-8">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <Building2 size={20} className="text-blue-600" />
          Fitur & Fungsionalitas
        </h2>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-slate-200 hover:border-blue-500 transition-all p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color || 'from-blue-500 to-blue-600'} flex items-center justify-center text-white shrink-0`}>
                  <section.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-2">{section.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">{section.desc}</p>
                  {section.features && (
                    <ul className="space-y-2 mb-4">
                      {section.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </RoleGuard>
  );
}