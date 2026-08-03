"use client";

import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { HeroCTAProps } from '../../types/hero';

export const HeroCTA: React.FC<HeroCTAProps> = ({
  label,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`h-12 px-6 font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 inline-flex items-center justify-center gap-2 group shrink-0 cursor-pointer ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-white" />
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
};

export default HeroCTA;
