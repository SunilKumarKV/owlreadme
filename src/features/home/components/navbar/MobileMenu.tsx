"use client";

import React, { useEffect, useRef } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap cycle
      if (e.key === 'Tab' && menuRef.current) {
        const focusables = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end sm:justify-start">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in-smooth"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div
        ref={menuRef}
        id="mobile-navigation-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`relative z-10 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl transition-all duration-300 animate-slide-down px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto ${className}`}
      >
        <MobileNavigation items={items} onItemClick={onClose} />

        <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800/60 flex flex-col space-y-3">
          <div className="flex items-center justify-between min-h-[44px]">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Switch Mode
            </span>
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <DashboardButton onClick={onClose} className="justify-center min-h-[44px] py-2.5 text-sm" />
            <StartBuildingButton onClick={onClose} className="justify-center min-h-[44px] py-2.5 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
