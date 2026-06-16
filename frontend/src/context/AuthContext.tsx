"use client";

import { createContext, useState, ReactNode } from "react";
import { authService } from "@/services/auth";
import { User } from "@/types/user";
import { getAccessToken, setAccessToken, clearTokens } from "@/lib/auth";

const USER_KEY = "asgard_user";
const REMEMBERED_EMAILS_KEY = "asgard_remembered_emails";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  logout: () => void;
  refreshUser: (updated: User) => void;
}

function saveRememberedEmail(email: string) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(REMEMBERED_EMAILS_KEY);
  const list: string[] = raw ? JSON.parse(raw) : [];
  const filtered = list.filter(e => e !== email);
  filtered.unshift(email);
  localStorage.setItem(REMEMBERED_EMAILS_KEY, JSON.stringify(filtered.slice(0, 5)));
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  const token = getAccessToken();
  if (!token) return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    clearTokens();
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);

  const login = async (email: string, password: string, remember?: boolean): Promise<User> => {
    const response = await authService.login({ email, password });
    const { access_token, user: userData } = response.data;

    setAccessToken(access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData as User);
    if (remember !== false) saveRememberedEmail(email);

    return userData as User;
  };

  const refreshUser = (updated: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    clearTokens();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
