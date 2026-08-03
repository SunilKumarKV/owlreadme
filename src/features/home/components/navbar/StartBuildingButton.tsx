"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ActionButtonProps } from '../../types/navigation';

export const StartBuildingButton: React.FC<ActionButtonProps> = ({
  className = '',
  onClick,
}) => {
  return (
    <Link
      href="/dashboard"
      onClick={onClick}
      className={`px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 inline-flex items-center gap-1.5 group ${className}`}
    >
      <span>Start Building</span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
};

export default StartBuildingButton;
