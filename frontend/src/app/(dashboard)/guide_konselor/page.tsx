"use client";

import React from "react";
import {
  BookOpen, BrainCircuit, FileText, Settings2, 
  AlertTriangle, HeartHandshake, Search, ExternalLink
} from "lucide-react";

const sections = [
  // ... (Data sections konselor) ...
  {
    icon: HeartHandshake,
    title: "Tentang Akun Konselor",
    desc: "Sebagai Konselor/Guru BK, Anda adalah pengguna utama hasil prediksi ASGARD. Sistem akan menganalisis data siswa dan menyoroti mereka yang memiliki indikasi risiko putus sekolah agar Anda dapat melakukan pendekatan preventif lebih awal.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: AlertTriangle,
    title: "Dashboard Risiko",
    desc: "Halaman ini secara khusus menampilkan daftar siswa yang masuk dalam kategori Risiko Tinggi dan Menengah. Ini adalah prioritas utama Anda untuk dilakukan observasi.",
    features: [
      "Lihat daftar siswa berisiko tinggi",
      "Notifikasi prediksi risiko terbaru",
      "Ringkasan status intervensi saat ini",
    ],
    link: "/dashboard",
  },
  {
    icon: Search,
    title: "Eksplorasi Data Siswa",
    desc: "Lihat seluruh daftar siswa yang menjadi tanggung jawab Anda. Anda dapat mencari profil siswa spesifik dan melihat skor prediksi risiko mereka secara mendetail beserta faktor penyebabnya.",
    features: [
      "Pencarian siswa berdasarkan nama/NISN",
      "Filter berdasarkan tingkat risiko (Rendah, Menengah, Tinggi)",
      "Lihat detail atribut siswa (Kehadiran, Nilai, Ekonomi, dll)",
    ],
    link: "/dashboard/siswa",
  },
  {
    icon: BrainCircuit,
    title: "Log Intervensi & Konseling",
    desc: "Setiap kali Anda melakukan sesi konseling atau pendampingan kepada siswa berisiko, catat hasilnya di sini. Catatan ini penting untuk melihat progres siswa dari waktu ke waktu.",
    features: [
      "Tambah catatan konseling per siswa",
      "Perbarui status penanganan (Belum Ditangani, Sedang Berjalan, Selesai)",
      "Lihat riwayat intervensi sebelumnya",
    ],
    link: "/dashboard/intervensi",
  },
  {
    icon: FileText,
    title: "Laporan Evaluasi",
    desc: "Cetak atau unduh laporan hasil prediksi dan tindak lanjut konseling. Laporan ini dapat digunakan sebagai bahan evaluasi bersama pihak sekolah atau orang tua siswa.",
    features: [
      "Generate laporan PDF/Excel",
      "Filter laporan berdasarkan periode waktu",
    ],
    link: "/dashboard/laporan",
  },
  {
    icon: Settings2,
    title: "Pengaturan Profil",
    desc: "Kelola keamanan akun dan preferensi profil Anda sebagai konselor.",
    features: [
      "Ubah foto profil dan nama",
      "Ganti password akun",
    ],
    link: "/dashboard/settings",
  },
];

const quickTips = [
  // ... (Data quicktips konselor) ...
  {
    icon: AlertTriangle,
    title: "Prioritas Penanganan",
    desc: "Selalu prioritaskan siswa yang muncul di tab 'Risiko Tinggi' pada dashboard Anda. Faktor yang menonjol akan diberi highlight merah oleh sistem.",
  },
  {
    icon: HeartHandshake,
    title: "Catat Setiap Progres",
    desc: "Jangan lupa untuk selalu memperbarui status intervensi setelah memanggil siswa. Ini membantu melacak efektivitas konseling Anda.",
  },
  {
    icon: FileText,
    title: "Kerahasiaan Data",
    desc: "Prediksi model bersifat rahasia dan merupakan alat bantu (Decision Support). Lakukan validasi langsung ke siswa sebelum mengambil kesimpulan sepihak.",
  },
];

export default function KonselorGuidePage() {
  return (
    <div className="relative font-sans antialiased text-slate-800 space-y-10">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#059669] to-[#10B981] rounded-[28px] p-8 md:p-12 text-white relative z-10 shadow-sm">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-xs font-bold uppercase tracking-widest mb-4">
          <BookOpen size={14} />
          Panduan Penggunaan
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Panduan Konselor & Guru BK
        </h1>
        <p className="text-white/80 text-base mt-3 max-w-2xl leading-relaxed">
          Selamat datang di panel Konselor ASGARD. Manfaatkan kecerdasan buatan untuk membantu Anda mendeteksi dan mencegah risiko putus sekolah sedini mungkin.
        </p>
      </div>

      {/* Quick Tips */}
      <div className="relative z-10">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <ExternalLink size={20} className="text-emerald-600" />
          Tips Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickTips.map((tip, i) => (
            <div key={i} className="bg-white rounded-[20px] border border-slate-200 p-6 hover:border-emerald-500 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
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
          <HeartHandshake size={20} className="text-emerald-600" />
          Fitur & Fungsionalitas
        </h2>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-slate-200 hover:border-emerald-500 transition-all p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color || 'from-emerald-500 to-emerald-600'} flex items-center justify-center text-white shrink-0`}>
                  <section.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-2">{section.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">{section.desc}</p>
                  {section.features && (
                    <ul className="space-y-2 mb-4">
                      {section.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
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
  );
}