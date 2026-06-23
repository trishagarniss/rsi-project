"use client";

import React from "react";
import {
  BookOpen, ShieldCheck, Users, GraduationCap,
  ClipboardList, BarChart3, MessageSquareMore,
  UserPlus, Brain, Settings2, ExternalLink, Key,
  UserCog, Bell, LayoutDashboard
} from "lucide-react";

const sections = [
  {
    icon: LayoutDashboard,
    title: "Beranda",
    desc: "Halaman utama yang menampilkan ringkasan data siswa, jumlah siswa berisiko, grafik distribusi risiko, dan daftar siswa kritis yang butuh perhatian segera.",
    link: "/dashboard",
  },
  {
    icon: Users,
    title: "Manajemen Siswa",
    desc: "Kelola seluruh data siswa dalam satu tempat. Klik siswa untuk membuka halaman detail yang dilengkapi tab untuk mengisi berbagai data pendukung prediksi.",
    features: [
      "Tambah, edit, cari, dan hapus siswa",
      "Filter jenis kelamin & status aktif",
      "Tab Biodata — data diri siswa",
      "Tab Akademik — nilai rata-rata, mata pelajaran gagal, tugas tidak lengkap",
      "Tab Absensi — jumlah hadir, sakit, izin, alpha per semester",
      "Tab Sosial Ekonomi — penghasilan ortu, KIP, status tempat tinggal, pekerjaan siswa",
      "Tab Prediksi — lihat hasil prediksi & riwayat",
    ],
    link: "/student",
  },
  {
    icon: Brain,
    title: "Prediksi Risiko",
    desc: "Jalankan prediksi risiko putus sekolah untuk semua siswa. Upload CSV data siswa, akademik, absensi, dan sosial ekonomi — data otomatis masuk database dan prediksi langsung dijalankan jika fitur lengkap.",
    features: [
      "Upload CSV data siswa",
      "Upload CSV data akademik",
      "Upload CSV data absensi",
      "Upload CSV data sosial ekonomi",
      "Prediksi otomatis saat data lengkap",
      "Notifikasi jika ada data yang kurang",
    ],
    link: "/prediction",
  },
  {
    icon: BarChart3,
    title: "Laporan",
    desc: "Akses laporan dan analitik data siswa, hasil prediksi, dan riwayat audit. Gunakan data ini untuk evaluasi dan pengambilan keputusan di tingkat sekolah.",
    link: "/reports",
  },
  {
    icon: UserCog,
    title: "Manajemen Akun",
    desc: "Kelola akun pengguna di sekolah. Admin dapat membuat akun Guru BK (Counselor), mengedit profil, mengaktifkan atau menonaktifkan akun, serta menghapus akun. Admin hanya bisa mengelola akun di tenantnya sendiri dan tidak bisa menghapus sesama admin.",
    features: [
      "Buat akun Counselor/Guru BK",
      "Edit profil & email pengguna",
      "Aktifkan / nonaktifkan akun",
      "Hapus akun pengguna",
    ],
    link: "/manage-accounts",
  },
  {
    icon: Bell,
    title: "Notifikasi",
    desc: "Pusat notifikasi sistem yang menampilkan aktivitas penting seperti hasil prediksi, perubahan data siswa, dan peringatan sistem.",
    link: "/notification",
  },
  {
    icon: Settings2,
    title: "Pengaturan",
    desc: "Konfigurasi sekolah seperti tahun ajaran aktif, semester berjalan, dan preferensi notifikasi.",
    features: [
      "Atur tahun ajaran & semester aktif",
      "Preferensi notifikasi email",
    ],
    link: "/settings",
  },
  {
    icon: ShieldCheck,
    title: "Profil & Keamanan Akun",
    desc: "Kelola profil pribadi dan keamanan akun. Fitur ini bisa diakses dari menu dropdown di pojok kanan atas.",
    features: [
      "Lihat detail akun (email, role, tenant)",
      "Ubah nama lengkap & email",
      "Ganti password",
      "Logout dari perangkat lain",
      "Riwayat login",
    ],
    link: "/profile",
  },
];

const quickTips = [
  {
    icon: UserPlus,
    title: "Input Data Siswa",
    desc: "Mulai dari Manajemen Siswa. Isi biodata, lalu buka detail siswa untuk mengisi data akademik, absensi, dan sosial ekonomi di tab yang tersedia.",
  },
  {
    icon: Brain,
    title: "Prediksi Cepat",
    desc: "Setelah semua data siswa lengkap, gunakan halaman Prediksi Risiko untuk upload CSV atau jalankan prediksi massal. Sistem akan memberitahu jika ada data yang kurang.",
  },
  {
    icon: Key,
    title: "Keamanan Akun",
    desc: "Ganti password secara berkala melalui halaman Profil. Gunakan fitur Logout Semua Perangkat jika mencurigai akun digunakan di tempat lain.",
  },
];

