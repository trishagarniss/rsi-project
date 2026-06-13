import type { Metadata } from "next";
import "./globals.css";


// KITA NONAKTIFKAN SEMENTARA KARENA FILE DEPENDENSINYA BELUM ADA
// import { AuthProvider } from "@/hooks/useAuth"; 

export const metadata: Metadata = {
  title: "A.S.G.A.R.D",
  description: "Analisis Sistem Gejala Awal Risiko Dropout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {/* KITA LANGSUNG MERENDER CHILDREN TANPA AUTH PROVIDER DULU */}
        {children}
      </body>
    </html>
  );
}