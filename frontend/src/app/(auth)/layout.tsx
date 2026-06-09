import React from "react";

export const metadata = {
    title: "Portal Autentikasi - ASGARD",
    description: "Halaman masuk dan manajemen akun sistem ASGARD.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800 selection:bg-[#161D6F] selection:text-[#FFC107]">
            {children}
        </div>
    );
}