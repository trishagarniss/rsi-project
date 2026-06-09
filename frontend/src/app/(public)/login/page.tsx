"use client";

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      
      {/* SIDEBAR BRANDING (Desktop: 45% | Mobile: Hidden) */}
      <div className="hidden lg:flex w-[45%] bg-[#161D6F] p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative z-10">
          <div className="h-12 w-12 rounded-xl bg-[#FFC107] flex items-center justify-center text-[#161D6F] font-black text-xl mb-8">A</div>
          <h1 className="text-5xl font-black leading-tight">ASGARD</h1>
          <p className="text-white/60 mt-4 text-lg">Analisis Sistem Gejala Awal Risiko Dropout</p>
        </div>

        <div className="relative z-10 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-[#FFC107]" />
            <span className="font-bold">Keamanan Data Terjamin</span>
          </div>
          <p className="text-sm text-white/70">Data siswa diproses dengan enkripsi tingkat tinggi untuk mendukung intervensi yang akurat.</p>
        </div>
      </div>

      {/* LOGIN FORM (Desktop: 55% | Mobile: 100%) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20">
        <div className="w-full max-w-md" data-aos="fade-left">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#161D6F]">Selamat Datang</h2>
            <p className="text-slate-500 mt-2">Silakan masukkan kredensial akun Anda.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="admin@sekolah.sch.id" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-[#161D6F] hover:underline">Lupa password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107] outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#161D6F] text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-900 transition-all flex items-center justify-center gap-2 group"
            >
              Masuk ke Dashboard 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#161D6F] font-bold hover:underline">Hubungi Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}