"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services/auth";
import { User } from "@/types/user";
import { getAccessToken, setAccessToken, clearTokens } from "@/lib/auth";

const USER_KEY = "asgard_user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: (updated: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    const stored = localStorage.getItem(USER_KEY);
    
    if (token && stored) {
      try {
        setUser(JSON.parse(stored) as User); // eslint-disable-line react-hooks/set-state-in-effect
      } catch {
        clearTokens();
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await authService.login({ email, password });
    const { access_token, user: userData } = response.data;

    setAccessToken(access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData as User);

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
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
