"use client";

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Deteksi scroll untuk memunculkan tombol jika turun lebih dari 300px
    useEffect(() => {
        const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Fungsi animasi kembali ke atas
    const scrollToTop = () => {
        window.scrollTo({
        top: 0,
        behavior: 'smooth',
        });
    };

    return (
        <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3.5 rounded-full bg-asgard-secondary text-asgard-primary shadow-[0_4px_14px_rgba(255,193,7,0.4)] transition-all duration-300 z-50 hover:-translate-y-1.5 hover:shadow-[0_6px_20px_rgba(255,193,7,0.6)] focus:outline-none ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Kembali ke atas"
        >
        <ArrowUp size={24} strokeWidth={3} />
        </button>
    );
}