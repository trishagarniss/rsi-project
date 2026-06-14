"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
    Search, 
    MessageSquareMore, 
    ShieldCheck, 
    Database, 
    UsersRound, 
    BrainCircuit, 
    FileQuestion, 
    ChevronDown, 
    PhoneCall,
    ArrowRight
} from "lucide-react";

export default function FAQPage() {
    const [openFaq, setOpenFaq] = useState<string | null>("general-0");
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // Data FAQ dikelompokkan sesuai dokumen
    const faqData = [
        {
        category: "General",
        icon: FileQuestion,
        items: [
            { q: "Apa itu ASGARD?", a: "ASGARD adalah sistem informasi yang membantu sekolah mendeteksi risiko putus sekolah lebih awal melalui analisis data akademik dan sosial-ekonomi siswa." },
            { q: "Siapa yang dapat menggunakan ASGARD?", a: "Sistem ini dirancang untuk Super Admin (Dinas/Yayasan), Admin Sekolah (Operator), dan Konselor atau Guru BK untuk melakukan tindakan preventif." },
            { q: "Apakah sistem ini dapat digunakan banyak sekolah?", a: "Ya, ASGARD dibangun menggunakan arsitektur multi-tenant yang memungkinkan banyak sekolah menggunakan satu platform tanpa percampuran data." }
        ]
        },
        {
        category: "Risk Analysis",
        icon: BrainCircuit,
        items: [
            { q: "Bagaimana sistem menentukan risiko?", a: "Sistem memproses variabel seperti Kehadiran, Nilai Akademik, Status KIP, Penghasilan Orang Tua, Jumlah Tanggungan, dan variabel pendukung lainnya menggunakan algoritma Machine Learning." },
            { q: "Apakah hasil analisis selalu benar?", a: "Tidak. ASGARD berfungsi sebagai Decision Support System (Sistem Pendukung Keputusan). Keputusan akhir dan validasi tetap berada pada pihak sekolah atau Guru BK." },
            { q: "Kapan analisis dapat dijalankan?", a: "Analisis dan kalkulasi ulang risiko dapat dijalankan secara otomatis setiap kali ada pembaruan data akademik atau presensi siswa." }
        ]
        },
        {
        category: "Security",
        icon: ShieldCheck,
        items: [
            { q: "Apakah data siswa aman?", a: "Sangat aman. Data dienkripsi dengan standar industri dan hanya dapat diakses oleh pengguna yang memiliki hak akses sesuai Role-Based Access Control (RBAC)." },
            { q: "Apakah aktivitas pengguna tercatat?", a: "Ya. Setiap perubahan data, login, dan aktivitas penting lainnya dicatat secara detail dalam Audit Log sistem untuk pelacakan keamanan." }
        ]
        },
        {
        category: "Data & Counseling",
        icon: Database,
        items: [
            { q: "Apakah data dapat diimpor dari Excel?", a: "Ya. Admin sekolah dapat melakukan impor data siswa dan nilai secara massal menggunakan format Excel atau CSV yang telah disediakan." },
            { q: "Bagaimana proses intervensi dilakukan?", a: "Konselor (Guru BK) dapat memfilter siswa berisiko tinggi di dashboard, membuat log catatan konseling, menjadwalkan sesi, hingga mencetak surat panggilan orang tua." }
        ]
        }
    ];

    const categories = ["Semua", "General", "Risk Analysis", "Security", "Data & Counseling"];

    const filteredFaqData = faqData
        .map(section => ({
            ...section,
            items: section.items.filter(faq =>
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }))
        .filter(section =>
            (activeCategory === "Semua" || section.category === activeCategory) &&
            section.items.length > 0
        );

    const hasNoResults = searchQuery && filteredFaqData.length === 0;

    return (
        <main className="w-full font-sans antialiased text-slate-800 bg-[#F8FAFC] overflow-hidden">
        
        {/* ================= 1. HERO FAQ & SEARCH ================= */}
        <section className="relative pt-36 md:pt-40 pb-48 px-6 bg-[#161D6F] text-center overflow-hidden z-10">

            {/* Background Image with Blur & Solid Overlay */}
            <Image 
            src="/hero-bg.jpg" 
            alt="School Environment" 
            fill 
            className="object-cover object-center z-0 opacity-40 blur-[4px]"
            priority
            />
            <div className="absolute inset-0 bg-[#161D6F]/85 z-0" />
            
            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFC107]/15 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 max-w-4xl mx-auto" data-aos="fade-up">
            <MessageSquareMore size={56} className="mx-auto text-[#FFC107] mb-6 drop-shadow-md" />
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-sm">
                Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto drop-shadow-sm">
                Temukan jawaban mengenai operasional sistem, keamanan data, algoritma analisis risiko, dan proses intervensi siswa.
            </p>
            </div>
        </section>

        {/* ================= 2. SEARCH BAR (OVERLAPPING) ================= */}
        <section className="px-6 -mt-16 relative z-20">
            <div className="max-w-3xl mx-auto" data-aos="zoom-in" data-aos-delay="200">
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={28} strokeWidth={2.5} />
                <input 
                type="text" 
                placeholder="Cari pertanyaan... (misal: Keamanan Data)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-20 pr-8 py-6 rounded-2xl border-4 border-[#161D6F] shadow-[8px_8px_0px_0px_#FFC107] focus:shadow-[12px_12px_0px_0px_#FFC107] focus:outline-none focus:-translate-y-1 transition-all duration-300 text-lg font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium bg-white"
                />
            </div>
            </div>
        </section>

        {/* ================= 3. QUICK CATEGORIES ================= */}
        <section className="py-16 px-6">
            <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4" data-aos="fade-up">
            {categories.map((cat, i) => (
                <button 
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
                    activeCategory === cat 
                    ? 'bg-[#161D6F] text-[#FFC107] border-[#161D6F] shadow-[4px_4px_0px_0px_#FFC107] -translate-y-1' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-[#161D6F] hover:text-[#161D6F]'
                }`}
                >
                {cat}
                </button>
            ))}
            </div>
        </section>

        {/* ================= 4. POPULAR QUESTIONS (SOLID CARDS) ================= */}
        <section className="pb-16 px-6">
            <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-[#161D6F] mb-6 text-center" data-aos="fade-up">Pertanyaan Populer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                { q: "Apa itu ASGARD?", icon: FileQuestion },
                { q: "Bagaimana sistem menentukan risiko?", icon: BrainCircuit },
                { q: "Apakah data siswa aman?", icon: ShieldCheck }
                ].map((item, i) => (
                <div 
                    key={i} 
                    className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-[#161D6F] hover:shadow-[6px_6px_0px_0px_#FFC107] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-start gap-4"
                    data-aos="zoom-in-up" 
                    data-aos-delay={i * 100}
                    onClick={() => {
                    setActiveCategory("Semua");
                    setOpenFaq(`popular-${i}`); // Simulasi klik
                    }}
                >
                    <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#161D6F] group-hover:text-[#FFC107] transition-colors">
                    <item.icon size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-slate-700 group-hover:text-[#161D6F] mt-2 leading-snug">{item.q}</h3>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* ================= 5. FAQ ACCORDION ================= */}
        <section className="pb-[120px] px-6">
            <div className="max-w-3xl mx-auto space-y-12">
            {hasNoResults ? (
                <div className="text-center py-20" data-aos="fade-up">
                    <FileQuestion size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-500 mb-2">Pertanyaan tidak ditemukan</h3>
                    <p className="text-slate-400 font-medium">Coba gunakan kata kunci lain untuk mencari pertanyaan.</p>
                </div>
            ) : filteredFaqData.map((section, sIdx) => (
                <div key={sIdx} data-aos="fade-up">
                
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#EEF2FF] text-[#161D6F] rounded-xl flex items-center justify-center">
                    <section.icon size={20} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black text-[#161D6F]">{section.category}</h2>
                </div>

                {/* Accordion Items */}
                <div className="space-y-4">
                    {section.items.map((faq, fIdx) => {
                    const faqId = `${section.category}-${fIdx}`;
                    const isOpen = openFaq === faqId;

                    return (
                        <div 
                        key={fIdx} 
                        className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                            isOpen ? 'border-[#161D6F] shadow-[6px_6px_0px_0px_#FFC107] -translate-y-1' : 'border-slate-200 hover:border-slate-300'
                        }`}
                        >
                        <button 
                            onClick={() => setOpenFaq(isOpen ? null : faqId)}
                            className="w-full px-6 py-6 flex justify-between items-center text-left focus:outline-none group"
                        >
                            <span className={`font-bold text-lg pr-4 ${isOpen ? 'text-[#161D6F]' : 'text-slate-700 group-hover:text-[#161D6F]'}`}>
                            {faq.q}
                            </span>
                            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#FFC107] text-[#161D6F]' : 'bg-slate-50 text-slate-400 group-hover:bg-[#EEF2FF] group-hover:text-[#161D6F]'}`}>
                            <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} strokeWidth={3} />
                            </div>
                        </button>
                        <div 
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'}`}
                        >
                            <div className="h-px w-full bg-slate-100 mb-4" />
                            <p className="text-slate-500 font-medium leading-relaxed">
                            {faq.a}
                            </p>
                        </div>
                        </div>
                    );
                    })}
                </div>

                </div>
            ))}
            </div>
        </section>

        {/* ================= 6. STILL NEED HELP ================= */}
        <section className="py-[100px] px-6 bg-white border-y-2 border-slate-100">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[#EEF2FF] p-10 md:p-14 rounded-[32px] border-2 border-slate-200" data-aos="fade-up">
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#161D6F] font-bold text-xs uppercase tracking-widest mb-4 shadow-sm">
                <PhoneCall size={14} /> Support Center
                </div>
                <h3 className="text-3xl font-black text-[#161D6F] mb-2">Masih memiliki pertanyaan?</h3>
                <p className="text-slate-600 font-medium max-w-md">
                Tim pengembang ASGARD siap membantu Anda untuk informasi lebih lanjut dan kendala teknis.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                <Link href="/contact" className="px-8 py-4 bg-[#161D6F] text-white rounded-xl font-bold text-center hover:bg-indigo-900 transition-colors shadow-[0_10px_20px_rgba(22,29,111,0.2)] hover:-translate-y-1">
                Contact Us
                </Link>
                <Link href="/about" className="px-8 py-4 bg-white text-[#161D6F] rounded-xl font-bold text-center border-2 border-slate-200 hover:border-[#161D6F] transition-all hover:-translate-y-1">
                About ASGARD
                </Link>
            </div>
            </div>
        </section>

        {/* ================= 7. CTA LOGIN ================= */}
        <section className="py-[120px] px-6 text-center bg-[#161D6F] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
            
            <div className="max-w-3xl mx-auto relative z-10" data-aos="zoom-in">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Siap Menggunakan ASGARD?
            </h2>
            <p className="text-lg text-white/70 mb-10 font-medium">
                Masuk ke dashboard dan mulai melakukan pemantauan risiko siswa di sekolah Anda secara presisi.
            </p>
            <Link href="/login" className="inline-flex items-center justify-center gap-3 bg-[#FFC107] hover:bg-[#E0A800] text-[#161D6F] px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 group">
                Login Dashboard 
                <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            </div>
        </section>

        </main>
    );
}