import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-asgard-secondary/50 transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
        {icon && (
          <div className="p-2 bg-asgard-pale text-asgard-primary rounded-lg">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <p className="text-4xl font-black text-asgard-primary">{value}</p>

        {subtitle && (
          <p className={`text-xs font-semibold mt-2 ${
            trend === "up" ? "text-red-500" : trend === "down" ? "text-green-500" : "text-slate-400"
          }`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}