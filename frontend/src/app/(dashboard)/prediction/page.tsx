"use client";

import React, { useState, useRef } from "react";
import { Brain, Upload, FileText, Loader2, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight, History } from "lucide-react";
import { predictionService, type PredictionRecord } from "@/services/prediction";
import Button from "@/components/ui/Button";

const PAGE_SIZE = 10;

export default function PredictionPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<PredictionRecord[] | null>(null);
  const [allHistory, setAllHistory] = useState<PredictionRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const displayData = showHistory ? allHistory : (uploadResults ?? []);
  const totalPages = Math.max(Math.ceil(displayData.length / PAGE_SIZE), 1);
  const paginated = displayData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstIdx = displayData.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2),
  );

  async function loadAllHistory() {
    try {
      setIsLoadingHistory(true);
      setError(null);
      const res = await predictionService.getAll();
      setAllHistory(res.data);
      setShowHistory(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat riwayat prediksi");
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadResults(null);
    setShowHistory(false);
    setCurrentPage(1);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await predictionService.uploadCSV(formData);
      setSuccess(res.message);
      setFile(null);
      if (res.data && res.data.length > 0) {
        setUploadResults(res.data);
      } else {
        setUploadResults([]);
      }
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
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              {showHistory ? "Riwayat seluruh prediksi" : "Hasil upload terakhir"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {showHistory ? (
              <button
                onClick={() => { setShowHistory(false); setCurrentPage(1); }}
                className="text-xs font-bold text-asgard-primary hover:underline flex items-center gap-1"
              >
                &larr; Kembali ke hasil upload
              </button>
            ) : (
              uploadResults !== null && (
                <button
                  onClick={() => { loadAllHistory(); setCurrentPage(1); }}
                  className="text-xs font-bold text-asgard-primary hover:underline flex items-center gap-1"
                >
                  <History size={14} /> Lihat Semua Riwayat
                </button>
              )
            )}
            <span className="text-sm font-bold text-slate-500">{displayData.length} siswa</span>
          </div>
        </div>

        {isLoadingHistory ? (
          <div className="p-10 flex items-center justify-center text-slate-400">
            <Loader2 size={24} className="animate-spin mr-2" /> Memuat riwayat...
          </div>
        ) : displayData.length === 0 ? (
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
                {paginated.map((p) => (
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

        {displayData.length > PAGE_SIZE && !isLoadingHistory && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100">
            <span className="text-sm font-bold text-slate-500">
              Menampilkan {firstIdx}-{Math.min(currentPage * PAGE_SIZE, displayData.length)} dari {displayData.length} siswa
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              {pageNums.map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors text-sm ${p === currentPage ? "bg-asgard-primary text-white shadow-md" : "text-slate-600 hover:text-asgard-primary hover:bg-slate-100"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-asgard-primary hover:bg-slate-100 font-bold transition-colors disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
