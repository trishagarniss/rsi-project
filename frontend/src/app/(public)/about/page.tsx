"use client"; 

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  GraduationCap, 
  AlertTriangle, 
  Database, 
  TrendingDown,
  Target,
  TrendingUp,
  Users,
  Bot,
  BrainCircuit,
  ArrowRight,
  Quote
} from 'lucide-react';

import { 
  FaGithub, 
  FaLinkedin 
} from 'react-icons/fa';

// DATA TIM PENGEMBANG
const teamMembers = [
  { 
    name: 'Trisha Garnis W.', 
    nim: 'L0224012', 
    role: 'Project Manager', 
    initial: 'TG', 
    color: '#161D6F',
    image: '/team/trisha.jpeg',
    github: 'https://github.com/trishagarniss',
    linkedin: 'https://www.linkedin.com/in/trisha-garnis-wahningyun-7276782b3/'
  },
  { 
    name: 'Alvian Damar B.H.', 
    nim: 'L0224014', 
    role: 'Backend Developer', 
    initial: 'AD', 
    color: '#FFC107',
    image: '',
    github: 'https://github.com/deskafimcode',
    linkedin: '' 
  },
  { 
    name: 'Fathul Fajar N.I.', 
    nim: 'L0224018', 
    role: 'Data Analyst', 
    initial: 'FF', 
    color: '#22C55E',
    image: '',
    github: 'https://github.com/SansZee',
    linkedin: ''
  },
  { 
    name: 'Kunto Rossindu H.', 
    nim: 'L0224020', 
    role: 'Frontend Developer', 
    initial: 'KR', 
    color: '#FFC107',
    image: '',
    github: 'https://github.com/decaldaraaa',
    linkedin: '' 
  },
  { 
    name: 'Zaki Elias A.Q.', 
    nim: 'L0224039', 
    role: 'System Analyst', 
    initial: 'ZE', 
    color: '#161D6F',
    image: '',
    github: 'https://github.com/KHAEZ246',
    linkedin: '' 
  }
];

