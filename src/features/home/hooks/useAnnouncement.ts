"use client";

import { useState, useCallback } from 'react';
import { AnnouncementConfig } from '../types/announcement';
import { DEFAULT_ANNOUNCEMENT_CONFIG } from '../constants/announcement';

export function useAnnouncement(config: AnnouncementConfig = DEFAULT_ANNOUNCEMENT_CONFIG) {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (!config.visible) return false;

    if (typeof window !== 'undefined' && config.dismissible && config.dismissKey) {
      try {
        const isDismissed = localStorage.getItem(config.dismissKey) === 'true';
        if (isDismissed) return false;
      } catch {
        // Ignore localStorage read error
      }
    }
    return true;
  });

  const dismiss = useCallback(() => {
    setIsVisible(false);
    if (config.dismissible && config.dismissKey) {
      try {
        localStorage.setItem(config.dismissKey, 'true');
      } catch {
        // Ignore localStorage write error
      }
    }
  }, [config.dismissible, config.dismissKey]);

  return {
    isVisible,
    dismiss,
    config,
  };
}

export default useAnnouncement;
