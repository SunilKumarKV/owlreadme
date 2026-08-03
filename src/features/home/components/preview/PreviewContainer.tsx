"use client";

import React from 'react';
import { PreviewContainerProps } from '../../types/preview';

export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-[#0d1117]/80 backdrop-blur-xl shadow-2xl shadow-blue-500/5 dark:shadow-black/60 overflow-hidden transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default PreviewContainer;
