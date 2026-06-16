import React from "react";

type RiskLevel = "Tinggi" | "Sedang" | "Rendah" | "Aman";

interface RiskBadgeProps {
  level: RiskLevel;
}

function getBadgeStyle(risk: RiskLevel): string {
  switch (risk) {
    case "Tinggi":
      return "bg-red-100 text-red-700 border-red-200";
    case "Sedang":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Rendah":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Aman":
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getBadgeStyle(level)}`}>
      {level}
    </span>
  );
}