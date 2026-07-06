import { useState, useEffect, useCallback } from 'react';

export const useNotifications = () => {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addNotification = useCallback((message: string) => {
    setNotification(message);
  }, []);

  return {
    notification,
    setNotification,
    addNotification,
  };
};
