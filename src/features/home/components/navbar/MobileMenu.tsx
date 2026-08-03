"use client";

import React from 'react';
import { MobileMenuProps } from '../../types/navigation';
import MobileNavigation from './MobileNavigation';
import ThemeToggle from './ThemeToggle';
import DashboardButton from './DashboardButton';
import StartBuildingButton from './StartBuildingButton';

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  items,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation-menu"
      className={`md:hidden border-b border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl transition-all duration-300 animate-fade-in-smooth px-4 pt-3 pb-6 space-y-4 shadow-xl ${className}`}
    >
      <MobileNavigation items={items} onItemClick={onClose} />

      <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800/60 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Switch Mode
          </span>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <DashboardButton onClick={onClose} className="justify-center py-2 text-sm" />
          <StartBuildingButton onClick={onClose} className="justify-center py-2 text-sm" />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
