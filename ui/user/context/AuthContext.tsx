'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/types';
import { authApi } from '@/lib/api';

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
  'employer@demo.com': {
    id: 'u1',
    email: 'employer@demo.com',
    name: 'Sarah Chen',
    role: 'employer',
    company: 'TechCorp Inc.',
    onboarding_completed: false,
    createdAt: new Date().toISOString()
  },
  'career@demo.com': {
    id: 'u2',
    email: 'career@demo.com',
    name: 'James Okonkwo',
    role: 'career',
    jobTitle: 'Software Engineer',
    onboarding_completed: false,
    createdAt: new Date().toISOString()
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('CareAble_token');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await authApi.me();
        setToken(storedToken);
        setUser(user?.user);
      } catch (err) {
        // token invalid or expired
        localStorage.removeItem('CareAble_token');
        localStorage.removeItem('CareAble_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback((token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('CareAble_token', token);
    localStorage.setItem('CareAble_user', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('CareAble_token');
    localStorage.removeItem('CareAble_user');
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('CareAble_user', JSON.stringify(updated));
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
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { MOCK_USERS };
