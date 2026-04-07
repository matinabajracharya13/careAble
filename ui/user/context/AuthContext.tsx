"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── Mock user for demo purposes ───────────────────────────────────────────────
const MOCK_USERS: Record<string, User> = {
  "employer@demo.com": {
    id: "u1",
    email: "employer@demo.com",
    name: "Sarah Chen",
    role: "employer",
    company: "TechCorp Inc.",
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
  },
  "career@demo.com": {
    id: "u2",
    email: "career@demo.com",
    name: "James Okonkwo",
    role: "career",
    jobTitle: "Software Engineer",
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("skillbridge_token");
    const storedUser = localStorage.getItem("skillbridge_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("skillbridge_token", token);
    localStorage.setItem("skillbridge_user", JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("skillbridge_token");
    localStorage.removeItem("skillbridge_user");
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem("skillbridge_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { MOCK_USERS };
