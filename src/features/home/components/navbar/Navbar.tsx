"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui';
import { NavbarProps } from '../../types/navigation';
import { NAV_ITEMS } from '../../constants/navigation';
import { useNavbarScroll } from '../../hooks/useNavbarScroll';
import { useNavbar } from '../../hooks/useNavbar';

import NavbarLogo from './NavbarLogo';
import NavbarLinks from './NavbarLinks';
import NavbarActions from './NavbarActions';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const { scrolled } = useNavbarScroll(15);
  const { isOpen, toggle, close } = useNavbar();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav shadow-lg shadow-blue-500/5 dark:shadow-black/40 py-3 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80'
          : 'bg-transparent py-4 border-b border-transparent'
      } ${className}`}
    >
      <Container size="lg" className="px-4">
        <div className="flex items-center justify-between">
          <NavbarLogo />
          <NavbarLinks items={NAV_ITEMS} currentPath={pathname || ''} />
          <NavbarActions />
          <MobileMenuButton isOpen={isOpen} onClick={toggle} />
        </div>
      </Container>

      <MobileMenu isOpen={isOpen} onClose={close} items={NAV_ITEMS} />
    </header>
  );
};

export default Navbar;
