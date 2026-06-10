"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Mail, 
  GraduationCap, 
  Building2, 
  Users,
  BrainCircuit,
  Database,
  ShieldCheck,
  Send,
  ArrowRight,
  Code2,
  Target
} from 'lucide-react';

export default function ContactPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <main className="w-full font-sans antialiased text-slate-800 bg-white overflow-hidden">
      
      {/* ================= 1. HERO CONTACT ================= */}
      <section className="relative pt-32 pb-40 px-6 bg-[#161D6F] text-center overflow-hidden">
        {/* Dekorasi Grid Background */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        {/* Glow Kuning */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#FFC107]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#FFC107] border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Hubungi Kami
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
            Kami terbuka terhadap pertanyaan, saran, kolaborasi, maupun diskusi terkait pengembangan ekosistem ASGARD.
          </p>
        </div>
      </section>

      {/* ================= 2. CONTACT INFORMATION (OVERLAPPING GRID) ================= */}
      <section className="px-6 -mt-20 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: Mail, title: "Email Address", desc: "asgard.project@uns.ac.id" },
            { icon: GraduationCap, title: "Program Studi", desc: "Sains Data" },
            { icon: Building2, title: "Universitas", desc: "Universitas Sebelas Maret" }
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-[#161D6F] hover:shadow-[8px_8px_0px_0px_#FFC107] transition-all duration-300 group flex flex-col items-center text-center hover:-translate-y-2"
              data-aos="fade-up" 
              data-aos-delay={i * 100}
            >
              <div className="w-16 h-16 bg-slate-50 text-slate-400 group-hover:bg-[#161D6F] group-hover:text-[#FFC107] rounded-2xl flex items-center justify-center transition-colors duration-300 mb-6">
                <item.icon size={32} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#161D6F] transition-colors">{item.title}</h3>
              <p className="text-slate-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. MEET THE PROJECT (STATISTICS) ================= */}
      <section className="py-[120px] px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-black text-[#161D6F] tracking-tight mb-4">ASGARD Statistics</h2>
            <p className="text-slate-500 text-lg">Gambaran skala dan kapabilitas platform kami.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { num: "5+", label: "Team Members", icon: Users },
              { num: "3", label: "User Roles", icon: ShieldCheck },
              { num: "1", label: "Prediction Engine", icon: BrainCircuit },
              { num: "100%", label: "Data Driven", icon: Database }
            ].map((stat, i) => (
              <div key={i} data-aos="zoom-in" data-aos-delay={i * 100} className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-100 flex flex-col items-center justify-center group hover:bg-[#161D6F] transition-colors duration-300">
                <stat.icon size={32} className="text-[#FFC107] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-4xl md:text-5xl font-black text-[#161D6F] group-hover:text-white mb-2">{stat.num}</h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest group-hover:text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. CONTACT FORM & PROJECT INFO ================= */}
      <section className="py-[120px] px-6 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
          
          {/* Left: Project Details */}
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 text-[#161D6F] text-xs font-bold uppercase tracking-widest mb-6">
              Project Detail
            </div>
            <h2 className="text-4xl font-black text-[#161D6F] leading-tight mb-6">
              Sistem Informasi <br /> Gejala Awal Risiko Dropout
            </h2>
            <p className="text-slate-500 leading-relaxed mb-10 text-lg">
              ASGARD dirancang khusus untuk memfasilitasi institusi pendidikan dalam melakukan pemantauan proaktif dan intervensi dini terhadap siswa.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Code2, title: "Technology", desc: "React, FastAPI, PostgreSQL" },
                { icon: Target, title: "Target Users", desc: "Admin Sekolah & Konselor BK" },
                { icon: BrainCircuit, title: "Core Focus", desc: "Machine Learning Analytics" },
                { icon: ShieldCheck, title: "Architecture", desc: "Multi-Tenant RBAC" }
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 shrink-0 bg-[#EEF2FF] text-[#161D6F] rounded-xl flex items-center justify-center">
                    <info.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#161D6F] text-sm mb-1">{info.title}</h4>
                    <p className="text-xs font-medium text-slate-500">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Solid Form Card */}
          <div className="bg-white p-8 md:p-12 rounded-[32px] border-4 border-[#161D6F] shadow-[12px_12px_0px_0px_#FFC107]" data-aos="fade-left">
            <h3 className="text-2xl font-black text-[#161D6F] mb-2">Kirim Pesan Langsung</h3>
            <p className="text-slate-500 font-medium mb-8 text-sm">Isi form di bawah ini dan tim kami akan segera merespons via Email.</p>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Lengkap</label>
                  <input type="text" placeholder="John Doe" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-0 focus:border-[#161D6F] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input type="email" placeholder="john@email.com" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-0 focus:border-[#161D6F] transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Subjek</label>
                <input type="text" placeholder="Topik diskusi..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-0 focus:border-[#161D6F] transition-all" />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Pesan</label>
                <textarea rows={4} placeholder="Tuliskan detail pertanyaan Anda..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-0 focus:border-[#161D6F] resize-none transition-all"></textarea>
              </div>

              <button type="button" className="w-full py-4 bg-[#FFC107] hover:bg-[#E0A800] text-[#161D6F] rounded-xl font-black text-lg flex items-center justify-center gap-2 group transition-all mt-4 border-2 border-transparent hover:border-[#161D6F]">
                Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ================= 5. CTA CLOSING ================= */}
      <section className="py-[120px] px-6 bg-[#161D6F] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-4xl mx-auto relative z-10" data-aos="zoom-in">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            Interested in ASGARD?
          </h2>
          <p className="text-lg text-white/70 mb-12 font-medium max-w-2xl mx-auto">
            Pelajari lebih lanjut bagaimana intervensi berbasis data dapat membantu sekolah Anda menurunkan risiko putus sekolah.
          </p>
          <Link href="/about" className="inline-flex items-center justify-center gap-3 bg-[#FFC107] hover:bg-white text-[#161D6F] px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 group">
            Explore System 
            <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </main>
  );
}