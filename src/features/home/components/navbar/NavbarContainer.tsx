"use client";

import React from 'react';
import { Container } from '@/components/ui';

interface NavbarContainerProps {
  scrolled: boolean;
  children: React.ReactNode;
  className?: string;
}

export const NavbarContainer: React.FC<NavbarContainerProps> = ({
  scrolled,
  children,
  className = '',
}) => {
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav shadow-lg shadow-blue-500/5 dark:shadow-black/40 py-3'
          : 'bg-transparent py-5'
      } ${className}`}
    >
      <Container size="lg" className="flex items-center justify-between">
        {children}
      </Container>
    </header>
  );
};

export default NavbarContainer;
