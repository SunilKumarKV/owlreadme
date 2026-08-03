"use client";

import React from 'react';
import { PreviewScrollAreaProps } from '../../types/preview';
import { DEFAULT_PREVIEW_CONFIG } from '../../constants/preview';

export const PreviewScrollArea: React.FC<PreviewScrollAreaProps> = ({
  children,
  maxHeight = DEFAULT_PREVIEW_CONFIG.maxHeight,
  className = '',
}) => {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Markdown Preview Content"
      className={`overflow-y-auto ${maxHeight} custom-scrollbar focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-b-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default PreviewScrollArea;