const roleComparison = [
  {
    feature: "Manajemen Siswa (Tambah, Edit, Hapus)",
    admin: true,
    counselor: false,
  },
  {
    feature: "Input Data Akademik, Absensi, Ekonomi",
    admin: true,
    counselor: true,
  },
  {
    feature: "Prediksi Risiko & Upload CSV",
    admin: true,
    counselor: false,
  },
  {
    feature: "Manajemen Akun (Buat/Edit/Hapus Counselor)",
    admin: true,
    counselor: false,
  },
  {
    feature: "Laporan & Audit Log",
    admin: true,
    counselor: false,
  },
  {
    feature: "Notifikasi Sistem",
    admin: true,
    counselor: true,
  },
  {
    feature: "Pengaturan Sekolah",
    admin: true,
    counselor: false,
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-10 relative">

      {/* Hero */}
      <div className="bg-gradient-to-br from-asgard-primary to-[#2434B5] rounded-[28px] p-8 md:p-12 text-white">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-asgard-secondary text-xs font-bold uppercase tracking-widest mb-4">
          <BookOpen size={14} />
          Panduan Penggunaan
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Panduan Admin Sekolah & Guru BK
        </h1>
        <p className="text-white/70 text-base mt-3 max-w-2xl leading-relaxed">
          Selamat datang di ASGARD — Sistem Deteksi Risiko Putus Sekolah.
          Panduan ini akan membantu Anda memahami setiap fitur dan cara penggunaannya.
        </p>
      </div>

      {/* Quick Tips */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <ExternalLink size={20} className="text-asgard-primary" />
          Tips Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickTips.map((tip, i) => (
            <div key={i} className="bg-white rounded-[20px] border-2 border-slate-200 p-6 hover:border-asgard-primary transition-all">
              <div className="w-10 h-10 rounded-xl bg-asgard-secondary flex items-center justify-center text-asgard-primary mb-4">
                <tip.icon size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-2">{tip.title}</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Sections */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldCheck size={20} className="text-asgard-primary" />
          Fitur & Fungsionalitas
        </h2>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-[24px] border-2 border-slate-200 hover:border-asgard-primary transition-all p-6 md:p-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-asgard-primary to-blue-700 flex items-center justify-center text-white shrink-0">
                  <section.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-2">{section.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">{section.desc}</p>
                  {section.features && (
                    <ul className="space-y-2 mb-4">
                      {section.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-asgard-secondary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.link && (
                    <a
                      href={section.link}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-asgard-primary hover:text-asgard-secondary transition-colors"
                    >
                      Buka halaman <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Perbedaan Admin vs Counselor */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldCheck size={20} className="text-asgard-primary" />
          Perbedaan Hak Akses Admin & Counselor
        </h2>
        <div className="bg-white rounded-[24px] border-2 border-slate-200 p-6 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-extrabold text-slate-800">Fitur</th>
                  <th className="text-center py-3 px-4 font-extrabold text-slate-800 w-28">Admin</th>
                  <th className="text-center py-3 px-4 font-extrabold text-slate-800 w-28">Counselor</th>
                </tr>
              </thead>
              <tbody>
                {roleComparison.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-3.5 px-4 font-bold text-slate-600">{item.feature}</td>
                    <td className="text-center py-3.5 px-4">
                      {item.admin
                        ? <span className="inline-flex items-center gap-1 text-green-600 font-extrabold text-xs bg-green-50 px-3 py-1 rounded-lg border border-green-200"><ShieldCheck size={12} />Ya</span>
                        : <span className="inline-flex items-center gap-1 text-red-500 font-extrabold text-xs bg-red-50 px-3 py-1 rounded-lg border border-red-200">Tidak</span>
                      }
                    </td>
                    <td className="text-center py-3.5 px-4">
                      {item.counselor
                        ? <span className="inline-flex items-center gap-1 text-green-600 font-extrabold text-xs bg-green-50 px-3 py-1 rounded-lg border border-green-200"><ShieldCheck size={12} />Ya</span>
                        : <span className="inline-flex items-center gap-1 text-red-500 font-extrabold text-xs bg-red-50 px-3 py-1 rounded-lg border border-red-200">Tidak</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-400 leading-relaxed">
            Admin memiliki akses penuh ke semua fitur manajemen, prediksi, dan pengaturan. Counselor hanya bisa mengelola data siswa (akademik, absensi, sosial ekonomi), melihat prediksi, dan mendapatkan notifikasi.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t-2 border-slate-200">
        <p className="text-xs font-bold text-slate-400">
          &copy; {new Date().getFullYear()} ASGARD System &bull; Universitas Sebelas Maret
        </p>
      </div>

    </div>
  );
}
