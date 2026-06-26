import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'minimal' | 'dark' | 'gradient' | 'terminal';
  templatesUsedCount: number;
  setTheme: (theme: 'minimal' | 'dark' | 'gradient' | 'terminal') => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'minimal',
      templatesUsedCount: 0,
      setTheme: (theme) =>
        set((state) => ({
          theme,
          templatesUsedCount: state.templatesUsedCount + 1,
        })),
    }),
    { name: 'theme-store' }
  )
);

export default useThemeStore;