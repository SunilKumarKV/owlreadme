"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { NavbarProps } from '../../types/navigation';
import { NAV_ITEMS } from '../../constants/navigation';
import { useNavbarScroll } from '../../hooks/useNavbarScroll';
import { useNavbar } from '../../hooks/useNavbar';

import NavbarContainer from './NavbarContainer';
import NavbarBrand from './NavbarBrand';
import NavbarLinks from './NavbarLinks';
import NavbarActions from './NavbarActions';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const { scrolled } = useNavbarScroll(15);
  const { isOpen, toggle, close } = useNavbar();

  return (
    <NavbarContainer scrolled={scrolled} className={className}>
      <NavbarBrand />
      <NavbarLinks items={NAV_ITEMS} currentPath={pathname || ''} />
      <NavbarActions />
      <MobileMenuButton isOpen={isOpen} onClick={toggle} />
      <MobileMenu isOpen={isOpen} onClose={close} items={NAV_ITEMS} />
    </NavbarContainer>
  );
};

export default Navbar;
