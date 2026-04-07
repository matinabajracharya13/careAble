'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ColorTheme, ThemeConfig } from '@/types';
import { THEME_KEY } from '@/constants/app';

export const COLOR_THEMES: ThemeConfig[] = [
  { name: 'Cobalt', value: 'cobalt', primaryColor: '#1d5dd0', description: 'Classic blue – professional & trustworthy' }
];

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  themes: ThemeConfig[];
  currentTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeConfigProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('cobalt');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as ColorTheme | null;
    if (stored && COLOR_THEMES.find((t) => t.value === stored)) {
      setColorThemeState(stored);
    }
  }, []);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  const currentTheme = COLOR_THEMES.find((t) => t.value === colorTheme) ?? COLOR_THEMES[0];

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, themes: COLOR_THEMES, currentTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useColorTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useColorTheme must be used within ThemeConfigProvider');
  return ctx;
}
