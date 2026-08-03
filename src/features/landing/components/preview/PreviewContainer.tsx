"use client";

import React from 'react';
import { PreviewContainerProps } from '../../types/preview';
import { getGlassStyle, getBorderStyle, getShadowStyle } from '../../utils/visual';

export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  children,
  variant = 'glow',
  className = '',
}) => {
  const borderStyle = getBorderStyle(variant === 'gradient' ? 'gradient' : variant === 'thin' ? 'thin' : 'glow');
  const shadowStyle = getShadowStyle('glow');
  const glassStyle = getGlassStyle('card');

  return (
    <div
      className={`group relative w-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 ${glassStyle} ${borderStyle} ${shadowStyle} ${className}`}
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
