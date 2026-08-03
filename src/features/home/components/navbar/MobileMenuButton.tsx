"use client";

import React from 'react';
import { Menu, X } from 'lucide-react';
import { MobileMenuButtonProps } from '../../types/navigation';

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation-menu"
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      className={`md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100/80 dark:bg-gray-800/80 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${className}`}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
};

export default MobileMenuButton;
