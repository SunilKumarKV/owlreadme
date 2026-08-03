"use client";

import React from 'react';
import { Sparkles, Wrench, Calendar, Tag } from 'lucide-react';
import { AnnouncementContentProps } from '../../types/announcement';
import AnnouncementBadge from './AnnouncementBadge';

export const AnnouncementContent: React.FC<AnnouncementContentProps> = ({ config, className = '' }) => {
  const renderIcon = () => {
    switch (config.icon) {
      case 'sparkles':
        return <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0 animate-pulse" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-purple-500 dark:text-purple-400 shrink-0" />;
      default:
        return <Tag className="h-4 w-4 text-blue-500 dark:text-blue-400 shrink-0" />;
    }
  };

  const badgeText = config.badge || config.version || 'v1.2.0';
  const titleText = config.title;
  const headlineText = config.headline || config.subtitle;

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs text-gray-800 dark:text-gray-200 font-medium ${className}`}>
      {renderIcon()}

      {badgeText && <AnnouncementBadge text={badgeText} type={config.type} />}

      {titleText && <span className="font-bold">{titleText}</span>}

      {headlineText && (
        <>
          <span className="hidden md:inline text-gray-400 dark:text-gray-500">•</span>
          <span className="font-medium text-gray-600 dark:text-gray-300">{headlineText}</span>
        </>
      )}
    </div>
  );
};

export default AnnouncementContent;
