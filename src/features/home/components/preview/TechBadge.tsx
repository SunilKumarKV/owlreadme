"use client";

import React from 'react';
import { TechBadgeProps } from '../../types/preview-content';

export const TechBadge: React.FC<TechBadgeProps> = ({ badge, className = '' }) => {
  const getVariantStyles = () => {
    switch (badge.colorVariant) {
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'indigo':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'purple':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20';
    }
  };

  return (
    <span
      title={badge.tooltip || badge.label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold select-none transition-transform hover:scale-105 ${getVariantStyles()} ${className}`}
    >
      {badge.label}
    </span>
  );
};

export default TechBadge;
