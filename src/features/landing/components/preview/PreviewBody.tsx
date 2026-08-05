import React from 'react';
import { PreviewBodyProps } from '../../types/preview';

export const PreviewBody: React.FC<PreviewBodyProps> = ({
  children,
  maxHeight = '600px',
  className = '',
}) => {
  return (
    <div
      className={`p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-auto max-w-full custom-scrollbar bg-white/70 dark:bg-[#0d1117]/80 backdrop-blur-xl ${className}`}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};

export default PreviewBody;
