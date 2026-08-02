"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnnouncementLinkProps } from '../../types/announcement';

export const AnnouncementLink: React.FC<AnnouncementLinkProps> = ({
  text,
  href,
  className = '',
}) => {
  const isExternal = href.startsWith('http');

  const content = (
    <>
      <span>{text}</span>
      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
    </>
  );

  const baseStyle =
    'inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-white/60 dark:bg-gray-900/60 hover:bg-white dark:hover:bg-gray-800 border border-blue-200/60 dark:border-blue-800/40 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group select-none cursor-pointer';

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyle} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${baseStyle} ${className}`}>
      {content}
    </Link>
  );
};

export default AnnouncementLink;
