"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ColorMode = 'light' | 'dark' | 'system';

interface ThemeModeContextType {
  colorMode: ColorMode;
  resolvedMode: 'light' | 'dark';
  setColorMode: (mode: ColorMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

const COLOR_MODE_KEY = 'owlreadme-color-mode';

const getInitialColorMode = (): ColorMode => {
  if (typeof window === 'undefined') return 'system';
  try {
    const savedMode = localStorage.getItem(COLOR_MODE_KEY) as ColorMode | null;
    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
      return savedMode;
    }
  } catch {
    // Ignore storage errors in restricted browser contexts
  }
  return 'system';
};

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorModeState] = useState<ColorMode>(getInitialColorMode);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedMode = () => {
      let isDark = false;
      if (colorMode === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = colorMode === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        setResolvedMode('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        setResolvedMode('light');
      }
    };

    updateResolvedMode();

    const handleSystemChange = () => {
      if (colorMode === 'system') {
        updateResolvedMode();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [colorMode]);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    try {
      localStorage.setItem(COLOR_MODE_KEY, mode);
    } catch {
      // Ignore localStorage write failures
    }
  };

  return (
    <ThemeModeContext.Provider value={{ colorMode, resolvedMode, setColorMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    return {
      colorMode: 'system' as ColorMode,
      resolvedMode: 'dark' as 'light' | 'dark',
      setColorMode: () => {},
    };
  }
  return context;
}

export default ThemeModeProvider;
