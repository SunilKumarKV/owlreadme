"use client";

import React from 'react';
import { Container } from '@/components/ui';
import { AnnouncementBarProps } from '../../types/announcement';
import { ANNOUNCEMENT_TYPE_STYLES, DEFAULT_ANNOUNCEMENT_CONFIG } from '../../constants/announcement';
import { useAnnouncement } from '../../hooks/useAnnouncement';
import AnnouncementContent from './AnnouncementContent';
import AnnouncementCTA from './AnnouncementCTA';
import AnnouncementCloseButton from './AnnouncementCloseButton';

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

  const ctaLabel = config.ctaLabel || config.buttonText;
  const ctaHref = config.ctaHref || config.buttonLink;

  return (
    <aside
      role="region"
      aria-label="Announcement"
      className={`relative z-40 w-full border-b transition-colors duration-300 backdrop-blur-md ${styles.border} ${styles.bgLight} ${styles.bgDark} ${className}`}
    >
      <Container size="lg" className="py-2 px-4 flex items-center justify-between gap-3 min-h-[40px]">
        <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-between gap-2.5">
          <AnnouncementContent config={config} />

          {ctaLabel && ctaHref && <AnnouncementCTA label={ctaLabel} href={ctaHref} />}
        </div>

        {config.dismissible && <AnnouncementCloseButton onDismiss={handleDismiss} />}
      </Container>
    </aside>
  );
};

export default AnnouncementBar;
