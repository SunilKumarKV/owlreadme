"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnnouncementCTAProps } from '../../types/announcement';

export const AnnouncementCTA: React.FC<AnnouncementCTAProps> = ({
  label,
  href,
  className = '',
}) => {
  const isExternal = href.startsWith('http');
  const isHash = href.startsWith('#');

  const content = (
    <>
      <span>{label}</span>
      {!label.includes('→') && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
    </>
  );

  const baseClasses = `group inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1.5 py-0.5 ${className}`;

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  if (isHash) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClasses}>
      {content}
    </Link>
  );
};

export default AnnouncementCTA;
