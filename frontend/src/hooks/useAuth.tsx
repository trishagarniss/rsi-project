"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, LoginResponse } from "@/types/user";
import { get, post } from "@/lib/api-client";
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  setStoredUser,
  getStoredUser,
  clearStoredUser,
  getAccessToken,
  getRefreshToken,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      setIsLoading(false);
      return;
    }

    try {
      setUser(storedUser as User);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUser();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = (await post("/auth/login", { email, password })) as LoginResponse;
      setAccessToken(res.data.access_token);
      setRefreshToken(res.data.refresh_token);
      setUser(res.data.user);
      setStoredUser(res.data.user);

      if (res.data.user.role === "superadmin") {
        router.push("/superadmin/superadmin");
      } else {
        router.push("/dashboard/dashboard");
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await post("/auth/logout", { refresh_token: refresh });
      } catch {
        // ignore
      }
    }
    clearTokens();
    clearStoredUser();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
