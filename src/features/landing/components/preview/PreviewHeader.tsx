"use client";

import React from 'react';
import { PreviewHeaderProps } from '../../types/preview';
import WindowControls from './WindowControls';
import PreviewFileName from './PreviewFileName';

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  fileName = 'owlreadme-output.md',
  actions,
  className = '',
}) => {
  return (
    <div className={`px-4 py-3 bg-gray-50/90 dark:bg-[#161b22]/90 border-b border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between backdrop-blur-md ${className}`}>
      <WindowControls />
      <PreviewFileName fileName={fileName} />
      <div className="flex items-center space-x-2">
        {actions || <div className="w-12 h-3" aria-hidden="true" />}
      </div>
    </div>
  );
};

export default PreviewHeader;
