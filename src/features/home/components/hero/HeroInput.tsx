"use client";

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { GitHubIcon } from '@/components/Icons';
import { HeroInputProps } from '../../types/hero';

export const HeroInput: React.FC<HeroInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Enter your GitHub username',
  ariaLabel = 'GitHub Username',
  isLoading = false,
  error = null,
  disabled = false,
  className = '',
  id = 'hero-github-username-input',
}) => {
  return (
    <div className={`relative flex-1 ${className}`}>
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-gray-400 dark:text-gray-500 pointer-events-none">
          <GitHubIcon className="h-4 w-4" />
        </div>

        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={Boolean(error)}
          disabled={disabled || isLoading}
          autoComplete="username"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={`w-full min-h-[48px] h-12 pl-10 pr-11 text-sm font-medium rounded-xl bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 shadow-xs ${
            error
              ? 'border-red-500 dark:border-red-500 focus-visible:ring-red-500'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        <div className="absolute right-1 flex items-center gap-1">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}

          {!isLoading && value && onClear && (
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              aria-label="Clear username input"
              className="min-h-[44px] min-w-[44px] p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs font-semibold text-red-500 dark:text-red-400 pl-1">{error}</p>}
    </div>
  );
};

export default HeroInput;
