import { useState, useEffect } from 'react';
import useReducedMotion from './useReducedMotion';

export interface UseBackgroundAnimationResult {
  isAnimated: boolean;
  prefersReducedMotion: boolean;
}

export function useBackgroundAnimation(): UseBackgroundAnimationResult {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    isAnimated: !prefersReducedMotion && isVisible,
    prefersReducedMotion,
  };
}

export default useBackgroundAnimation;
