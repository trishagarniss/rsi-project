// src/hooks/useAuth.tsx
"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Hook kustom untuk mengakses AuthContext di seluruh komponen aplikasi.
 * Penggunaan: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
  }

  return context;
};