"use client";

import React from 'react';
import { PreviewBodyProps } from '../../types/preview';

export const PreviewBody: React.FC<PreviewBodyProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-6 space-y-6 text-gray-800 dark:text-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default PreviewBody;
