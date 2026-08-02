"use client";

import { useEffect, useState } from 'react';

export function useScrollReveal() {
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => setReduceMotion(mediaQuery.matches);
    mediaQuery.addEventListener?.('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px'
      }
    );

    const elements = document.querySelectorAll<HTMLElement>('[data-reveal="true"], .reveal-item');
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [reduceMotion]);

  return { reduceMotion };
}

export default useScrollReveal;
