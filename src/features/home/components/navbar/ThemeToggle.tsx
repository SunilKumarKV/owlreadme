"use client";

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeMode } from '@/components/ThemeModeContext';
import { ThemeToggleProps } from '../../types/navigation';

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { colorMode, resolvedMode, setColorMode } = useThemeMode();

  const cycleMode = () => {
    if (colorMode === 'system') {
      setColorMode('light');
    } else if (colorMode === 'light') {
      setColorMode('dark');
    } else {
      setColorMode('system');
    }
  };

  const renderIcon = () => {
    if (colorMode === 'system') {
      return <Monitor className="h-4 w-4 text-purple-500" />;
    }
    if (resolvedMode === 'dark') {
      return <Moon className="h-4 w-4 text-indigo-400" />;
    }
    return <Sun className="h-4 w-4 text-amber-500" />;
  };

  const getTooltip = () => {
    if (colorMode === 'system') return 'Theme: System';
    if (colorMode === 'light') return 'Theme: Light';
    return 'Theme: Dark';
  };

  return (
    <button
      type="button"
      onClick={cycleMode}
      aria-label="Toggle theme"
      title={getTooltip()}
      className={`p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${className}`}
    >
      {renderIcon()}
    </button>
  );
};

export default ThemeToggle;
