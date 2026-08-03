"use client";

import React from 'react';
import { ShieldCheck, Zap, Sparkles, Database, Lock, CheckCircle } from 'lucide-react';
import { FeatureChipProps } from '../../types/hero';

export const FeatureChip: React.FC<FeatureChipProps> = ({ chip, className = '' }) => {
  const renderIcon = () => {
    switch (chip.icon) {
      case 'shield-check':
        return <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
      case 'database':
        return <Database className="h-3.5 w-3.5 text-indigo-500 shrink-0" />;
      case 'lock':
        return <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
      case 'zap':
        return <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
      case 'sparkles':
        return <Sparkles className="h-3.5 w-3.5 text-purple-500 shrink-0" />;
      default:
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
    }
  };

  return (
    <div
      title={chip.tooltip}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 text-xs font-semibold text-gray-700 dark:text-gray-300 select-none transition-transform hover:scale-[1.02] ${className}`}
    >
      {renderIcon()}
      <span>{chip.title}</span>
    </div>
  );
};

export default FeatureChip;
