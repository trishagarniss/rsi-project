'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { usePathname } from 'next/navigation';

export default function AOSInit() {
  const pathname = usePathname();

  // 1. Inisialisasi awal saat website pertama kali dibuka
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }, []);

  // 2. Refresh AOS setiap pindah halaman, TAPI dikasih JEDA 100ms
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);

    // Bersihkan timer kalau user pindah halaman terlalu cepat
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}