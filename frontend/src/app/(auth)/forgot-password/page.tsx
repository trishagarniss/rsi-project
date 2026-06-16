"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  ArrowRight, 
  Mail, 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { authService } from '@/services/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Form state
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Countdown timer untuk resend token
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleBack = () => {
    if (step > 1) {
      setError('');
      setStep(step - 1);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 1) {
        await authService.requestForgotPassword(email);
        setCountdown(60);
        setStep(2);
      } else if (step === 2) {
        await authService.verifyResetToken(email, token);
        setStep(3);
      } else if (step === 3) {
        await authService.resetPassword(email, token, newPassword);
        alert("Password berhasil diubah! Silakan login kembali.");
        router.push('/login');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    if (countdown > 0) return;
    setError('');
    setLoading(true);
    try {
      await authService.requestForgotPassword(email);
      setCountdown(60);
      alert('Token baru telah dikirim ke email Anda.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim ulang token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#161D6F]">
      
      {/* ================= BACKGROUND VISUAL ================= */}
      <Image 
        src="/hero-bg.jpg" 
        alt="School Environment" 
        fill 
        className="object-cover object-center z-0 opacity-40 mix-blend-overlay"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#161D6F]/90 to-[#2434B5]/80 z-0" />
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFC107]/15 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* ================= FORM CARD ================= */}
      <div 
        className="relative z-10 w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/10"
        data-aos="zoom-in"
      >
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#161D6F] mb-6 shadow-sm border border-slate-100">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-[#161D6F] tracking-tight">
            {step === 1 && "Lupa Password?"}
            {step === 2 && "Verifikasi Token"}
            {step === 3 && "Buat Password Baru"}
          </h1>
          <p className="text-slate-500 mt-2 text-xs font-medium px-4">
            {step === 1 && "Masukkan email terdaftar Anda. Kami akan mengirimkan 6 digit token untuk reset password."}
            {step === 2 && "Cek kotak masuk email Anda dan masukkan 6 digit token keamanan di bawah ini."}
            {step === 3 && "Pastikan password baru Anda kuat, unik, dan tidak mudah ditebak."}
          </p>
        </div>

        {/* Step Indicator (Progress) */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                step === item ? 'w-8 bg-[#FFC107]' : step > item ? 'w-4 bg-[#161D6F]' : 'w-4 bg-slate-200'
              }`} 
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleNextStep} className="space-y-5">
          
          {/* STEP 1: INPUT EMAIL */}
          {step === 1 && (
            <div className="space-y-1.5" data-aos="fade-left" data-aos-duration="400">
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sekolah.sch.id" 
                  className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 2: INPUT TOKEN */}
          {step === 2 && (
            <div className="space-y-4" data-aos="fade-left" data-aos-duration="400">
              <p className="text-center text-[11px] font-semibold text-slate-400">
                Token dikirim ke: <span className="text-[#161D6F] font-bold">{email}</span>
              </p>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 text-center">Token Keamanan</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                  <input 
                    type="text" 
                    required
                    maxLength={6} 
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="000000" 
                    className="w-full pl-11 pr-4 h-[56px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-black text-slate-800 text-2xl tracking-[0.5em] text-center"
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleResendToken} 
                disabled={loading || countdown > 0}
                className="w-full text-center text-xs font-bold disabled:text-slate-300 text-[#161D6F] hover:text-[#FFC107] transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} className={countdown > 0 ? 'animate-spin' : ''} /> 
                {countdown > 0 ? `Kirim ulang (${countdown}s)` : 'Kirim ulang token'}
              </button>
              <button 
                type="button" 
                onClick={handleBack}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-[#161D6F] transition-colors"
              >
                &larr; Ganti email
              </button>
            </div>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <div className="space-y-4" data-aos="fade-left" data-aos-duration="400">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Password Baru</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-11 h-[48px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 tracking-wider text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#161D6F] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleBack}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-[#161D6F] transition-colors"
              >
                &larr; Kembali
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-[48px] bg-[#161D6F] hover:bg-indigo-900 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-black text-sm shadow-[0_10px_20px_rgba(22,29,111,0.2)] hover:shadow-[0_15px_30px_rgba(22,29,111,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group mt-6"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Memproses...' : step === 1 ? 'Kirim Token Keamanan' : step === 2 ? 'Verifikasi Token' : 'Simpan Password Baru'}
            {!loading ? <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /> : null}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-[#161D6F] transition-colors">
            &larr; Kembali ke halaman Login
          </Link>
        </div>

      </div>
    </main>
  );
}