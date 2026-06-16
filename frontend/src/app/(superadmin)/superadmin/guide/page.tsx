"use client";

import React from "react";
import {
  BookOpen, ShieldCheck, Users, Building2, Brain,
  Activity, ClipboardList, Settings2, GraduationCap,
  UserPlus, Key, Monitor, ExternalLink
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

const sections = [
  {
    icon: ShieldCheck,
    title: "Tentang Super Admin",
    desc: "Super Admin adalah tingkat akses tertinggi dalam sistem ASGARD. Anda memiliki kendali penuh atas seluruh data, pengguna, dan konfigurasi sistem. Berbeda dengan Admin Sekolah yang hanya mengelola satu instansi, Super Admin dapat melihat dan mengelola semua tenant.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Building2,
    title: "Kelola Tenant",
    desc: "Halaman untuk mengelola data sekolah atau instansi yang terdaftar di sistem. Anda dapat menambahkan tenant baru, mengedit informasi tenant, dan menonaktifkan tenant. Setiap tenant memiliki kode registrasi unik yang digunakan untuk mendaftarkan Admin Sekolah.",
    features: [
      "Tambah, edit, dan hapus tenant",
      "Lihat & salin kode registrasi tenant",
      "Setel ulang kode registrasi",
      "Aktifkan / nonaktifkan tenant",
    ],
    link: "/superadmin/kelola-tenant",
  },
  {
    icon: Users,
    title: "Kelola Akun",
    desc: "Manajemen akun pengguna di seluruh sistem. Anda dapat membuat akun Super Admin baru, Admin Sekolah, serta melihat daftar Konselor/Guru BK yang terdaftar.",
    features: [
      "Buat akun Super Admin dan Admin Sekolah",
      "Edit profil & email pengguna",
      "Aktifkan / nonaktifkan akun",
      "Hapus akun pengguna",
      "Filter berdasarkan peran (Super Admin / Admin / Konselor)",
    ],
    link: "/superadmin/kelola-akun",
  },
  {
    icon: Brain,
    title: "Kelola Model Prediksi",
    desc: "Unggah dan kelola model machine learning untuk prediksi risiko putus sekolah. Model yang diunggah akan digunakan oleh sistem untuk menganalisis data siswa.",
    features: [
      "Unggah model ML baru (.pkl / .joblib)",
      "Lihat detail model (versi, akurasi, tanggal)",
      "Aktifkan / nonaktifkan model",
      "Hapus model yang tidak digunakan",
    ],
    link: "/models",
  },
  {
    icon: GraduationCap,
    title: "Data Siswa",
    desc: "Pantau seluruh data siswa yang terdaftar di semua tenant. Halaman ini menampilkan total siswa di seluruh instansi, status, dan informasi dasar lainnya.",
    link: "/superadmin/kelola-tenant",
  },
  {
    icon: ClipboardList,
    title: "Audit Log",
    desc: "Catatan aktivitas seluruh pengguna dalam sistem. Setiap tindakan penting (login, create, update, delete) dicatat dengan informasi waktu, pengguna, dan aksi yang dilakukan.",
    features: [
      "Filter berdasarkan aksi (CREATE, UPDATE, DELETE, LOGIN)",
      "Cari berdasarkan nama atau email pengguna",
      "Lihat detail timestamp aktivitas",
    ],
    link: "/audit",
  },
  {
    icon: Activity,
    title: "Server Monitoring",
    desc: "Pantau kesehatan infrastruktur server secara real-time. Menampilkan status koneksi database PostgreSQL, Redis, dan metrik resource server (CPU, RAM, Disk).",
    features: [
      "Status koneksi database & Redis",
      "Penggunaan CPU, RAM, dan Disk",
      "Uptime server",
      "Auto-refresh setiap 30 detik",
    ],
    link: "/superadmin/monitoring",
  },
  {
    icon: Settings2,
    title: "Pengaturan Profil",
    desc: "Kelola profil dan keamanan akun Super Admin Anda. Ubah nama tampilan, alamat email, atau ganti password akun.",
    features: [
      "Ubah nama lengkap & email",
      "Ganti password akun",
      "Lihat info akun & riwayat login",
    ],
    link: "/superadmin/settings",
  },
];


const quickTips = [
  {
    icon: Key,
    title: "Kode Registrasi",
    desc: "Setiap tenant memiliki kode registrasi unik (berlaku 24 jam). Bagikan kode ini kepada Admin Sekolah yang akan mendaftar. Kode bisa di-reset kapan saja.",
  },
  {
    icon: UserPlus,
    title: "Membuat Akun Baru",
    desc: "Gunakan halaman Kelola Akun untuk membuat akun. Super Admin bisa membuat akun Super Admin lain atau Admin Sekolah. Konselor/Guru BK dibuat oleh Admin Sekolah masing-masing.",
  },
  {
    icon: Monitor,
    title: "Monitoring Rutin",
    desc: "Cek halaman Server Monitoring secara berkala untuk memastikan semua layanan berjalan normal. Perhatikan penggunaan CPU dan RAM — jika mendekati 80%, pertimbangkan upgrade server.",
  },
];

export default function SuperadminGuidePage() {
  return (
    <div className="flex h-screen bg-asgard-pale font-sans antialiased text-slate-800 overflow-hidden relative">

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-asgard-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-asgard-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 space-y-10">

          {/* Hero */}
          <div className="bg-gradient-to-br from-asgard-primary to-[#2434B5] rounded-[28px] p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-asgard-secondary text-xs font-bold uppercase tracking-widest mb-4">
              <BookOpen size={14} />
              Panduan Penggunaan
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Panduan Super Admin ASGARD
            </h1>
            <p className="text-white/70 text-base mt-3 max-w-2xl leading-relaxed">
              Selamat datang di panel Super Admin ASGARD — Sistem Deteksi Risiko Putus Sekolah.
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
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white shrink-0`}>
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

          {/* Footer */}
          <div className="text-center py-8 border-t-2 border-slate-200">
            <p className="text-xs font-bold text-slate-400">
              &copy; {new Date().getFullYear()}  ASGARD System &bull; Universitas Sebelas Maret
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
