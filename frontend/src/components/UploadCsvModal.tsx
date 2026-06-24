"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface UploadCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  expectedColumns: string[];
  requiredColumns: string[];
  onUpload: (rows: Record<string, string>[]) => Promise<void>;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx]; });
      rows.push(row);
    }
  }
  return rows;
}

export default function UploadCsvModal({
  isOpen, onClose, title, description, expectedColumns, requiredColumns, onUpload,
}: UploadCsvModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setParseError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length === 0) {
        setParseError("CSV kosong atau format tidak dikenali.");
        setPreview([]);
        return;
      }
      const missing = requiredColumns.filter((c) => !Object.keys(rows[0]).includes(c));
      if (missing.length > 0) {
        setParseError(`Kolom wajib tidak ditemukan: ${missing.join(", ")}`);
        setPreview([]);
        return;
      }
      setPreview(rows);
    };
    reader.readAsText(f);
  };

  const handleSubmit = async () => {
    if (preview.length === 0) return;
    setUploading(true);
    setResult(null);
    try {
      await onUpload(preview);
      setResult({ success: preview.length, failed: 0, errors: [] });
    } catch (e) {
      setResult({ success: 0, failed: preview.length, errors: [e instanceof Error ? e.message : "Gagal upload"] });
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview([]);
    setResult(null);
    setParseError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-800">{title}</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{description}</p>
          </div>
          <button onClick={() => { reset(); onClose(); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Expected columns */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-black text-slate-500 uppercase mb-2">Kolom yang diharapkan</p>
            <div className="flex flex-wrap gap-1.5">
              {expectedColumns.map((col) => (
                <span key={col} className={`text-[11px] font-bold px-2 py-1 rounded-md ${requiredColumns.includes(col) ? "bg-asgard-primary/10 text-asgard-primary border border-asgard-primary/20" : "bg-slate-200 text-slate-500"}`}>
                  {col}{requiredColumns.includes(col) ? " *" : ""}
                </span>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          {!file && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-asgard-primary hover:bg-asgard-primary/5 transition-colors">
              <Upload size={32} className="text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-500">Klik untuk pilih file CSV</p>
              <p className="text-xs text-slate-400 mt-1">atau drag & drop</p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
          )}

          {/* File selected */}
          {file && !preview.length && !parseError && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Loader2 size={20} className="animate-spin text-asgard-primary" />
              <p className="text-sm font-bold text-slate-500">Memproses {file.name}...</p>
            </div>
          )}

          {/* Parse error */}
          {parseError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">Gagal memproses CSV</p>
                <p className="text-xs font-medium text-red-600 mt-1">{parseError}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <p className="text-xs font-black text-slate-500 uppercase mb-2">Pratinjau ({preview.length} baris)</p>
              <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-60">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-500 uppercase">
                    <tr>
                      {Object.keys(preview[0]).map((h) => (
                        <th key={h} className="px-3 py-2 font-bold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {preview.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        {Object.values(row).map((v, i) => (
                          <td key={i} className="px-3 py-2 text-slate-600 font-medium truncate max-w-[150px]">{v}</td>
                        ))}
                      </tr>
                    ))}
                    {preview.length > 5 && (
                      <tr>
                        <td colSpan={Object.keys(preview[0]).length} className="px-3 py-2 text-center text-slate-400 font-bold">
                          ... dan {preview.length - 5} baris lainnya
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${result.failed === 0 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
              {result.failed === 0 ? <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" /> : <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />}
              <div>
                <p className="text-sm font-bold text-slate-700">{result.success} data berhasil diimport</p>
                {result.failed > 0 && <p className="text-xs font-medium text-amber-600 mt-1">{result.failed} gagal</p>}
                {result.errors.length > 0 && result.errors.map((e, i) => <p key={i} className="text-xs text-red-500 mt-0.5">{e}</p>)}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {file && (
              <button onClick={reset} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">
                Pilih file lain
              </button>
            )}
            {preview.length > 0 && !result && (
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="px-6 py-2.5 bg-asgard-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {uploading && <Loader2 size={14} className="animate-spin" />}
                {uploading ? "Mengupload..." : `Import ${preview.length} Data`}
              </button>
            )}
            {result && (
              <button onClick={() => { reset(); onClose(); }} className="px-6 py-2.5 bg-asgard-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">
                Selesai
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
