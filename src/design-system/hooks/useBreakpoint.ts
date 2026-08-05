import { useState, useEffect } from 'react';
import { breakpointValues, BreakpointKey } from '../breakpoints';

export function useBreakpoint() {
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1280;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < breakpointValues.md;
  const isTablet = windowWidth >= breakpointValues.md && windowWidth < breakpointValues.lg;
  const isDesktop = windowWidth >= breakpointValues.lg;
  const isUltraWide = windowWidth >= breakpointValues['3xl'];

  const isAtLeast = (key: BreakpointKey) => windowWidth >= breakpointValues[key];
  const isAtMost = (key: BreakpointKey) => windowWidth <= breakpointValues[key];

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    isUltraWide,
    isAtLeast,
    isAtMost,
  };
}

export default useBreakpoint;
