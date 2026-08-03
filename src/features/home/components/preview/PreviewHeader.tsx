"use client";

import React from 'react';
import { PreviewHeaderProps } from '../../types/preview';
import PreviewWindowControls from './PreviewWindowControls';
import PreviewFileName from './PreviewFileName';

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  fileName,
  className = '',
}) => {
  return (
    <div
      className={`px-4 py-3 bg-gray-100/70 dark:bg-gray-800/70 border-b border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between gap-3 ${className}`}
    >
      <PreviewWindowControls />
      <PreviewFileName fileName={fileName} />
      <div className="w-12" aria-hidden="true" />
    </div>
  );
};

export default PreviewHeader;
