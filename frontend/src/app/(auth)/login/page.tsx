"use client";

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertTriangle, 
  CalendarClock, 
  Users,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // 1. State untuk menyimpan ketikan input form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2. State untuk mengatur status loading dan pesan error dari backend
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
      window.history.replaceState({}, '', '/login');
      return 'Registrasi berhasil! Silakan login dengan akun yang telah dibuat.';
    }
    return '';
  });
  const { login } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // 3. Fungsi utama untuk memproses Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman refresh otomatis
    setIsLoading(true);
    setErrorMsg('');

    try {
      const userData = await login(email, password);

      if (userData.role === UserRole.SUPERADMIN) {
        router.push('/superadmin');
      } else {
        router.push('/dashboard');
      }

    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] bg-linear-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
      
      {/* ================= LEFT SIDE (VISUAL AREA - 55%) ================= */}
      <div className="relative hidden lg:flex flex-col justify-center p-10 xl:p-16 overflow-hidden bg-[#161D6F] rounded-r-3xl shadow-[20px_0_50px_rgba(0,0,0,0.1)] z-20">
        
        <Image 
          src="/hero-bg.jpg" 
          alt="School Environment" 
          fill 
          className="object-cover object-center z-0 opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#161D6F]/85 via-[#161D6F]/80 to-[#2434B5]/70 z-0" />
        
        {/* Blurs for Aesthetic Depth */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFC107]/15 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-2xl" data-aos="fade-right">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck size={16} className="text-[#FFC107]" />
            ASGARD Platform
          </div>
          
          {/* Main Heading */}
          <h1 className="text-[clamp(2rem,3.5vw,3.5rem)] font-extrabold text-white leading-[1.1] tracking-tight mb-4 drop-shadow-md">
            Deteksi Risiko Putus Sekolah <br />
            Secara <span className="text-[#FFC107]">Lebih Awal</span> dan Proaktif
          </h1>
          
          <p className="text-base text-white/80 leading-relaxed font-medium mb-8 max-w-xl drop-shadow-sm">
            Mengintegrasikan data akademik dan sosial-ekonomi untuk membantu sekolah mengambil tindakan sebelum terlambat.
          </p>

          {/* Floating Analytics Cards */}
          <div className="relative h-[220px] w-full" data-aos="zoom-in" data-aos-delay="200">
            
            {/* Card 1: High Risk */}
            <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-[bounce_4s_ease-in-out_infinite]">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">High Risk</p>
                <p className="text-lg font-black text-white">12 Students</p>
              </div>
            </div>

            {/* Card 2: Attendance Alert */}
            <div className="absolute top-20 left-28 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-[bounce_5s_ease-in-out_infinite_0.5s]">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-[#FFC107] flex items-center justify-center border border-yellow-500/30">
                <CalendarClock size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Attendance Alert</p>
                <p className="text-lg font-black text-white">Warning Level</p>
              </div>
            </div>

            {/* Card 3: Counseling Activity */}
            <div className="absolute top-6 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-[bounce_6s_ease-in-out_infinite_1s]">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Counseling</p>
                <p className="text-lg font-black text-white">Active Sessions</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (LOGIN FORM - 45%) ================= */}
      <div className="relative flex items-center justify-center p-6 lg:p-8 z-10 w-full min-h-screen lg:min-h-0">
        
        <div className="w-full max-w-[420px]" data-aos="fade-left">
          
          {/* Mobile Only Header (Logo & Title) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#161D6F] text-[#FFC107] mb-4 shadow-xl">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-[#161D6F] tracking-tight">ASGARD</h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">Deteksi Risiko Putus Sekolah Lebih Awal.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white p-8 sm:p-10 rounded-[32px] shadow-[0_25px_60px_rgba(22,29,111,0.08)] border border-slate-100">
            
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#161D6F] mb-1 flex items-center gap-2">
                <ShieldCheck className="text-[#FFC107]" size={24} /> Sign in to continue
              </h2>
              <p className="text-slate-500 text-xs">Masukkan kredensial akun Anda untuk mengakses dashboard analitik.</p>
            </div>

            {/* 4. Notifikasi Sukses (dari redirect register) */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-emerald-700 text-xs font-bold">
                <CheckCircle2 size={16} />
                <p>{successMsg}</p>
              </div>
            )}

            {/* 5. Notifikasi Error Muncul di sini jika login gagal */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-xs font-bold animate-pulse">
                <AlertTriangle size={16} />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* 5. Form dihubungkan dengan onSubmit */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="admin@sekolah.sch.id" 
                    className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <Link href="/forgot-password" className="text-[11px] font-bold text-[#161D6F] hover:underline transition-all">
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-11 h-[48px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 tracking-wider text-sm disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#161D6F] transition-colors focus:outline-none disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 py-1">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-4 h-4 rounded-md border-slate-300 text-[#161D6F] focus:ring-[#161D6F] transition-colors cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                  Ingat perangkat ini
                </label>
              </div>

              {/* 6. Submit Button (Otomatis berubah kalau sedang loading) */}
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full h-[48px] text-[#161D6F] rounded-xl font-black text-base transition-all duration-300 flex items-center justify-center gap-2 group mt-2 
                  ${isLoading 
                    ? 'bg-[#E0A800] opacity-70 cursor-not-allowed shadow-none' 
                    : 'bg-[#FFC107] hover:bg-[#E0A800] shadow-[0_10px_20px_rgba(255,193,7,0.2)] hover:shadow-[0_15px_30px_rgba(255,193,7,0.3)] hover:-translate-y-0.5'
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Mengautentikasi...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-4 flex items-center justify-center gap-4 opacity-50">
              <div className="h-px w-full bg-slate-300" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">ASGARD SYSTEM</span>
              <div className="h-px w-full bg-slate-300" />
            </div>

            {/* Security Notice */}
            <div className="flex items-start justify-center gap-2 text-slate-400">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" />
              <p className="text-[11px] font-medium leading-relaxed max-w-[200px] text-center">
                Protected access for authorized users only. 
              </p>
            </div>

          </div>

          {/* Registration Link */}
          <p className="text-center text-slate-500 mt-6 text-xs font-medium">
            Belum terdaftar dalam sistem?{' '}
            <Link href="/register" className="text-[#161D6F] font-bold hover:underline transition-all">
              Daftar Instansi
            </Link>
          </p>

        </div>
      </div>

    </main>
  );
}