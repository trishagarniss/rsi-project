'use client'; // Kita butuh use client karena ada interaksi tombol upload

import React, { useRef, useState } from 'react';
import Button from '@/components/ui/Button';

export default function DataImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fungsi tiruan untuk memicu klik pada input file tersembunyi
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-black text-asgard-primary">Pengelolaan Data Siswa</h1>
        <p className="text-slate-500 font-medium mt-1">Unggah berkas .csv atau .xlsx untuk memperbarui basis data siswa</p>
      </div>

      {/* ================= BARIS FILTER & SEARCH (Sesuai Mockup) ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-asgard-primary focus-within:ring-2 focus-within:ring-asgard-primary/20 transition-all">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Cari nama siswa..." 
              className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 placeholder-slate-400" 
            />
        </div>
        
        {/* Dropdowns & Action Button */}
        <div className="flex gap-3 w-full md:w-auto">
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm">
                <option>Filter Kelas</option>
            </select>
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm">
                <option>Filter Status</option>
            </select>
            <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-asgard-primary cursor-pointer shadow-sm">
                <option>Filter Risiko</option>
            </select>
            <Button variant="secondary" onClick={handleUploadClick} className="whitespace-nowrap">
                Upload .csv
            </Button>
        </div>
      </div>

      {/* ================= AREA UPLOAD / EMPTY STATE ================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Header Tabel Tiruan */}
        <div className="h-12 bg-slate-100/50 border-b border-slate-100 w-full" />

        {/* Drag & Drop Zone */}
        <div 
          className={`flex-1 flex flex-col items-center justify-center p-10 transition-colors duration-300 ${
            isDragging ? 'bg-asgard-secondary/10' : 'bg-transparent'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* Logika file drop nanti di sini */ }}
        >
          <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 flex items-center justify-center border-4 border-slate-100 shadow-sm">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h2 className="text-4xl font-black text-slate-300 tracking-tight mb-2">
            No data to be previewed
          </h2>
          <p className="text-slate-400 font-medium text-sm text-center max-w-md">
            Tarik dan lepas (drag & drop) berkas CSV/Excel Anda ke area ini, atau klik tombol Upload di pojok kanan atas. Maksimal ukuran file 10 MB.
          </p>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
          />
        </div>

        {/* Pagination Tiruan (Sesuai Mockup) */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-center bg-slate-50/30">
            <div className="flex items-center gap-1 opacity-50 pointer-events-none">
                <button className="px-3 py-1.5 rounded-lg text-slate-400 font-bold">«</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-asgard-primary text-white font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 font-bold">2</button>
                <span className="px-1 text-slate-400 font-black">...</span>
                <button className="px-3 py-1.5 rounded-lg text-slate-600 font-bold">»</button>
            </div>
        </div>

      </div>

    </div>
  );
}