"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  ShieldCheck, 
  BarChart3, 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Target 
} from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <main className="w-full bg-slate-50 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#161D6F] to-[#2735B8] text-white py-20 px-6">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-5xl mx-auto text-center z-10" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-8">
            <ShieldCheck size={16} className="text-[#FFC107]" />
            Sistem Deteksi Dini Risiko Dropout Pendidikan
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Menjaga Masa Depan <br/> <span className="text-[#FFC107]">Siswa Indonesia</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            ASGARD hadir dengan analitik data canggih untuk membantu institusi pendidikan mengidentifikasi gejala awal risiko putus sekolah dengan presisi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="px-8 py-4 bg-[#FFC107] hover:bg-[#E0A800] text-[#161D6F] rounded-2xl font-bold transition-all duration-300 shadow-lg hover:-translate-y-1">
              Pelajari Sistem
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all duration-300">
              Masuk Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: BarChart3, title: "Data Presisi", desc: "Analisis berbasis data real-time untuk keputusan akurat." },
            { icon: BrainCircuit, title: "AI-Powered", desc: "Algoritma cerdas mengenali pola risiko secara otomatis." },
            { icon: Target, title: "Intervensi Tepat", desc: "Rekomendasi langkah tindak lanjut yang terukur." }
          ].map((item, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#161D6F]/5 rounded-2xl flex items-center justify-center text-[#161D6F] mb-6">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (PARALLAX-ISH) */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2" data-aos="fade-right">
            <h2 className="text-4xl font-extrabold text-[#161D6F] mb-6">Bagaimana ASGARD Bekerja?</h2>
            <div className="space-y-6">
              {[
                "Input data riwayat akademik dan non-akademik siswa.",
                "Sistem memproses variabel melalui algoritma machine learning.",
                "Dashboard memberikan notifikasi risiko secara instan.",
                "Guru/Admin melakukan intervensi sesuai rekomendasi."
              ].map((text, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="text-[#FFC107] shrink-0" />
                  <p className="text-slate-600 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 bg-[#161D6F] h-[400px] w-full rounded-3xl flex items-center justify-center p-10" data-aos="fade-left">
            <Users size={120} className="text-white/20" />
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 px-6 text-center" data-aos="zoom-in">
        <h2 className="text-4xl font-extrabold mb-6">Siap Mengurangi Angka Putus Sekolah?</h2>
        <Link href="/login" className="inline-flex items-center gap-2 bg-[#161D6F] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#1E2A8A] transition-all">
          Mulai Sekarang <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}