"use client";

import { useEffect } from 'react';
import useThemeStore from '@/stores/theme-store';
import useWorkspaceStore from '@/stores/workspace-store';
import { ThemeModeProvider } from './ThemeModeContext';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Run migration and restore session on mount
    const store = useWorkspaceStore.getState();
    store.migrateLegacyData();
    const activeId = store.activeWorkspaceId;
    const list = store.workspaces;
    if (activeId) {
      store.loadWorkspace(activeId);
    } else if (list.length > 0) {
      store.loadWorkspace(list[0].id);
    }
  }, []);

  useEffect(() => {
    // Remove any existing theme classes
    document.body.classList.remove('theme-minimal', 'theme-dark', 'theme-gradient', 'theme-terminal');
    // Add the current workspace theme class
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeModeProvider>
      {children}
    </ThemeModeProvider>
  );
}

