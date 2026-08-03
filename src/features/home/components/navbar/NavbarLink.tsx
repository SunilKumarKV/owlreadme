"use client";

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { NavbarLinkProps } from '../../types/navigation';
import { getLinkAttributes } from '../../utils/navigation';

export const NavbarLink: React.FC<NavbarLinkProps> = ({
  item,
  isActive = false,
  onClick,
  className = '',
}) => {
  const linkAttrs = getLinkAttributes(item.external, item.target);

  const baseStyle =
    'relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 inline-flex items-center gap-1.5';

  const activeStyle = isActive
    ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/80 dark:bg-blue-950/50'
    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/60';

  if (item.disabled) {
    return (
      <span className={`${baseStyle} opacity-50 cursor-not-allowed ${className}`}>
        {item.label}
      </span>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        {...linkAttrs}
        onClick={onClick}
        className={`${baseStyle} ${activeStyle} ${className}`}
      >
        <span>{item.label}</span>
        <ExternalLink className="h-3 w-3 opacity-60" />
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      {...linkAttrs}
      onClick={onClick}
      className={`${baseStyle} ${activeStyle} ${className}`}
    >
      <span>{item.label}</span>
      {item.badge && (
        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-blue-500 text-white rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

export default NavbarLink;
