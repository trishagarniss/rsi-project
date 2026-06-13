"use client"; 

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { usePathname } from "next/navigation";

export default function AOSInit() {
  const pathname = usePathname(); // Mendeteksi halaman saat ini

  useEffect(() => {
    // 1. Inisialisasi awal AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
    
    // 2. Paksa AOS untuk refresh setiap kali URL/halaman berubah
    AOS.refresh();
    
  }, [pathname]);

  return null;
}