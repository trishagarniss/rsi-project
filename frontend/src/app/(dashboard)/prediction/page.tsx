"use client";

import { Brain } from "lucide-react";

export default function PredictionPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl">
          <Brain size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-asgard-primary">Prediksi Risiko</h1>
          <p className="text-slate-500 text-sm font-medium">Kelola prediksi risiko putus sekolah siswa.</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border-2 border-slate-200 p-12 flex flex-col items-center justify-center text-center">
        <Brain size={48} className="text-slate-300 mb-4" />
        <h2 className="text-lg font-extrabold text-slate-700 mb-2">Halaman Prediksi Risiko</h2>
        <p className="text-sm text-slate-400 max-w-md">
          Halaman ini akan menampilkan fitur upload CSV (data siswa, akademik, absensi, sosial ekonomi),
          auto-prediksi saat fitur lengkap, dan hasil prediksi siswa berisiko.
        </p>
      </div>
    </div>
  );
}
