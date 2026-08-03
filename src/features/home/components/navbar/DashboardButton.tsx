"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { ActionButtonProps } from '../../types/navigation';

export const DashboardButton: React.FC<ActionButtonProps> = ({
  className = '',
  onClick,
}) => {
  return (
    <Link
      href="/dashboard"
      onClick={onClick}
      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border border-gray-200/60 dark:border-gray-700/60 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 inline-flex items-center gap-1.5 ${className}`}
    >
      <LayoutDashboard className="h-3.5 w-3.5 text-blue-500" />
      <span>Dashboard</span>
    </Link>
  );
};

export default DashboardButton;
