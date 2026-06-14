"use client";

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  User, 
  UsersRound, 
  ChartNoAxesCombined,
  ArrowRight
} from 'lucide-react';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    // Grid dibalik: 1fr (Form di Kiri) _ 1.2fr (Visual di Kanan)
    <main className="h-screen w-full grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] bg-linear-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
      
      {/* ================= LEFT SIDE (REGISTER FORM - 45%) ================= */}
      <div className="relative flex items-center justify-center p-6 lg:p-8 z-10 w-full min-h-screen lg:min-h-0 order-2 lg:order-1">
        
        <div className="w-full max-w-[480px]" data-aos="fade-right">
          
          {/* Mobile Only Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#161D6F] text-[#FFC107] mb-4 shadow-xl">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-[#161D6F] tracking-tight">ASGARD</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-[0_25px_60px_rgba(22,29,111,0.08)] border border-slate-100">
            
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#161D6F] mb-1 flex items-center gap-2">
                <UsersRound className="text-[#FFC107]" size={24} /> Pendaftaran Instansi
              </h2>
              <p className="text-slate-500 text-xs">Lengkapi data di bawah untuk membuat akun ASGARD.</p>
            </div>

            <form className="space-y-4">
              
              {/* Row 1: Nama & Peran (Bersebelahan untuk menghemat ruang vertikal) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Nama Anda" 
                      className="w-full pl-9 pr-3 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Peran Sistem</label>
                  <div className="relative group">
                    <UsersRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={16} />
                    <select className="w-full pl-9 pr-3 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 text-sm appearance-none bg-white">
                      <option value="" disabled selected>Pilih Peran</option>
                      <option value="admin">Admin Sekolah</option>
                      <option value="konselor">Guru BK</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Email Instansi</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="admin@sekolah.sch.id" 
                    className="w-full pl-11 pr-4 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 text-sm"
                  />
                </div>
              </div>

              {/* Row 2: Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={16} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full pl-9 pr-9 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 tracking-wider text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#161D6F] transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Konfirmasi</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={16} />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full pl-9 pr-9 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 tracking-wider text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#161D6F] transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 py-1 mt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-4 h-4 mt-0.5 rounded-md border-slate-300 text-[#161D6F] focus:ring-[#161D6F] transition-colors cursor-pointer"
                />
                <label htmlFor="terms" className="text-[11px] font-medium text-slate-500 cursor-pointer select-none leading-relaxed">
                  Saya menyetujui kebijakan privasi dan pakta integritas kerahasiaan data ASGARD.
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full h-[48px] bg-[#161D6F] hover:bg-indigo-900 text-white rounded-xl font-black text-sm shadow-[0_10px_20px_rgba(22,29,111,0.2)] hover:shadow-[0_15px_30px_rgba(22,29,111,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group mt-2"
              >
                Selesaikan Pendaftaran
                <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-center text-slate-500 mt-6 text-xs font-medium">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="text-[#FFC107] font-black hover:underline transition-all">
                Login Sekarang
              </Link>
            </p>

          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (VISUAL AREA - 55%) ================= */}
      <div className="relative hidden lg:flex flex-col justify-center p-10 xl:p-16 overflow-hidden bg-[#161D6F] order-1 lg:order-2 rounded-l-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-20">
        
        {/* GAMBAR DIBUAT LEBIH JELAS SEBAGAI HINT */}
        <Image 
          src="/hero-bg.jpg" 
          alt="School Environment" 
          fill 
          className="object-cover object-center z-0 opacity-50"
          priority
        />
        {/* Gradasi diturunkan ketebalannya menjadi 85% - 80% - 70% */}
        <div className="absolute inset-0 bg-linear-to-bl from-[#161D6F]/85 via-[#161D6F]/80 to-[#2434B5]/70 z-0" />
        
        {/* Blurs for Aesthetic Depth */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFC107]/15 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-2xl ml-auto" data-aos="fade-left">
          
          <h1 className="text-[clamp(2rem,3.5vw,3.5rem)] font-extrabold text-white leading-[1.1] tracking-tight mb-4 drop-shadow-md">
            Bergabung dengan <br /> Ekosistem <span className="text-[#FFC107]">ASGARD</span>
          </h1>
          
          <p className="text-base text-white/80 leading-relaxed font-medium mb-10 max-w-lg drop-shadow-sm">
            Satu langkah lagi untuk mentransformasi data menjadi keputusan preventif yang menyelamatkan masa depan pendidikan.
          </p>

          {/* Floating Benefit Cards (Representing ASGARD Features) */}
          <div className="relative h-[240px] w-full" data-aos="zoom-in" data-aos-delay="200">
            
            {/* Card 1: Security */}
            <div className="absolute top-0 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-[bounce_4s_ease-in-out_infinite]">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Infrastruktur</p>
                <p className="text-lg font-black text-white">Keamanan Enkripsi</p>
              </div>
            </div>

            {/* Card 2: Multi Role */}
            <div className="absolute top-20 right-56 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-[bounce_5s_ease-in-out_infinite_0.5s]">
              <div className="w-10 h-10 rounded-xl bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center border border-[#FFC107]/30">
                <UsersRound size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Aksesibilitas</p>
                <p className="text-lg font-black text-white">Multi-Role System</p>
              </div>
            </div>

            {/* Card 3: Real Time Data */}
            <div className="absolute top-36 right-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-[bounce_6s_ease-in-out_infinite_1s]">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <ChartNoAxesCombined size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Analitik</p>
                <p className="text-lg font-black text-white">Data Real-Time</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
}