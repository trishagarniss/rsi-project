"use client";

import React, { useState } from 'react';
import { ArrowRight, Mail, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Token, 3: New Password
  const [loading, setLoading] = useState(false);

  // Simulasi simulasi pengiriman data
  const handleNext = () => setLoading(true);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="bg-white p-10 md:p-14 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 max-w-md w-full">
        
        {/* Header Step */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-[#161D6F]">
            {step === 1 && "Lupa Password"}
            {step === 2 && "Verifikasi Token"}
            {step === 3 && "Password Baru"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {step === 1 && "Masukkan email akun Anda untuk menerima token."}
            {step === 2 && "Masukkan 6 digit token dari email Anda."}
            {step === 3 && "Buat password baru yang kuat."}
          </p>
        </div>

        {/* Step 1: Input Email */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" placeholder="email@sekolah.sch.id" className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107] outline-none" />
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-[#161D6F] text-white py-4 rounded-xl font-bold hover:bg-indigo-900 transition-colors">
              Kirim Token
            </button>
          </div>
        )}

        {/* Step 2: Input Token */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" maxLength={6} placeholder="000000" className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-[#FFC107] outline-none" />
            </div>
            <button onClick={() => setStep(3)} className="w-full bg-[#161D6F] text-white py-4 rounded-xl font-bold hover:bg-indigo-900 transition-colors">
              Verifikasi Token
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" placeholder="Password Baru" className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FFC107] outline-none" />
            </div>
            <button onClick={() => alert("Password berhasil diubah!")} className="w-full bg-[#161D6F] text-white py-4 rounded-xl font-bold hover:bg-indigo-900 transition-colors">
              Submit Password
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-[#161D6F]">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </main>
  );
}