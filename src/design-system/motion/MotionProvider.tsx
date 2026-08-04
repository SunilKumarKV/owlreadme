import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { MotionContextValue } from '../types/motion';

const MotionContext = createContext<MotionContextValue>({
  reducedMotion: false,
  defaultDuration: 0.3,
});

export interface MotionProviderProps {
  reducedMotion?: boolean;
  defaultDuration?: number;
  children: ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({
  reducedMotion: overrideReducedMotion,
  defaultDuration = 0.3,
  children,
}) => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof overrideReducedMotion === 'boolean') return overrideReducedMotion;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof overrideReducedMotion === 'boolean') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [overrideReducedMotion]);

  return (
    <MotionContext.Provider value={{ reducedMotion, defaultDuration }}>
      {children}
    </MotionContext.Provider>
  );
};

export function useMotionContext(): MotionContextValue {
  return useContext(MotionContext);
}

export default MotionProvider;
