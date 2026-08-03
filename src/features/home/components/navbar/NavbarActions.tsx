"use client";

import React from 'react';
import { NavbarActionsProps } from '../../types/navigation';
import ThemeToggle from './ThemeToggle';
import DashboardButton from './DashboardButton';
import StartBuildingButton from './StartBuildingButton';

export const NavbarActions: React.FC<NavbarActionsProps> = ({ className = '' }) => {
  return (
    <div className={`hidden md:flex items-center space-x-2.5 ${className}`}>
      <ThemeToggle />
      <DashboardButton />
      <StartBuildingButton />
    </div>
  );
};

export default NavbarActions;
