"use client";

import React, { useState, useRef, useEffect } from "react";
import { Brain, Upload, FileText, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { predictionService, type PredictionRecord } from "@/services/prediction";
import Button from "@/components/ui/Button";

export default function PredictionPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPredictions();
  }, []);

  async function loadPredictions() {
    try {
      setIsLoading(true);
      setError(null);
      const res = await predictionService.getAll();
      setPredictions(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data prediksi");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await predictionService.uploadCSV(formData);
      setSuccess(res.message);
      setFile(null);
      await loadPredictions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah file");
    } finally {
      setIsUploading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl">
          <Brain size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-asgard-primary">Prediksi Risiko</h1>
          <p className="text-slate-500 text-sm font-medium">Upload data siswa dan dapatkan prediksi risiko putus sekolah.</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl text-sm font-bold">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm font-bold">
          <XCircle size={18} />
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-black text-asgard-primary mb-2">Upload CSV</h2>
        <p className="text-sm font-medium text-slate-500 mb-4">Unggah file CSV berisi data siswa, akademik, absensi, dan sosial ekonomi untuk diprediksi otomatis.</p>

        <div
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
            isDragging ? "border-asgard-primary bg-asgard-primary/5" : "border-slate-200 hover:border-slate-300"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? (
            <>
              <FileText size={40} className="text-asgard-primary mb-3" />
              <p className="text-sm font-bold text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </>
          ) : (
            <>
              <Upload size={40} className="text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-500">Tarik & lepas file CSV di sini</p>
              <p className="text-xs text-slate-400 mt-1">atau klik untuk memilih file</p>
            </>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>

        {file && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <><Loader2 size={16} className="animate-spin mr-2" />Memproses...</>
              ) : "Upload & Prediksi"}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-asgard-primary">Hasil Prediksi</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Riwayat prediksi risiko putus sekolah</p>
          </div>
          <span className="text-sm font-bold text-slate-500">{predictions.length} siswa</span>
        </div>

        {isLoading ? (
          <div className="p-10 flex items-center justify-center text-slate-400">
            <Loader2 size={24} className="animate-spin mr-2" /> Memuat data...
          </div>
        ) : predictions.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <Brain size={48} className="text-slate-200 mb-3" />
            <p className="text-sm font-bold text-slate-400">Belum ada data prediksi</p>
            <p className="text-xs text-slate-300 mt-1">Upload CSV untuk memulai prediksi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-bold">Nama Siswa</th>
                  <th className="px-4 py-3 font-bold">NISN</th>
                  <th className="px-4 py-3 font-bold">Skor Risiko</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Tanggal Prediksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {predictions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-bold text-slate-700">
                      {p.student?.name ?? <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p.student?.nisn ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold">{(p.risk_score * 100).toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.risk_status === 1 ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                          <AlertTriangle size={12} />Berisiko
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                          <CheckCircle size={12} />Aman
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
