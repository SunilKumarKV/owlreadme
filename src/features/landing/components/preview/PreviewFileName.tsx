import React from 'react';
import { PreviewFileNameProps } from '../../types/preview';
import { formatFileName } from '../../utils/preview';

export const PreviewFileName: React.FC<PreviewFileNameProps> = ({
  fileName = 'owlreadme-output.md',
  className = '',
}) => {
  return (
    <div className={`px-3 py-1 rounded-md bg-gray-100/80 dark:bg-gray-800/80 text-xs font-mono font-medium text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 shadow-xs truncate max-w-[200px] sm:max-w-xs ${className}`}>
      {formatFileName(fileName)}
    </div>
  );
};

export default PreviewFileName;
