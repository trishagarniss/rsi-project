'use client';

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BottombarProps {
 currentPage: number;
 totalPages: number;
 onPageChange: (page: number) => void;
 itemsPerPage: number;
 totalItems: number;
}

export default function Bottombar({
 currentPage,
 totalPages,
 onPageChange,
 itemsPerPage,
 totalItems
}: BottombarProps) {
 const [startPage, setStartPage] = useState(1);

  useEffect(() => {
  if (currentPage === 1) {
   setStartPage(1); // eslint-disable-line react-hooks/set-state-in-effect
  } else if (currentPage < startPage) {
  const diff = startPage - currentPage;
  const steps = Math.ceil(diff / 5) * 5;
  setStartPage(Math.max(1, startPage - steps));
 } else if (currentPage > startPage + 9) {
  const diff = currentPage - (startPage + 9);
  const steps = Math.ceil(diff / 5) * 5;
  setStartPage(Math.min(totalPages - 9, startPage + steps));
 }
 }, [currentPage, totalPages, startPage]);

 const visibleEndPage = Math.min(startPage + 9, totalPages);

 const pageNumbers = [];
 for (let i = startPage; i <= visibleEndPage; i++) {
 pageNumbers.push(i);
 }

 const handleRightArrow = () => {
 if (startPage + 9 < totalPages) {
  const nextStart = startPage + 5;
  setStartPage(nextStart);
  onPageChange(nextStart);
 }
 };

 const handleLeftArrow = () => {
 if (startPage > 1) {
  const prevStart = Math.max(1, startPage - 5);
  setStartPage(prevStart);
  onPageChange(prevStart);
 }
 };

 const startItem = (currentPage - 1) * itemsPerPage + 1;
 const endItem = Math.min(currentPage * itemsPerPage, totalItems);

 const isLeftDisabled = startPage === 1;
 const isRightDisabled = startPage + 9 >= totalPages;

 return (
 <div className="px-6 py-5 border-t-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80">
  <span className="text-xs font-bold text-slate-500">
  Menampilkan {totalItems > 0 ? `${startItem}-${endItem}` : "0"} dari {totalItems} data
  </span>

  <div className="flex gap-2 items-center">
  <button
   type="button"
   onClick={handleLeftArrow}
   disabled={isLeftDisabled}
   className="p-2.5 border-2 border-slate-200 rounded-xl text-slate-500 bg-white hover:border-asgard-primary hover:text-asgard-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
   title="Geser 5 halaman ke belakang"
  >
   <ChevronLeft size={16} strokeWidth={2.5} />
  </button>

  {pageNumbers.map((page) => (
   <button
   key={page}
   type="button"
   onClick={() => onPageChange(page)}
   className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all border-2 ${
    currentPage === page
    ? "bg-asgard-primary text-white border-asgard-primary border-2 border-asgard-accent"
    : "border-slate-200 text-slate-500 bg-white hover:border-asgard-primary hover:text-asgard-primary"
   }`}
   >
   {page}
   </button>
  ))}

  <button
   type="button"
   onClick={handleRightArrow}
   disabled={isRightDisabled}
   className="p-2.5 border-2 border-slate-200 rounded-xl text-slate-500 bg-white hover:border-asgard-primary hover:text-asgard-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
   title="Geser 5 halaman ke depan"
  >
   <ChevronRight size={16} strokeWidth={2.5} />
  </button>
  </div>
 </div>
 );
}
