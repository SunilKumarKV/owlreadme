"use client";

import React from 'react';
import Link from 'next/link';
import { BRANDING } from '@/config/branding';
import { NavbarLogoProps } from '../../types/navigation';

export const NavbarLogo: React.FC<NavbarLogoProps> = ({ className = '' }) => {
  return (
    <Link
      href="/"
      className={`flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1 -ml-1 transition-transform ${className}`}
      aria-label={`${BRANDING.name} Home`}
    >
      <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/branding/owlreadme-icon.svg"
          alt="OwlREADME Logo Icon"
          className="h-5 w-5 text-white"
        />
      </div>
      <span className="font-black text-lg tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
        {BRANDING.name}
      </span>
    </Link>
  );
};

export default NavbarLogo;
