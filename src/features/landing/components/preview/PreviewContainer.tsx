"use client";

import React from 'react';
import { PreviewContainerProps } from '../../types/preview';

export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  children,
  variant = 'glow',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'thin':
        return 'border border-gray-200/60 dark:border-gray-800/60 shadow-lg';
      case 'gradient':
        return 'border border-gray-300/80 dark:border-gray-700/80 shadow-xl';
      case 'glow':
      default:
        return 'border border-gray-200/80 dark:border-gray-800/80 shadow-2xl shadow-blue-500/10 dark:shadow-indigo-500/20 hover:shadow-blue-500/20 dark:hover:shadow-indigo-500/30';
    }
  };

  return (
    <div
      className={`group relative w-full rounded-2xl bg-white/70 dark:bg-[#0d1117]/80 backdrop-blur-2xl ring-1 ring-white/30 dark:ring-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-1 ${getVariantStyles()} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent"
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export default PreviewContainer;
