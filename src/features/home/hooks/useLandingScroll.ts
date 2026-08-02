"use client";

import { useEffect, useState } from 'react';

export function useLandingScroll(initialSection = '') {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionIds = ['features', 'how-it-works', 'preview-showcase', 'faq'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return { scrolled, activeSection, setActiveSection };
}

export default useLandingScroll;
