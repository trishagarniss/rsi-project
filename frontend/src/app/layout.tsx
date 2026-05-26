import type { Metadata } from "next";
import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}