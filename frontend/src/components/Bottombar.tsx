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

  // Synchronize startPage window if currentPage goes out of bounds or resets
  useEffect(() => {
    if (currentPage === 1) {
      setStartPage(1);
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

  // Determine end page for visible range (cap at startPage + 9 and totalPages)
  const visibleEndPage = Math.min(startPage + 9, totalPages);

  // Generate page numbers to display
  const pageNumbers = [];
  for (let i = startPage; i <= visibleEndPage; i++) {
    pageNumbers.push(i);
  }

  // Handle shift visible range forward by 5 pages
  const handleRightArrow = () => {
    if (startPage + 9 < totalPages) {
      const nextStart = startPage + 5;
      setStartPage(nextStart);
      onPageChange(nextStart);
    }
  };

  // Handle shift visible range backward by 5 pages
  const handleLeftArrow = () => {
    if (startPage > 1) {
      const prevStart = Math.max(1, startPage - 5);
      setStartPage(prevStart);
      onPageChange(prevStart);
    }
  };

  // Calculate items range info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Left arrow button can only be clicked if the user clicked the right arrow previously (startPage > 1)
  const isLeftDisabled = startPage === 1;

  // Right arrow button is disabled if there are no more pages to slide to
  const isRightDisabled = startPage + 9 >= totalPages;

  return (
    <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
      <span className="text-xs font-bold text-slate-400">
        Menampilkan {totalItems > 0 ? `${startItem}-${endItem}` : "0"} dari {totalItems} data
      </span>

      <div className="flex gap-2 items-center">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handleLeftArrow}
          disabled={isLeftDisabled}
          className="p-2.5 border border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          title="Geser 5 halaman ke belakang"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        {/* Page Number Buttons */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all ${
              currentPage === page
                ? "bg-asgard-primary text-white shadow-[0_4px_12px_rgba(22,29,111,0.2)]"
                : "border border-slate-200 text-slate-500 bg-white hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleRightArrow}
          disabled={isRightDisabled}
          className="p-2.5 border border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          title="Geser 5 halaman ke depan"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
