"use client";

import React from 'react';
import { NavbarLinksProps } from '../../types/navigation';
import { isNavItemActive } from '../../utils/navigation';
import NavbarLink from './NavbarLink';

export const NavbarLinks: React.FC<NavbarLinksProps> = ({
  items,
  currentPath = '',
  className = '',
}) => {
  return (
    <ul className={`hidden md:flex items-center space-x-1 ${className}`}>
      {items.map((item) => (
        <li key={item.id}>
          <NavbarLink item={item} isActive={isNavItemActive(currentPath, item.href)} />
        </li>
      ))}
    </ul>
  );
};

export default NavbarLinks;
