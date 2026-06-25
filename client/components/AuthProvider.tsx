"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import {
  getMe,
  login as apiLogin,
  register as apiRegister,
  setAuthToken,
} from "@/lib/api";
import type { AuthResponse, AuthUser } from "@/lib/types";

const TOKEN_KEY = "helpdesk_token";

interface AuthContextValue {
  user: AuthUser | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setInitializing(false);
      return;
    }
    setAuthToken(token);
    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  const apply = useCallback((response: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    setAuthToken(response.accessToken);
    setUser(response.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      apply(await apiLogin(email, password));
    },
    [apply],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      apply(await apiRegister(email, password));
    },
    [apply],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
