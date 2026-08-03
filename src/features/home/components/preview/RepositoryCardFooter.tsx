"use client";

import React from 'react';
import { Star, GitFork } from 'lucide-react';
import { RepositoryCardFooterProps } from '../../types/preview-content';
import { formatStarCount } from '../../utils/preview-content';

export const RepositoryCardFooter: React.FC<RepositoryCardFooterProps> = ({
  language,
  stars,
  forks,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400 ${className}`}>
      {language && (
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span>{language}</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        <span>{formatStarCount(stars)}</span>
      </div>
      {forks !== undefined && (
        <div className="flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span>{forks}</span>
        </div>
      )}
    </div>
  );
};

export default RepositoryCardFooter;
