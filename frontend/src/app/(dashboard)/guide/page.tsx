"use client";

import React from "react";
import {
  BookOpen, ShieldCheck, Users, GraduationCap,
  ClipboardList, BarChart3, Upload, MessageSquareMore,
  UserPlus, Brain, Settings2, ExternalLink, Key,
  UserCog, CalendarCheck, Wallet
} from "lucide-react";

const sections = [
  {
    icon: GraduationCap,
    title: "Dashboard",
    desc: "Halaman utama yang menampilkan ringkasan data siswa, status risiko, dan notifikasi penting. Cocok untuk memantau kondisi sekolah secara cepat.",
    link: "/dashboard",
  },
  {
    icon: Users,
    title: "Daftar Siswa",
    desc: "Kelola data seluruh siswa di sekolah. Anda dapat menambah, mengedit, mencari, dan menghapus data siswa. Tersedia filter berdasarkan jenis kelamin dan status aktif.",
    features: [
      "Tambah siswa baru",
      "Edit data siswa",
      "Cari siswa berdasarkan nama",
      "Filter jenis kelamin & status aktif",
    ],
    link: "/student",
  },
  {
    icon: ClipboardList,
    title: "Data Akademik",
    desc: "Input dan kelola nilai akademik siswa per semester. Meliputi rata-rata nilai, jumlah mata pelajaran gagal, dan tugas tidak lengkap. Data ini digunakan sebagai faktor prediksi risiko.",
    link: "/student",
  },
  {
    icon: CalendarCheck,
    title: "Data Absensi",
    desc: "Catat dan pantau kehadiran siswa setiap semester. Meliputi jumlah hadir, sakit, izin, dan alpha. Persentase kehadiran rendah menjadi indikator risiko putus sekolah.",
    link: "/student",
  },
  {
    icon: Wallet,
    title: "Data Sosial Ekonomi",
    desc: "Kelola data latar belakang sosial ekonomi siswa seperti penghasilan orang tua, status tempat tinggal, kepemilikan KIP, dan status pekerjaan siswa.",
    link: "/student",
  },
  {
    icon: Brain,
    title: "Prediksi Risiko",
    desc: "Sistem ASGARD akan menganalisis data akademik, absensi, dan sosial ekonomi untuk memprediksi risiko putus sekolah. Hasil prediksi menampilkan status 'Berisiko' atau 'Tidak Berisiko' beserta skor risikonya.",
    features: [
      "Prediksi per siswa",
      "Prediksi semua siswa sekaligus",
      "Upload CSV untuk prediksi batch",
      "Riwayat prediksi per siswa",
    ],
    link: "/student",
  },
  {
    icon: MessageSquareMore,
    title: "Manajemen Konseling",
    desc: "Pantau siswa yang membutuhkan konseling. Tersedia filter berdasarkan status risiko untuk memprioritaskan penanganan siswa berisiko tinggi.",
    link: "/counseling",
  },
  {
    icon: BarChart3,
    title: "Laporan",
    desc: "Akses laporan dan analitik data siswa, hasil prediksi, dan riwayat audit. Gunakan data ini untuk evaluasi dan pengambilan keputusan.",
    link: "/reports",
  },
  {
    icon: Upload,
    title: "Import Data",
    desc: "Upload data siswa dalam format CSV atau Excel untuk mempercepat input data massal. Sistem akan memvalidasi data sebelum menyimpannya.",
    link: "/import",
  },
  {
    icon: UserCog,
    title: "Manajemen Akun",
    desc: "Kelola akun pengguna di sekolah. Admin dapat membuat akun Guru BK (Counselor), mengedit profil, mengaktifkan/nonaktifkan, dan menghapus akun.",
    features: [
      "Buat akun Counselor/Guru BK",
      "Edit profil & email pengguna",
      "Aktifkan / nonaktifkan akun",
      "Hapus akun pengguna",
    ],
    link: "/manage-accounts",
  },
  {
    icon: Settings2,
    title: "Pengaturan Profil",
    desc: "Kelola profil pribadi dan keamanan akun. Ubah nama tampilan, alamat email, atau ganti password akun. Pantau riwayat login dan kelola sesi perangkat.",
    features: [
      "Ubah nama lengkap & email",
      "Ganti password akun",
      "Lihat info akun & riwayat login",
      "Logout dari perangkat lain",
    ],
    link: "/profile",
  },
];

const quickTips = [
  {
    icon: UserPlus,
    title: "Input Data Siswa",
    desc: "Mulai dengan mengisi data siswa di halaman Daftar Siswa. Pastikan data NIS dan NISN unik untuk menghindari duplikasi.",
  },
  {
    icon: Brain,
    title: "Jalankan Prediksi",
    desc: "Setelah data akademik, absensi, dan sosial ekonomi terisi lengkap, jalankan prediksi untuk mengetahui siswa yang berisiko putus sekolah.",
  },
  {
    icon: Key,
    title: "Keamanan Akun",
    desc: "Ganti password secara berkala dan gunakan fitur Keamanan Sesi untuk logout dari perangkat yang tidak dikenal.",
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

      {/* Footer */}
      <div className="text-center py-8 border-t-2 border-slate-200">
        <p className="text-xs font-bold text-slate-400">
          &copy; {new Date().getFullYear()} ASGARD System &bull; Universitas Sebelas Maret
        </p>
      </div>

    </div>
  );
}
