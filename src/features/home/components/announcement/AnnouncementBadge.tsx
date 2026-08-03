"use client";

import React from 'react';
import { AnnouncementBadgeProps } from '../../types/announcement';
import { ANNOUNCEMENT_TYPE_STYLES } from '../../constants/announcement';

export const AnnouncementBadge: React.FC<AnnouncementBadgeProps> = ({
  text,
  type = 'release',
  className = '',
}) => {
  const styles = ANNOUNCEMENT_TYPE_STYLES[type] || ANNOUNCEMENT_TYPE_STYLES.release;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles.badge} ${className}`}
    >
      {text}
    </span>
  );
};

export default AnnouncementBadge;
