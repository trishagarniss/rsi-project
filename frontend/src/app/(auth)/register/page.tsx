"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  User, 
  UsersRound, 
  ChartNoAxesCombined,
  ArrowRight,
  KeyRound,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [regCode, setRegCode] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setErrorMsg('');

    try {
      await authService.checkRegCode(regCode);
      setStep(2);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      const status = err.response?.status;
      const messages: Record<number, string> = {
        404: 'Kode registrasi tidak valid.',
        400: 'Kode registrasi tidak valid atau sudah kadaluarsa.',
        410: 'Kode registrasi sudah digunakan.',
      };
      setErrorMsg(messages[status ?? 0] || 'Koneksi gagal. Periksa jaringan Anda.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('Harap menyetujui kebijakan privasi terlebih dahulu.');
      return;
    }

    setIsRegistering(true);

    try {
      await authService.registerAdmin(regCode, { fullname, email, password });
      router.push('/login?registered=true');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      const status = err.response?.status;
      const messages: Record<number, string> = {
        409: 'Email sudah terdaftar.',
        400: 'Data yang dikirim tidak valid.',
        422: 'Data yang dikirim tidak valid.',
        500: 'Terjadi kesalahan server. Silakan coba lagi nanti.',
      };
      setErrorMsg(messages[status ?? 0] || 'Koneksi gagal. Periksa jaringan Anda.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setErrorMsg('');
  };

  return (
    <main className="h-screen w-full grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] bg-linear-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
      
      {/* ================= LEFT SIDE (REGISTER FORM - 45%) ================= */}
      <div className="relative flex items-center justify-center p-6 lg:p-8 z-10 w-full min-h-screen lg:min-h-0 order-2 lg:order-1">
        
        <div className="w-full max-w-[480px]">
          
          {/* Mobile Only Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#161D6F] text-[#FFC107] mb-4 shadow-xl">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-[#161D6F] tracking-tight">ASGARD</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-[0_25px_60px_rgba(22,29,111,0.08)] border border-slate-100">
            
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#161D6F] mb-1 flex items-center gap-2">
                <UsersRound className="text-[#FFC107]" size={24} /> Pendaftaran Instansi
              </h2>
              <p className="text-slate-500 text-xs">
                {step === 1
                  ? 'Masukkan kode registrasi dari Superadmin untuk memulai.'
                  : 'Lengkapi data untuk membuat akun admin sekolah.'}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#161D6F]' : 'text-emerald-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  step === 1 ? 'bg-[#FFC107] text-[#161D6F]' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {step > 1 ? <CheckCircle2 size={16} /> : '1'}
                </div>
                <span className="text-xs font-bold">Kode</span>
              </div>
              <div className={`flex-1 h-px ${step === 2 ? 'bg-emerald-300' : 'bg-slate-200'}`} />
              <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#161D6F]' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  step === 2 ? 'bg-[#FFC107] text-[#161D6F]' : 'bg-slate-100 text-slate-400'
                }`}>
                  2
                </div>
                <span className="text-xs font-bold">Data</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-xs font-bold">
                <AlertTriangle size={16} />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Step 1: Registration Code */}
            {step === 1 && (
              <form onSubmit={handleCheckCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Registration Code</label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                    <input
                      type="text"
                      value={regCode}
                      onChange={(e) => setRegCode(e.target.value)}
                      required
                      disabled={isChecking}
                      placeholder="Masukkan kode dari Superadmin"
                      className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 text-sm tracking-wider disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isChecking || !regCode.trim()}
                  className={`w-full h-[48px] rounded-xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 group mt-2 ${
                    isChecking || !regCode.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-[#161D6F] hover:bg-indigo-900 text-white shadow-[0_10px_20px_rgba(22,29,111,0.2)] hover:shadow-[0_15px_30px_rgba(22,29,111,0.3)] hover:-translate-y-0.5'
                  }`}
                >
                  {isChecking ? (
                    <><Loader2 size={18} className="animate-spin" /> Memverifikasi...</>
                  ) : (
                    <><KeyRound size={18} strokeWidth={2.5} /> Verifikasi Kode</>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Registration Form */}
            {step === 2 && (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Informasi Kode Terverifikasi */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Kode terverifikasi — silakan lengkapi data diri.</span>
                </div>

                {/* Fullname */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                      disabled={isRegistering}
                      placeholder="Nama Lengkap Anda"
                      className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Email Instansi</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isRegistering}
                      placeholder="admin@sekolah.sch.id"
                      className="w-full pl-11 pr-4 h-[48px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isRegistering}
                        placeholder="Min. 8 karakter"
                        className="w-full pl-9 pr-9 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 tracking-wider text-sm disabled:bg-slate-50 disabled:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isRegistering}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#161D6F] transition-colors focus:outline-none disabled:opacity-50"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Konfirmasi</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#161D6F] transition-colors" size={16} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isRegistering}
                        placeholder="Ulangi password"
                        className="w-full pl-9 pr-9 h-[44px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#161D6F] outline-none transition-all font-medium text-slate-800 tracking-wider text-sm disabled:bg-slate-50 disabled:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isRegistering}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#161D6F] transition-colors focus:outline-none disabled:opacity-50"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 py-1 mt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={isRegistering}
                    className="w-4 h-4 mt-0.5 rounded-md border-slate-300 text-[#161D6F] focus:ring-[#161D6F] transition-colors cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] font-medium text-slate-500 cursor-pointer select-none leading-relaxed">
                    Saya menyetujui kebijakan privasi dan pakta integritas kerahasiaan data ASGARD.
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    disabled={isRegistering}
                    className="w-1/3 h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className={`flex-1 h-[48px] rounded-xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 group ${
                      isRegistering
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-[#161D6F] hover:bg-indigo-900 text-white shadow-[0_10px_20px_rgba(22,29,111,0.2)] hover:shadow-[0_15px_30px_rgba(22,29,111,0.3)] hover:-translate-y-0.5'
                    }`}
                  >
                    {isRegistering ? (
                      <><Loader2 size={18} className="animate-spin" /> Mendaftarkan...</>
                    ) : (
                      <>Selesaikan Pendaftaran <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-slate-500 mt-6 text-xs font-medium">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="text-[#FFC107] font-black hover:underline transition-all">
                Login Sekarang
              </Link>
            </p>

          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (VISUAL AREA - 55%) ================= */}
      <div className="relative hidden lg:flex flex-col justify-center p-10 xl:p-16 overflow-hidden bg-[#161D6F] order-1 lg:order-2 rounded-l-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-20">
        
        <Image 
          src="/hero-bg.jpg" 
          alt="School Environment" 
          fill 
          className="object-cover object-center z-0 opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-bl from-[#161D6F]/85 via-[#161D6F]/80 to-[#2434B5]/70 z-0" />
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFC107]/15 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-2xl ml-auto">
          
          <h1 className="text-[clamp(2rem,3.5vw,3.5rem)] font-extrabold text-white leading-[1.1] tracking-tight mb-4 drop-shadow-md">
            Bergabung dengan <br /> Ekosistem <span className="text-[#FFC107]">ASGARD</span>
          </h1>
          
          <p className="text-base text-white/80 leading-relaxed font-medium mb-10 max-w-lg drop-shadow-sm">
            Satu langkah lagi untuk mentransformasi data menjadi keputusan preventif yang menyelamatkan masa depan pendidikan.
          </p>

          <div className="relative h-[240px] w-full">
            
            <div className="absolute top-0 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Infrastruktur</p>
                <p className="text-lg font-black text-white">Keamanan Enkripsi</p>
              </div>
            </div>

            <div className="absolute top-20 right-56 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center border border-[#FFC107]/30">
                <UsersRound size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Aksesibilitas</p>
                <p className="text-lg font-black text-white">Multi-Role System</p>
              </div>
            </div>

            <div className="absolute top-36 right-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <ChartNoAxesCombined size={20} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Analitik</p>
                <p className="text-lg font-black text-white">Data Real-Time</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
}
