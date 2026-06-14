import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AOSInit from "@/components/AOSInit";

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
    <html lang="id" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <AOSInit />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}