"use client";

import React from 'react';
import { FileCode } from 'lucide-react';
import { PreviewFileNameProps } from '../../types/preview';
import { formatFileName } from '../../utils/preview';

export const PreviewFileName: React.FC<PreviewFileNameProps> = ({
  fileName,
  className = '',
}) => {
  const formatted = formatFileName(fileName);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100/90 dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 text-xs font-mono font-medium text-gray-700 dark:text-gray-300 select-none ${className}`}
    >
      <FileCode className="h-3.5 w-3.5 text-blue-500 shrink-0" />
      <span>{formatted}</span>
    </div>
  );
};

export default PreviewFileName;