export default function AboutPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  return (
    <main className="w-full font-sans antialiased bg-slate-50 text-slate-800 overflow-x-hidden">
      
      {/* ================= SECTION 1: HERO  ================= */}
      <section 
        className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-asgard-primary"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 1. Latar Belakang Gambar hero-bg.jpg */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 mix-blend-overlay animate-[pulse_8s_ease-in-out_infinite] scale-105"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        
        {/* 2. Overlay Gradient Utama (Diperhalus transparansinya jadi 80 & 70 agar gambar tembus) */}
        <div className="absolute inset-0 bg-linear-to-br from-asgard-primary/80 via-asgard-primary/70 to-indigo-950/90 z-0" />
        
        {/* 3. EFEK SPOTLIGHT MOUSE (Cahaya mengikuti kursor) */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 mix-blend-screen"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 193, 7, 0.15), transparent 40%)`
          }}
        />

        {/* 4. Dekorasi Cahaya Statis (Pojok Kiri & Kanan) */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-asgard-secondary/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/3 z-0" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-green-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3 z-0" />
        
        {/* 5. Konten Hero (Ditambah pt-28 agar tidak tertutup header) */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pb-10" data-aos="fade-up" data-aos-duration="1000">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-asgard-secondary font-semibold text-sm uppercase tracking-widest mb-6 shadow-xl">
            <BrainCircuit size={16} /> Tentang ASGARD
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
            Kecerdasan Buatan untuk <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-asgard-secondary to-yellow-300">
              Masa Depan Pendidikan
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed font-light drop-shadow-sm">
            Platform analitik prediktif yang membantu institusi pendidikan mendeteksi risiko putus sekolah secara dini demi memastikan tidak ada siswa yang tertinggal.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 cursor-default shadow-lg">
              <BarChart3 size={18} className="text-asgard-secondary" /> Data Analytics
            </div>
            <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 cursor-default shadow-lg">
              <GraduationCap size={18} className="text-green-400" /> Education Tech
            </div>
            <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 cursor-default shadow-lg">
              <AlertTriangle size={18} className="text-red-400" /> Early Warning System
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: LATAR BELAKANG ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- BAGIAN KIRI: FOTO & EMBEDDED WIDGETS --- */}
          <div className="order-2 lg:order-1 relative" data-aos="fade-right">
            {/* Dekorasi latar belakang foto */}
            <div className="absolute inset-0 bg-linear-to-tr from-asgard-primary/20 to-asgard-secondary/30 rounded-[40px] transform -rotate-3 scale-105 -z-10" />

            {/* Container Foto Utama */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-[40px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(22,29,111,0.2)] border-4 border-white">
              <Image 
                src="/about-team.jpg" 
                alt="Tim ASGARD" 
                fill //
                className="object-cover w-full h-full"
              />

              {/* Widget Risiko Dropout (Tertanam di dalam foto - Kiri Bawah) */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/50 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 flex items-center justify-center rounded-2xl">
                  <TrendingDown size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Risiko Dropout</p>
                  <p className="text-2xl font-black text-asgard-primary">-45%</p>
                </div>
              </div>

              {/* Widget Analisis AI (Tertanam di dalam foto - Kanan Atas) */}
              <div className="absolute top-6 right-6 z-20 bg-asgard-primary/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 bg-asgard-secondary text-asgard-primary flex items-center justify-center rounded-xl">
                  <Bot size={20} strokeWidth={2.5} />
                </div>
                <div className="pr-2">
                  <p className="text-[10px] text-white/70 font-medium uppercase tracking-wider">Analisis AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-sm font-bold text-white">Aktif 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* --- BAGIAN KANAN: TEKS --- */}
          <div className="order-1 lg:order-2" data-aos="fade-left">
            <div className="inline-flex items-center gap-2 text-asgard-primary font-bold tracking-wider text-sm uppercase mb-4">
              <span className="w-8 h-0.5 bg-asgard-secondary" /> Latar Belakang
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-asgard-primary mb-6 leading-tight tracking-tight">
              Kesenjangan Antara <br /> Masalah & Intervensi
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              Keterlambatan penanganan sering kali berujung pada keputusan <em>dropout</em>. ASGARD hadir untuk menjembatani kesenjangan tersebut dengan memetakan faktor-faktor risiko secara otomatis.
            </p>
            
            <div className="space-y-4">
              <div className="p-5 bg-white border border-slate-200 rounded-3xl flex gap-5 items-start">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl shrink-0">
                  <TrendingDown size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Keterlambatan Deteksi</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">Gejala putus sekolah menumpuk perlahan dan baru disadari ketika niat siswa sudah tak bisa diubah.</p>
                </div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-3xl flex gap-5 items-start">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Data Tersebar</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">Faktor eksternal seperti ekonomi dan absensi tercecer, menyulitkan Guru BK melakukan pemetaan utuh.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* ================= SECTION 3: TUJUAN SISTEM (CARDS) ================= */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-200/60 relative overflow-hidden">
        {/* Dekorasi Background Cahaya Halus */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-asgard-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 text-asgard-primary font-bold tracking-wider text-sm uppercase mb-4">
              <span className="w-8 h-0.5 bg-asgard-secondary" /> Misi Utama
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-asgard-primary tracking-tight">Tujuan Pengembangan</h2>
            <p className="text-slate-500 mt-6 text-lg leading-relaxed">
              Membekali institusi pendidikan dengan alat ukur presisi untuk menekan angka putus sekolah secara proaktif.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Garis Konektor (Hanya muncul di Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-linear-to-r from-transparent via-slate-200 to-transparent z-0" />

            {/* --- CARD 1 --- */}
            <div 
              className="group relative bg-white p-10 rounded-[2rem] border border-slate-200 hover:border-asgard-secondary/40 hover:shadow-[0_20px_50px_-12px_rgba(22,29,111,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden z-10" 
              data-aos="fade-up" 
              data-aos-delay="100"
            >
              {/* Watermark Icon */}
              <div className="absolute -right-8 -bottom-8 text-slate-50 group-hover:text-asgard-secondary/10 transition-all duration-700 -z-10 rotate-12 group-hover:rotate-0 group-hover:scale-110">
                <Target size={200} strokeWidth={1} />
              </div>
              
              {/* Main Icon */}
              <div className="w-20 h-20 bg-indigo-50/80 backdrop-blur-sm text-asgard-primary rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 group-hover:bg-asgard-primary group-hover:text-asgard-secondary transition-all duration-500 shadow-sm group-hover:shadow-lg">
                <Target size={36} strokeWidth={2} />
              </div>
              
              <h3 className="font-bold text-2xl text-slate-800 mb-4 group-hover:text-asgard-primary transition-colors">Deteksi Risiko Dini</h3>
              <p className="text-slate-500 leading-relaxed">Mengidentifikasi siswa rentan secara otomatis sebelum masalah menjadi kritis melalui analitik prediktif yang akurat.</p>
            </div>
            
            {/* --- CARD 2 --- */}
            <div 
              className="group relative bg-white p-10 rounded-[2rem] border border-slate-200 hover:border-asgard-secondary/40 hover:shadow-[0_20px_50px_-12px_rgba(22,29,111,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden z-10" 
              data-aos="fade-up" 
              data-aos-delay="200"
            >
              {/* Watermark Icon */}
              <div className="absolute -right-8 -bottom-8 text-slate-50 group-hover:text-asgard-secondary/10 transition-all duration-700 -z-10 rotate-12 group-hover:rotate-0 group-hover:scale-110">
                <TrendingUp size={200} strokeWidth={1} />
              </div>

              {/* Main Icon */}
              <div className="w-20 h-20 bg-indigo-50/80 backdrop-blur-sm text-asgard-primary rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 group-hover:bg-asgard-primary group-hover:text-asgard-secondary transition-all duration-500 shadow-sm group-hover:shadow-lg">
                <TrendingUp size={36} strokeWidth={2} />
              </div>
              
              <h3 className="font-bold text-2xl text-slate-800 mb-4 group-hover:text-asgard-primary transition-colors">Dukungan Keputusan</h3>
              <p className="text-slate-500 leading-relaxed">Memberikan transparansi parameter dan <em>insight</em> data yang komprehensif untuk memandu kebijakan sekolah berbasis fakta.</p>
            </div>
            
            {/* --- CARD 3 --- */}
            <div 
              className="group relative bg-white p-10 rounded-[2rem] border border-slate-200 hover:border-asgard-secondary/40 hover:shadow-[0_20px_50px_-12px_rgba(22,29,111,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden z-10" 
              data-aos="fade-up" 
              data-aos-delay="300"
            >
              {/* Watermark Icon */}
              <div className="absolute -right-8 -bottom-8 text-slate-50 group-hover:text-asgard-secondary/10 transition-all duration-700 -z-10 rotate-12 group-hover:rotate-0 group-hover:scale-110">
                <Users size={200} strokeWidth={1} />
              </div>

              {/* Main Icon */}
              <div className="w-20 h-20 bg-indigo-50/80 backdrop-blur-sm text-asgard-primary rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 group-hover:bg-asgard-primary group-hover:text-asgard-secondary transition-all duration-500 shadow-sm group-hover:shadow-lg">
                <Users size={36} strokeWidth={2} />
              </div>
              
              <h3 className="font-bold text-2xl text-slate-800 mb-4 group-hover:text-asgard-primary transition-colors">Efektivitas Intervensi</h3>
              <p className="text-slate-500 leading-relaxed">Memfokuskan waktu dan energi Guru BK langsung pada sesi konseling penanganan emosional, bukan rekapitulasi data.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 4: VISI & MISI (OVERLAP BENTO LAYOUT) ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col">
          
          {/* --- BLOK VISI (Background Navy, ditarik panjang ke bawah) --- */}
          <div 
            className="bg-linear-to-br from-asgard-primary via-asgard-primary to-indigo-950 text-white p-10 md:p-16 pt-16 md:pt-20 pb-32 md:pb-40 rounded-[2.5rem] shadow-2xl relative overflow-hidden" 
            data-aos="zoom-in"
          >
            {/* Dekorasi Cahaya & Watermark Quote */}
            <div className="absolute right-0 top-0 w-125 h-125 bg-linear-to-bl from-asgard-secondary/15 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-100 h-100 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            <Quote size={250} className="absolute top-4 right-10 text-white/5 -rotate-12 pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 text-asgard-secondary text-xs font-bold uppercase tracking-widest mb-8 shadow-sm backdrop-blur-md">
                Pernyataan Visi
              </div>
              <p className="text-2xl md:text-4xl leading-relaxed font-light text-white drop-shadow-md">
                &ldquo;Menjadi sistem pendukung keputusan berbasis data yang membantu institusi pendidikan melakukan <strong className="font-bold text-transparent bg-clip-text bg-linear-to-r from-asgard-secondary to-yellow-200">deteksi dini risiko putus sekolah </strong> secara cepat, akurat, dan berkelanjutan.&rdquo;
              </p>
            </div>
          </div>

          {/* --- BLOK MISI (Kartu yang menumpuk di atas blok Visi) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 -mt-20 md:-mt-24 relative z-20">
            
            {/* Kartu Misi 1 */}
            <div 
              className="bg-white p-10 rounded-[2rem] border-t-4 border-t-asgard-secondary border-x border-b border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_-12px_rgba(255,193,7,0.2)] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden" 
              data-aos="fade-up" data-aos-delay="100"
            >
              <div className="absolute -right-4 -bottom-4 text-[120px] font-black text-slate-50 pointer-events-none leading-none group-hover:text-amber-50 transition-colors duration-500">01</div>
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 relative z-10">
                <Database size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 leading-snug relative z-10">Mengintegrasikan data akademik & sosio-ekonomi secara utuh.</h3>
            </div>
            
            {/* Kartu Misi 2 */}
            <div 
              className="bg-white p-10 rounded-[2rem] border-t-4 border-t-asgard-secondary border-x border-b border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_-12px_rgba(255,193,7,0.2)] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden" 
              data-aos="fade-up" data-aos-delay="200"
            >
              <div className="absolute -right-4 -bottom-4 text-[120px] font-black text-slate-50 pointer-events-none leading-none group-hover:text-amber-50 transition-colors duration-500">02</div>
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 relative z-10">
                <Bot size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 leading-snug relative z-10">Menyediakan analitik prediktif dan skor risiko berbasis <em>Machine Learning</em>.</h3>
            </div>
            
            {/* Kartu Misi 3 */}
            <div 
              className="bg-white p-10 rounded-[2rem] border-t-4 border-t-asgard-secondary border-x border-b border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_-12px_rgba(255,193,7,0.2)] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden" 
              data-aos="fade-up" data-aos-delay="300"
            >
              <div className="absolute -right-4 -bottom-4 text-[120px] font-black text-slate-50 pointer-events-none leading-none group-hover:text-amber-50 transition-colors duration-500">03</div>
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 relative z-10">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 leading-snug relative z-10">Mendorong eksekusi intervensi preventif yang tepat sasaran bagi siswa.</h3>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: TIM PENGEMBANG ================= */}
      <section className="py-32 px-6 bg-[#F8FAFC] border-t border-slate-200/60 relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-asgard-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFC107]/15 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-28" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 text-asgard-primary font-bold tracking-wider text-sm uppercase mb-4">
              <span className="w-8 h-0.5 bg-asgard-secondary" /> Behind The System
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#161D6F] tracking-tight mb-6">
              Tim Pengembang ASGARD
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Mahasiswa Sains Data Universitas Sebelas Maret yang berdedikasi membangun solusi teknologi inovatif untuk ekosistem pendidikan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-20 max-w-7xl mx-auto">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx} 
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className="relative bg-white rounded-[2.5rem] p-6 pt-16 pb-8 text-center border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(22,29,111,0.15)] transition-all duration-500 group flex flex-col items-center"
              >
                {/* Garis Warna Akses di Atas Kartu (Muncul saat Hover) */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1.5 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: member.color }}
                />

                {/* --- AVATAR MELAYANG (DYNAMIC GLOW) --- */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 group-hover:-translate-y-2 transition-transform duration-500 z-20">
                  
                  {/* Efek Glow menyala sesuai warna unik per-anak */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-110" 
                    style={{ backgroundColor: member.color }}
                  />
                  
                  {/* Foto / Inisial (Berwarna) */}
                  <div className="relative w-full h-full rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-slate-50">
                    {member.image ? (
                      <Image src={member.image} alt={member.name} width={112} height={112} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-white text-3xl font-black group-hover:scale-110 transition-transform duration-500"
                        style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}DD)` }}
                      >
                        {member.initial}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* --- KONTEN TEKS --- */}
                <h3 className="text-xl font-bold text-slate-800 mb-1.5 mt-2 group-hover:text-[#161D6F] transition-colors">{member.name}</h3>
                <p className="text-sm font-semibold text-slate-400 mb-6 tracking-widest">{member.nim}</p>
                
                {/* Colorful Pill Badge */}
                <div 
                  className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 transition-colors duration-300"
                  style={{ backgroundColor: `${member.color}15`, color: member.color }}
                >
                  {member.role}
                </div>

                {/* --- SOCIAL LINKS --- */}
                <div className="flex items-center gap-4 mt-auto justify-center">
                  
                  {/* Tombol GitHub */}
                  {member.github && (
                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      style={{ backgroundColor: `${member.color}15`, color: member.color }}
                    >
                      <FaGithub size={18} />
                    </a>
                  )}

                  {/* Tombol LinkedIn */}
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      style={{ backgroundColor: `${member.color}15`, color: member.color }}
                    >
                      <FaLinkedin size={18} />
                    </a>
                  )}

                </div>
                
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* ================= SECTION 6: CLOSING CTA (PREMIUM FULL-WIDTH) ================= */}
      <section className="relative py-28 md:py-36 px-6 bg-[#161D6F] overflow-hidden">
        
        {/* Dekorasi Background Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        {/* Glowing Orbs / Cahaya Dinamis Menyebar dari Sudut Layar */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-asgard-secondary/20 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />
        
        {/* Garis Cahaya Halus Pemisah di Atas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-linear-to-r from-transparent via-asgard-secondary/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center" data-aos="zoom-in" data-aos-duration="800">
          
          {/* Badge Pelengkap */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-asgard-secondary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
            Mulai Perubahan
          </div>

          {/* Typography dengan Gradient Highlight */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
            Ambil Langkah Pertama <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-asgard-secondary to-yellow-200 drop-shadow-sm">
              Menyelamatkan Masa Depan Siswa
            </span>
          </h2>
          
          <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            ASGARD hadir untuk membantu institusi pendidikan mengidentifikasi risiko putus sekolah lebih awal melalui pendekatan berbasis data dan analitik.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link 
              href="/login" 
              className="group inline-flex items-center justify-center gap-3 bg-asgard-secondary hover:bg-asgard-accent text-asgard-primary px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-[0_10px_30px_rgba(255,193,7,0.3)] hover:shadow-[0_20px_40px_rgba(255,193,7,0.4)] hover:-translate-y-1 focus:ring-4 focus:ring-asgard-secondary/50 outline-none"
            >
              Masuk ke Dashboard 
              {/* Ikon Panah Bergeser Saat Di-hover */}
              <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 border border-white/10 hover:border-white/20 hover:-translate-y-1"
            >
              Hubungi Kami
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}