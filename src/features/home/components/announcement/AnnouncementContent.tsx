"use client";

import React from 'react';
import { Sparkles, Wrench, Calendar } from 'lucide-react';
import { AnnouncementContentProps } from '../../types/announcement';
import { ANNOUNCEMENT_TYPE_STYLES } from '../../constants/announcement';

export const AnnouncementContent: React.FC<AnnouncementContentProps> = ({
  config,
  className = '',
}) => {
  const styles = ANNOUNCEMENT_TYPE_STYLES[config.type] || ANNOUNCEMENT_TYPE_STYLES.release;

  const renderIcon = () => {
    switch (config.type) {
      case 'feature':
        return <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
      case 'maintenance':
        return <Wrench className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
      case 'event':
        return <Calendar className="h-3.5 w-3.5 text-purple-500 shrink-0" />;
      case 'release':
      default:
        return <Sparkles className="h-3.5 w-3.5 text-blue-500 shrink-0 animate-pulse" />;
    }
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 text-xs text-gray-900 dark:text-white ${className}`}>
      {renderIcon()}

      {config.badge && (
        <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-xs ${styles.badge}`}>
          {config.badge}
        </span>
      )}

      <span className="font-bold tracking-tight">
        {config.title}
      </span>

      {config.subtitle && (
        <span className="hidden md:inline text-gray-600 dark:text-gray-300 font-normal">
          — {config.subtitle}
        </span>
      )}
    </div>
  );
};

export default AnnouncementContent;
