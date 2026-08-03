"use client";

import React from 'react';
import NavbarLogo from './NavbarLogo';

interface NavbarBrandProps {
  className?: string;
}

export const NavbarBrand: React.FC<NavbarBrandProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <NavbarLogo />
    </div>
  );
};

export default NavbarBrand;
