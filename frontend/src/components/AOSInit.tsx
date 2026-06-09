"use client"; 

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Wajib import CSS-nya agar animasinya jalan

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 800,       // Durasi animasi (millisecond)
      once: true,          // Jika true, animasi hanya jalan 1x saat di-scroll ke bawah (tidak berulang saat scroll naik)
      easing: 'ease-out',  // Gaya transisi animasi yang smooth
      offset: 100,         // Jarak (px) dari bawah layar sebelum animasi dimulai
    });
  }, []);

  return null; // Komponen ini tidak menampilkan wujud UI apa pun, hanya menjalankan script
}