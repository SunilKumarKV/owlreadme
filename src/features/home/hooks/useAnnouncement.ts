"use client";

import { useState, useEffect, useCallback } from 'react';
import { AnnouncementConfig } from '../types/announcement';
import { DEFAULT_ANNOUNCEMENT_CONFIG } from '../constants/announcement';

export function useAnnouncement(config: AnnouncementConfig = DEFAULT_ANNOUNCEMENT_CONFIG) {
  const [dismissed, setDismissed] = useState(false);

  // Sync with localStorage after initial mount to prevent SSR hydration mismatch
  useEffect(() => {
    if (!config.dismissible || !config.dismissKey) return;
    try {
      const isDismissed = localStorage.getItem(config.dismissKey) === 'true';
      if (isDismissed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDismissed(true);
      }
    } catch {
      // Ignore localStorage read error
    }
  }, [config.dismissible, config.dismissKey]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    if (config.dismissible && config.dismissKey) {
      try {
        localStorage.setItem(config.dismissKey, 'true');
      } catch {
        // Ignore storage write error
      }
    }
  }, [config.dismissible, config.dismissKey]);

  const isVisible = config.visible && !dismissed;

  return {
    isVisible,
    dismiss,
    config,
  };
}

export default useAnnouncement;
