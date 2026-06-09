"use client";

import React, { useEffect, useState } from 'react';
import { 
    Search, 
    ChevronDown, 
    Mail,
    ArrowRight
} from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';

export default function FAQPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const faqs = [
        { q: "Apa itu ASGARD?", a: "ASGARD (Analisis Sistem Gejala Awal Risiko Dropout) adalah platform berbasis data yang membantu sekolah mendeteksi potensi risiko putus sekolah sejak dini melalui analisis pola akademik dan sosio-ekonomi." },
        { q: "Bagaimana cara kerja sistem deteksi risikonya?", a: "Sistem menggunakan algoritma Machine Learning yang memproses data absensi, nilai, dan rekam jejak perilaku siswa untuk memberikan skor risiko secara otomatis kepada pihak sekolah." },
        { q: "Apakah data siswa dijamin keamanannya?", a: "Keamanan adalah prioritas kami. Data dienkripsi dengan standar industri, dan akses dibatasi hanya untuk staf sekolah yang berwenang melalui sistem manajemen peran yang ketat." },
        { q: "Siapa saja yang bisa mengakses dashboard ASGARD?", a: "Sistem mendukung akses bertingkat: Kepala Sekolah untuk pemantauan umum, Guru BK untuk tindakan intervensi, dan Admin untuk pengelolaan data siswa." },
        { q: "Apakah sistem ini membutuhkan perangkat khusus?", a: "Tidak. ASGARD berbasis cloud dan dapat diakses melalui browser komputer maupun tablet tanpa instalasi perangkat lunak tambahan." }
    ];

    return (
        <main className="min-h-screen bg-slate-50">
        {/* Hero FAQ */}
        <section className="py-24 px-6 text-center bg-[#161D6F] text-white">
            <div className="max-w-3xl mx-auto" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Pusat Bantuan</h1>
            <p className="text-white/70 text-lg md:text-xl font-light">Temukan jawaban cepat mengenai sistem ASGARD.</p>
            
            {/* Search Bar */}
            <div className="mt-10 relative max-w-lg mx-auto" data-aos="zoom-in" data-aos-delay="200">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                type="text" 
                placeholder="Cari pertanyaan..." 
                className="w-full py-4 pl-12 pr-6 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-white placeholder:text-white/30"
                />
            </div>
            </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
                <div 
                key={i} 
                className="mb-4 bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-[#161D6F] transition-all"
                data-aos="fade-up"
                data-aos-delay={i * 100}
                >
                <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-8 py-6 flex justify-between items-center text-left font-bold text-lg text-[#161D6F]"
                >
                    {faq.q}
                    <ChevronDown className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-8 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                    <p className="text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
                </div>
            ))}
            </div>
        </section>

        {/* Still Need Help */}
        <section className="py-20 px-6 text-center">
            <div className="max-w-2xl mx-auto bg-[#161D6F] p-12 rounded-[32px] text-white" data-aos="fade-up">
            <Mail size={48} className="mx-auto mb-6 text-[#FFC107]" />
            <h3 className="text-2xl font-bold mb-4">Masih butuh bantuan?</h3>
            <p className="text-white/70 mb-8">Tim support kami siap membantu segala kendala teknis Anda.</p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-[#FFC107] text-[#161D6F] font-bold px-8 py-4 rounded-2xl hover:bg-yellow-500 transition-colors">
                Hubungi Kami <ArrowRight size={20} />
            </a>
            </div>
        </section>
        </main>
    );
}