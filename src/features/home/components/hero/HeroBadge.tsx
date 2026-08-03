"use client";

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { HeroBadgeProps } from '../../types/hero';

export const HeroBadge: React.FC<HeroBadgeProps> = ({
  text,
  icon = 'sparkles',
  href,
  className = '',
}) => {
  const content = (
    <>
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500 text-white font-extrabold text-[10px] tracking-wide uppercase shadow-xs">
        {icon === 'sparkles' && <Sparkles className="h-3 w-3 animate-pulse" />}
        {text}
      </span>
      {href && <ArrowRight className="h-3.5 w-3.5 text-blue-500 transition-transform group-hover:translate-x-0.5" />}
    </>
  );

  const containerClasses = `inline-flex items-center gap-2 p-1 pr-3 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group ${className}`;

  if (href) {
    return (
      <a href={href} className={containerClasses}>
        {content}
      </a>
    );
  }

  return <div className={containerClasses}>{content}</div>;
};

export default HeroBadge;
