import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ColorTheme, Mode } from "@/types";

interface ThemeState {
  mode: Mode;
  colorTheme: ColorTheme;
  sidebarCollapsed: boolean;

  setMode: (mode: Mode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

function applyTheme(mode: Mode, colorTheme: ColorTheme) {
  const root = document.documentElement;
  const isDark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);
  root.setAttribute("data-theme", colorTheme);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      colorTheme: "indigo",
      sidebarCollapsed: false,

      setMode: (mode) => {
        set({ mode });
        applyTheme(mode, get().colorTheme);
      },

      setColorTheme: (colorTheme) => {
        set({ colorTheme });
        applyTheme(get().mode, colorTheme);
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    {
      name: "admin-theme",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.mode, state.colorTheme);
      },
    }
  )
);
