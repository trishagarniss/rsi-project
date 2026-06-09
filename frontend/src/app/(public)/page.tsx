"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Database, 
  Users, 
  Brain, 
  BarChart3, 
  ClipboardPen, 
  ArrowRight,
  ChevronDown,
  LineChart,
  SearchCheck,
  FileSpreadsheet,
  GraduationCap,
  BrainCircuit
} from 'lucide-react';

export default function HomePage() {

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <main className="w-full font-sans antialiased text-slate-800 bg-white overflow-hidden">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-20 pb-20 overflow-hidden bg-[#161D6F]">
        
        {/* --- 1. Background Image --- */}
        <Image 
          src="/hero-bg.jpg" 
          alt="Latar Belakang Pendidikan" 
          fill 
          className="object-cover object-center z-0"
          priority
        />

        {/* --- 2. Premium Overlays --- */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#161D6F] via-[#161D6F]/95 to-[#161D6F]/40 z-0" />
        
        <div className="absolute inset-0 opacity-[0.05] z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFC107]/15 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full mt-10">
          
          {/* --- HERO TEXT (KIRI - 60%) --- */}
          <div className="lg:col-span-7" data-aos="fade-right" data-aos-duration="1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest mb-8 shadow-lg">
              <ShieldCheck size={16} className="text-[#FFC107]" />
              Early Dropout Detection Platform
            </div>
            
            <h1 className="text-[clamp(3rem,5vw,4.5rem)] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Deteksi Risiko Putus Sekolah <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC107] to-[#FFD54F] drop-shadow-sm">
                Lebih Awal, Lebih Tepat.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light mb-10 max-w-2xl">
              ASGARD mengintegrasikan data akademik dan sosial-ekonomi untuk membantu sekolah mengidentifikasi siswa berisiko sebelum terlambat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about" className="inline-flex justify-center items-center gap-2 bg-[#FFC107] hover:bg-[#FFD54F] text-[#161D6F] px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(255,193,7,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,193,7,0.4)]">
                Explore System <ArrowRight size={20} />
              </Link>
              <Link href="#how-it-works" className="inline-flex justify-center items-center gap-2 bg-transparent hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 border border-white/20 backdrop-blur-md">
                Learn More
              </Link>
            </div>
          </div>

          {/* --- HERO MOCKUP (KANAN - 40%) --- */}
          <div className="lg:col-span-5 relative w-full aspect-square" data-aos="zoom-out-left" data-aos-duration="1200" data-aos-delay="200">
            
            {/* Main Glassmorphism Card (Menembus pandang ke foto di belakangnya) */}
            <div className="absolute inset-4 md:inset-8 bg-[#0B0F3B]/30 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 flex flex-col gap-4 transform rotate-2 hover:rotate-0 transition-transform duration-700">
              
              {/* Fake Window Header */}
              <div className="w-full h-8 flex items-center gap-2 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="ml-2 text-[10px] text-white/50 font-medium tracking-widest uppercase">ASGARD Overview</span>
              </div>
              
              <div className="flex-1 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                <LineChart size={64} className="text-white/30 mb-4" />
                <p className="text-white/50 font-medium text-sm">System Generating Insights...</p>
                
                {/* Simulated Chart Bars */}
                <div className="absolute bottom-0 w-full flex items-end justify-center gap-4 px-8 h-24 opacity-40">
                  <div className="w-8 bg-gradient-to-t from-[#FFC107] to-transparent h-12 rounded-t-md" />
                  <div className="w-8 bg-gradient-to-t from-[#FFC107] to-transparent h-20 rounded-t-md" />
                  <div className="w-8 bg-gradient-to-t from-red-400 to-transparent h-16 rounded-t-md" />
                </div>
              </div>
            </div>
            
            {/* Floating Widget 1 */}
            <div 
              className="absolute top-[10%] -left-4 sm:-left-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 flex items-center gap-4 animate-bounce" 
              style={{ animationDuration: '4s' }}
            >
              <div className="p-3 bg-red-50 text-red-500 rounded-xl shadow-inner"><AlertTriangle size={20} strokeWidth={2.5} /></div>
              <div className="pr-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">High Risk</p>
                <p className="text-xl font-black text-[#161D6F] leading-none mt-1">12 Siswa</p>
              </div>
            </div>

            {/* Floating Widget 2 */}
            <div 
              className="absolute bottom-[15%] -right-2 sm:-right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 flex items-center gap-4 animate-bounce" 
              style={{ animationDuration: '5s', animationDelay: '1s' }}
            >
              <div className="p-3 bg-green-50 text-green-500 rounded-xl shadow-inner"><ShieldCheck size={20} strokeWidth={2.5} /></div>
              <div className="pr-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Accuracy</p>
                <p className="text-xl font-black text-[#161D6F] leading-none mt-1">94.8%</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 2. PROBLEM STATEMENT ================= */}
      <section className="py-[120px] px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 text-[#161D6F] text-xs font-bold uppercase tracking-widest mb-6">
              Tantangan Saat Ini
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#161D6F] tracking-tight mb-6">
              Mengapa Sistem Ini Dibutuhkan?
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Banyak kasus putus sekolah baru diketahui ketika kondisi dan mentalitas siswa sudah semakin sulit untuk ditangani.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: AlertTriangle, title: 'Deteksi Terlambat', desc: 'Gejala penurunan performa berlalu tanpa notifikasi, kehilangan momen emas untuk intervensi awal.' },
              { icon: Database, title: 'Data Terpisah', desc: 'Faktor sosio-ekonomi, kehadiran, dan nilai seringkali tersebar di berbagai sistem yang berbeda.' },
              { icon: GraduationCap, title: 'Intervensi Tidak Optimal', desc: 'Waktu Guru BK habis untuk mengumpulkan data, bukan melakukan sesi konseling yang mendalam.' }
            ].map((item, i) => (
              <div 
                key={i} 
                data-aos="fade-up" 
                data-aos-delay={i * 100} 
                className="bg-white p-10 rounded-[24px] border border-slate-200 border-b-4 border-b-transparent hover:border-b-[#FFC107] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(22,29,111,0.1)] transition-all duration-300 group flex flex-col h-full"
              >
                {/* Clean Solid Icon Container */}
                <div className="w-16 h-16 bg-slate-100 text-slate-500 group-hover:bg-[#161D6F] group-hover:text-[#FFC107] rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300">
                  <item.icon size={32} strokeWidth={2} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#161D6F] transition-colors">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed mt-auto">{item.desc}</p>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* ================= 3. SOLUTION OVERVIEW ================= */}
      <section className="py-[120px] px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-[#161D6F] text-xs font-bold uppercase tracking-widest mb-6">
              Alur Solusi
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#161D6F] tracking-tight mb-6">
              Bagaimana ASGARD Membantu?
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Transformasi data mentah menjadi tindakan preventif melalui lima tahapan sistematis dan otomatis.
            </p>
          </div>

          <div className="relative">
            {/* Garis Tengah (Desktop) / Garis Kiri (Mobile) */}
            <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-1 bg-slate-100 md:-translate-x-1/2" />

            {[
              { icon: FileSpreadsheet, title: "Input Data", desc: "Pengumpulan riwayat akademik dan non-akademik siswa ke dalam database." },
              { icon: SearchCheck, title: "Data Validation", desc: "Pembersihan anomali dan standarisasi format data secara otomatis." },
              { icon: Brain, title: "Risk Analysis", desc: "Pemrosesan data menggunakan algoritma Machine Learning yang presisi." },
              { icon: LineChart, title: "Monitoring", desc: "Visualisasi hasil prediksi dan klasifikasi risiko pada dashboard." },
              { icon: Users, title: "Intervention", desc: "Notifikasi dan rekomendasi tindakan preventif untuk Guru BK." }
            ].map((step, idx) => (
              <div 
                key={idx} 
                data-aos="fade-up" 
                className={`relative flex items-center justify-between w-full mb-12 last:mb-0 group ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                {/* Spacer untuk Desktop agar posisinya bisa zig-zag */}
                <div className="hidden md:block w-[45%]" />

                {/* Center Node / Ikon Bulat */}
                <div className="absolute left-0 md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-16 h-16 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:border-[#161D6F] group-hover:bg-[#161D6F] group-hover:text-[#FFC107] transition-all duration-300 z-10 shadow-sm">
                  <step.icon size={24} strokeWidth={2.5} />
                </div>

                {/* Content Box */}
                <div className={`w-full md:w-[45%] pl-24 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                  {/* Efek Solid Offset Shadow saat di-hover */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-100 group-hover:border-[#161D6F] group-hover:shadow-[6px_6px_0px_0px_#FFC107] transition-all duration-300 relative overflow-hidden">
                    
                    {/* Nomor Step Watermark (Samar) */}
                    <span className="absolute top-2 md:top-4 right-6 text-6xl font-black text-slate-50 group-hover:text-[#161D6F]/5 transition-colors duration-300 select-none pointer-events-none">
                      0{idx + 1}
                    </span>
                    
                    <h4 className="font-bold text-[#161D6F] text-xl md:text-2xl mb-3 relative z-10">{step.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed relative z-10">{step.desc}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* ================= 4. KEY FEATURES ================= */}
      <section className="py-[120px] px-6 bg-[#EEF2FF]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#161D6F] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              Kapabilitas Inti
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#161D6F] tracking-tight mb-6">
              Fitur Utama ASGARD
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Rangkaian alat komprehensif yang dirancang khusus untuk mempermudah pemantauan dan intervensi siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Database, title: "Manajemen Data Terpusat", desc: "Integrasi data sosio-ekonomi dan riwayat kehadiran siswa dalam satu pintu yang aman dan terstruktur." },
              { icon: BrainCircuit, title: "Analisis Risiko Cerdas", desc: "Skoring otomatis tingkat kerawanan menggunakan algoritma prediksi machine learning yang akurat." },
              { icon: BarChart3, title: "Dashboard Analitik Visual", desc: "Visualisasi laporan performa dan kerentanan sekolah secara real-time untuk keputusan cepat." },
              { icon: ClipboardPen, title: "Monitoring Konseling", desc: "Pencatatan riwayat intervensi dan tindak lanjut penanganan siswa oleh Guru BK secara sistematis." }
            ].map((feat, i) => (
              <div 
                key={i} 
                data-aos="fade-up" 
                data-aos-delay={i * 100} 
                className="bg-white p-8 md:p-10 rounded-[28px] border-2 border-slate-100 hover:border-[#161D6F] hover:shadow-[8px_8px_0px_0px_#FFC107] transition-all duration-300 flex flex-col sm:flex-row items-start gap-6 group"
              >
                {/* Clean Solid Icon Container */}
                <div className="w-16 h-16 shrink-0 bg-slate-100 text-slate-400 group-hover:bg-[#161D6F] group-hover:text-[#FFC107] rounded-2xl flex items-center justify-center transition-colors duration-300">
                  <feat.icon size={32} strokeWidth={2} />
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-[#161D6F] transition-colors">{feat.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* ================= 5. HOW IT WORKS (CLEAN SOLID DARK) ================= */}
      <section id="how-it-works" className="py-[120px] px-6 bg-[#161D6F]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#FFC107] border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
              Proses Eksekusi
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Alur Kerja Sistem
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto font-light">
              Empat langkah sederhana dari pengumpulan data hingga intervensi tepat sasaran untuk mencegah putus sekolah.
            </p>
          </div>

          {/* PERBAIKAN: Jarak (gap) diperlebar di layar besar (lg:gap-10 xl:gap-12) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 xl:gap-12">
            {[
              { num: "01", title: "Input Data", desc: "Upload riwayat akademik dan non-akademik siswa." },
              { num: "02", title: "Analisis Risiko", desc: "Sistem memproses pola menggunakan algoritma AI." },
              { num: "03", title: "Monitoring", desc: "Visualisasi dan notifikasi tingkat risiko di dashboard." },
              { num: "04", title: "Intervensi", desc: "Sesi konseling tepat sasaran oleh Guru BK." }
            ].map((step, i) => (
              <div 
                key={i} 
                data-aos="fade-up" 
                data-aos-delay={i * 100} 
                className="bg-white p-8 rounded-[24px] border-2 border-transparent hover:border-[#FFC107] hover:shadow-[8px_8px_0px_0px_#FFC107] transition-all duration-300 relative group flex flex-col hover:-translate-y-2"
              >
                {/* Clean Solid Number Badge */}
                <div className="w-14 h-14 shrink-0 bg-slate-100 text-slate-400 group-hover:bg-[#161D6F] group-hover:text-[#FFC107] rounded-2xl flex items-center justify-center font-black text-2xl mb-8 transition-colors duration-300">
                  {step.num}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#161D6F] transition-colors">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>

                {/* PERBAIKAN: Posisi Panah & Z-Index ditata ulang agar tidak ketutupan */}
                {i !== 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 lg:-right-8 xl:-right-10 items-center justify-center z-20 text-white/20 group-hover:text-[#FFC107] transition-colors -translate-y-1/2 pointer-events-none">
                    <ArrowRight size={36} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* ================= 6. DASHBOARD PREVIEW (CLEAN SOLID WIREFRAME) ================= */}
      <section className="py-[120px] px-6 bg-white overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          
          <div data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-[#161D6F] text-xs font-bold uppercase tracking-widest mb-6">
              User Interface
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#161D6F] tracking-tight mb-6">
              Lihat ASGARD dalam Aksi
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-16">
              Monitoring risiko siswa dalam satu dashboard terintegrasi yang mudah dibaca. Ketahui siapa yang butuh bantuan, kapan saja.
            </p>
          </div>
          
          {/* Mockup Frame (Solid Bold Design) */}
          <div 
            className="relative mx-auto max-w-5xl bg-white rounded-2xl border-4 border-[#161D6F] shadow-[12px_12px_0px_0px_#FFC107] overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#FFC107]" 
            data-aos="zoom-in" 
            data-aos-duration="1000"
          >
            {/* Mac Window Header */}
            <div className="bg-slate-50 px-4 py-3 border-b-4 border-[#161D6F] flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-2 border-[#161D6F]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-2 border-[#161D6F]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-2 border-[#161D6F]" />
              <div className="mx-auto text-xs text-slate-400 font-bold tracking-widest uppercase pr-8">Dashboard Preview</div>
            </div>
            
            {/* Abstract Dashboard Wireframe UI */}
            <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-white flex relative">
              
              {/* Fake Sidebar (Hanya Desktop) */}
              <div className="hidden md:flex w-1/4 h-full border-r-4 border-[#161D6F] flex-col p-6 gap-4 bg-slate-50/50">
                <div className="w-full h-10 bg-slate-200 rounded-lg mb-4" />
                <div className="w-3/4 h-4 bg-slate-200 rounded-full" />
                <div className="w-1/2 h-4 bg-slate-200 rounded-full" />
                <div className="w-2/3 h-4 bg-slate-200 rounded-full" />
                <div className="w-full h-24 bg-[#161D6F]/5 border-2 border-dashed border-[#161D6F]/20 rounded-xl mt-auto flex items-center justify-center">
                  <div className="w-1/2 h-4 bg-[#161D6F]/20 rounded-full" />
                </div>
              </div>

              {/* Fake Main Content */}
              <div className="flex-1 p-4 md:p-8 flex flex-col gap-6 bg-white relative overflow-hidden">
                
                {/* Fake Stat Cards */}
                <div className="flex gap-4">
                  <div className="flex-1 h-20 md:h-28 bg-[#161D6F] border-2 border-[#161D6F] rounded-xl flex items-center p-4 shadow-[4px_4px_0px_0px_#FFC107]">
                    <div className="w-1/2 h-4 md:h-6 bg-white/20 rounded-full" />
                  </div>
                  <div className="flex-1 h-20 md:h-28 bg-white border-2 border-[#161D6F] rounded-xl flex items-center p-4">
                    <div className="w-1/2 h-4 md:h-6 bg-slate-200 rounded-full" />
                  </div>
                  <div className="hidden sm:flex flex-1 h-20 md:h-28 bg-white border-2 border-[#161D6F] rounded-xl items-center p-4">
                    <div className="w-1/2 h-4 md:h-6 bg-slate-200 rounded-full" />
                  </div>
                </div>

                {/* Fake Bar Chart */}
                <div className="flex-1 bg-slate-50 border-2 border-[#161D6F] rounded-xl p-6 flex flex-col relative">
                  <div className="w-1/3 h-4 bg-slate-200 rounded-full mb-auto" />
                  
                  {/* Bars that animate on hover */}
                  <div className="absolute bottom-0 left-6 right-6 h-[70%] flex items-end justify-around gap-2 md:gap-6 border-b-2 border-[#161D6F]">
                    <div className="w-full bg-[#161D6F] rounded-t-md h-[40%] group-hover:h-[60%] transition-all duration-700 ease-in-out" />
                    <div className="w-full bg-[#161D6F] rounded-t-md h-[70%] group-hover:h-[85%] transition-all duration-700 ease-in-out delay-75" />
                    <div className="w-full bg-[#FFC107] border-2 border-[#161D6F] border-b-0 rounded-t-md h-[30%] group-hover:h-[45%] transition-all duration-700 ease-in-out delay-150" />
                    <div className="w-full bg-[#161D6F] rounded-t-md h-[90%] group-hover:h-[100%] transition-all duration-700 ease-in-out delay-200" />
                    <div className="w-full bg-red-400 border-2 border-[#161D6F] border-b-0 rounded-t-md h-[50%] group-hover:h-[75%] transition-all duration-700 ease-in-out delay-300 relative">
                      {/* Hotspot Indicator */}
                      <div className="absolute -top-3 -right-3 w-4 h-4 bg-[#161D6F] rounded-full animate-ping" />
                      <div className="absolute -top-3 -right-3 w-4 h-4 bg-[#FFC107] border-2 border-[#161D6F] rounded-full z-10" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Watermark Tengah Mockup */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-white/80 backdrop-blur-sm border-2 border-[#161D6F] text-[#161D6F] font-black px-6 py-3 rounded-full shadow-[4px_4px_0px_0px_#FFC107] flex items-center gap-2 transform -translate-y-4">
                  <BarChart3 size={20} strokeWidth={3} /> DATA VISUALIZATION
                </div>
              </div>

            </div>
          </div>

          {/* Mini Cards / Tags Bawah */}
          <div className="flex flex-wrap justify-center gap-4 mt-16" data-aos="fade-up" data-aos-delay="200">
            {["Real-Time Monitoring", "Risk Classification", "Counseling Tracking"].map((tag, i) => (
              <span 
                key={i} 
                className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-[#161D6F] hover:shadow-[4px_4px_0px_0px_#FFC107] hover:-translate-y-1 transition-all duration-300 rounded-full text-sm font-bold text-slate-600 hover:text-[#161D6F] cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
          
        </div>
      </section>

      {/* ================= 7. CTA LOGIN ================= */}
      <section className="py-[120px] px-6 bg-[#161D6F] relative overflow-hidden">
        {/* Dekorasi Grid Samar */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        {/* Glow Halus */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFC107]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10" data-aos="zoom-in">
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
            Siap Membangun Intervensi <br />
            <span className="text-[#FFC107]">yang Lebih Tepat?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
            Gunakan ASGARD untuk membantu sekolah mendeteksi risiko putus sekolah sejak dini melalui pendekatan berbasis data.
          </p>
          
          <Link 
            href="/login" 
            className="group inline-flex items-center justify-center gap-3 bg-[#FFC107] hover:bg-[#E0A800] text-[#161D6F] px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            Masuk ke Dashboard 
            <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
        </div>
      </section>

    </main>
  );
}