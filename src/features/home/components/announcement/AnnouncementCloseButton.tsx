"use client";

import React from 'react';
import { X } from 'lucide-react';
import { AnnouncementCloseButtonProps } from '../../types/announcement';

export const AnnouncementCloseButton: React.FC<AnnouncementCloseButtonProps> = ({
  onDismiss,
  ariaLabel = 'Dismiss announcement',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label={ariaLabel}
      className={`p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer shrink-0 ${className}`}
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
};

export default AnnouncementCloseButton;
