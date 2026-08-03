"use client";

import React from 'react';
import { BookOpen } from 'lucide-react';
import { RepositoryCardHeaderProps } from '../../types/preview-content';

export const RepositoryCardHeader: React.FC<RepositoryCardHeaderProps> = ({
  name,
  visibility = 'Public',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono hover:underline cursor-pointer">
          {name}
        </span>
      </div>
      {visibility && (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50">
          {visibility}
        </span>
      )}
    </div>
  );
};

export default RepositoryCardHeader;
