import React from 'react';
import { TechBadgeProps } from '../../types/preview-content';

export const TechBadge: React.FC<TechBadgeProps> = ({
  badge,
  className = '',
}) => {
  const getBadgeColorClass = () => {
    switch (badge.colorVariant) {
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40';
      case 'indigo':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40';
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40';
      case 'gray':
      default:
        return 'bg-gray-100 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700/60';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border shadow-2xs transition-all duration-200 hover:scale-105 ${getBadgeColorClass()} ${className}`}
    >
      {badge.label}
    </span>
  );
};

export default TechBadge;
