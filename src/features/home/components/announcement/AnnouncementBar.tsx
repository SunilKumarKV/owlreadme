"use client";

import React from 'react';
import { X } from 'lucide-react';
import { Container } from '@/components/ui';
import { AnnouncementBarProps } from '../../types/announcement';
import { ANNOUNCEMENT_TYPE_STYLES, DEFAULT_ANNOUNCEMENT_CONFIG } from '../../constants/announcement';
import { useAnnouncement } from '../../hooks/useAnnouncement';
import AnnouncementContent from './AnnouncementContent';
import AnnouncementLink from './AnnouncementLink';

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  config = DEFAULT_ANNOUNCEMENT_CONFIG,
  className = '',
  onDismiss,
}) => {
  const { isVisible, dismiss } = useAnnouncement(config);

  if (!isVisible) return null;

  const styles = ANNOUNCEMENT_TYPE_STYLES[config.type] || ANNOUNCEMENT_TYPE_STYLES.release;

  const handleDismiss = () => {
    dismiss();
    onDismiss?.();
  };

  return (
    <aside
      role="region"
      aria-label="Announcement"
      className={`relative z-40 w-full border-b transition-colors duration-300 backdrop-blur-md ${styles.border} ${styles.bgLight} ${styles.bgDark} ${className}`}
    >
      <Container size="lg" className="py-2 px-4 flex items-center justify-between gap-3 min-h-[40px]">
        <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-between gap-2.5">
          <AnnouncementContent config={config} />

          {config.buttonText && config.buttonLink && (
            <AnnouncementLink text={config.buttonText} href={config.buttonLink} />
          )}
        </div>

        {config.dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </Container>
    </aside>
  );
};

export default AnnouncementBar;
