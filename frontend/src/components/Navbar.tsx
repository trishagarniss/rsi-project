"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 20) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
            isScrolled 
            ? 'bg-asgard-primary/95 backdrop-blur-md border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] py-1' 
            : 'bg-asgard-primary/40 backdrop-blur-sm border-transparent py-2'
        }`}
        >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative">
            
            {/* LOGO AREA - Gunakan flex-1 agar seimbang dengan area tombol */}
            <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center group">
                <Image
                src="/Logo-ASGARD.png"
                alt="ASGARD Logo"
                width={150}
                height={50}
                className="object-contain group-hover:scale-105 transition-all duration-300"
                />
            </Link>
            </div>

            {/* DESKTOP NAVIGATION - flex-none agar ukurannya kaku di tengah */}
            <nav className="hidden md:flex flex-none items-center gap-8">
            {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                <Link 
                    key={link.name}
                    href={link.path} 
                    className={`relative font-medium text-sm transition-colors duration-200 py-2 ${
                    isActive ? 'text-white font-bold' : 'text-white/70 hover:text-asgard-secondary'
                    }`}
                >
                    {link.name}
                    {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-asgard-secondary rounded-t-md shadow-[0_0_8px_rgba(255,193,7,0.6)]" />
                    )}
                </Link>
                );
            })}
            </nav>

            {/* LOGIN BUTTON & MOBILE TOGGLE - flex-1 agar seimbang dengan logo */}
            <div className="flex-1 flex justify-end items-center gap-4">
            <Link 
                href="/login" 
                className="hidden md:inline-flex bg-asgard-secondary hover:bg-asgard-accent text-asgard-primary px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_4px_14px_rgba(255,193,7,0.3)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.5)] hover:-translate-y-0.5 focus:ring-2 focus:ring-asgard-secondary/50 outline-none"
            >
                Login
            </Link>
            
            <button 
                className="md:hidden p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            </div>
        </div>

        {/* MOBILE DRAWER */}
        <div 
            className={`md:hidden absolute w-full bg-asgard-primary/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
            <div className="px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                <Link 
                    key={link.name}
                    href={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-semibold text-lg flex items-center gap-3 ${
                    isActive ? 'text-asgard-secondary' : 'text-white/80 hover:text-white'
                    }`}
                >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-asgard-secondary" />}
                    {link.name}
                </Link>
                );
            })}
            <div className="h-px bg-white/10 my-2" />
            <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center bg-asgard-secondary text-asgard-primary px-6 py-3.5 rounded-xl font-bold shadow-lg transition-colors active:scale-95"
            >
                Masuk ke Aplikasi
            </Link>
            </div>
        </div>
        </header>
    );
}