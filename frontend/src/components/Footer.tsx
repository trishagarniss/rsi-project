import Link from 'next/link';
import { ChevronRight, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    const team = [
        "Trisha Garnis W.",
        "Alvian Damar B.H.",
        "Fathul Fajar N.I.",
        "Kunto Rossindu H.",
        "Zaki Elias A.Q."
    ];

    return (
        <footer className="bg-[#0F144A] text-white/80 pt-20 pb-8 border-t border-asgard-primary">
        <div className="max-w-7xl mx-auto px-6">
            
            {/* MAIN FOOTER CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            
            {/* Column 1: Brand */}
            <div data-aos="fade-up" data-aos-delay="100">
                <Link href="/" className="flex items-center mb-6">
                <Image
                    src="/Logo-ASGARD.png"
                    alt="ASGARD Logo"
                    width={180}
                    height={60}
                    className="object-contain"
                />
                </Link>
                <p className="text-sm leading-relaxed text-white/70">
                Sistem Informasi Deteksi Dini Risiko Putus Sekolah berbasis data sosial-ekonomi dan akademik untuk membantu sekolah melakukan intervensi lebih awal.
                </p>
            </div>

            {/* Column 2: Quick Links */}
            <div data-aos="fade-up" data-aos-delay="200">
                <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Quick Links</h4>
                <ul className="space-y-4">
                {['Home', 'About', 'FAQ', 'Contact', 'Login'].map((item) => (
                    <li key={item}>
                    <Link 
                        href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                        className="group flex items-center text-sm text-white/70 hover:text-asgard-secondary transition-colors"
                    >
                        <ChevronRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-asgard-secondary" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                    </Link>
                    </li>
                ))}
                </ul>
            </div>

            {/* Column 3: Resources */}
            <div data-aos="fade-up" data-aos-delay="300">
                <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Resources</h4>
                <ul className="space-y-4">
                {['Documentation', 'System Features', 'Privacy Policy', 'Terms of Service'].map((item) => (
                    <li key={item}>
                    <Link 
                        href="#"
                        className="group flex items-center text-sm text-white/70 hover:text-asgard-secondary transition-colors"
                    >
                        <ChevronRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-asgard-secondary" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                    </Link>
                    </li>
                ))}
                </ul>
            </div>

            {/* Column 4: Contact */}
            <div data-aos="fade-up" data-aos-delay="400">
                <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Contact</h4>
                <div className="space-y-4 text-sm text-white/70">
                <p className="font-semibold text-white">Universitas Sebelas Maret</p>
                <p>Program Studi Sains Data</p>
                <div className="flex items-center gap-3 mt-4">
                    <Mail size={16} className="text-asgard-secondary" />
                    <span>team@asgard.edu</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <MapPin size={16} className="text-asgard-secondary" />
                    <span>Surakarta, Indonesia</span>
                </div>
                </div>
            </div>
            </div>

            {/* TEAM SECTION (Mini) */}
            <div className="border-t border-white/10 pt-10 pb-10" data-aos="fade-up" data-aos-delay="500">
            <p className="text-xs uppercase tracking-widest text-white/50 text-center mb-6 font-bold">Developed By</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {team.map((name, idx) => (
                <span 
                    key={idx} 
                    className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80 hover:bg-white/10 hover:border-asgard-secondary/50 transition-colors cursor-default"
                >
                    {name}
                </span>
                ))}
            </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
            <p>© 2026 ASGARD. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
                Built with <span className="text-white/80 font-semibold">Next.js, FastAPI, PostgreSQL</span>
            </p>
            </div>

        </div>
        </footer>
    );
}