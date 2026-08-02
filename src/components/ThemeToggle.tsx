"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useThemeMode, ColorMode } from './ThemeModeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { colorMode, resolvedMode, setColorMode } = useThemeMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cycle through options on click if not using dropdown, or open dropdown
  const handleToggleClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const selectMode = (mode: ColorMode) => {
    setColorMode(mode);
    setDropdownOpen(false);
  };

  const getIcon = () => {
    if (colorMode === 'system') {
      return <Laptop className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    }
    return resolvedMode === 'dark' ? (
      <Moon className="w-4 h-4 text-indigo-400" />
    ) : (
      <Sun className="w-4 h-4 text-amber-500" />
    );
  };

  const options: { mode: ColorMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
    { mode: 'system', label: 'System', icon: <Laptop className="w-4 h-4 text-blue-500" /> },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={handleToggleClick}
        aria-label="Toggle theme"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        className="inline-flex items-center justify-center gap-2 p-2 text-gray-700 dark:text-gray-200 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700/80 border border-gray-200/80 dark:border-gray-700/60 rounded-lg backdrop-blur-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 cursor-pointer shadow-xs select-none"
      >
        {getIcon()}
        {showLabel && (
          <span className="text-xs font-semibold capitalize tracking-tight">
            {colorMode}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-36 py-1.5 bg-white/95 dark:bg-gray-900/95 border border-gray-200/80 dark:border-gray-800 rounded-xl shadow-xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {options.map((option) => {
            const isSelected = colorMode === option.mode;
            return (
              <button
                key={option.mode}
                type="button"
                role="menuitem"
                onClick={() => selectMode(option.mode)}
                className={`w-full px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
