"use client";

import React from 'react';
import { NavItem } from '../../types/navigation';
import NavbarLink from './NavbarLink';

interface MobileNavigationProps {
  items: NavItem[];
  onItemClick: () => void;
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  onItemClick,
  className = '',
}) => {
  return (
    <nav aria-label="Mobile Navigation" className={`flex flex-col space-y-1.5 ${className}`}>
      {items.map((item) => (
        <NavbarLink
          key={item.id}
          item={item}
          onClick={onItemClick}
          className="text-sm py-2.5 px-3 w-full justify-between"
        />
      ))}
    </nav>
  );
};

export default MobileNavigation;
