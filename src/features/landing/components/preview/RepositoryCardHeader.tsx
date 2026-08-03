import React from 'react';
import { RepositoryCardHeaderProps } from '../../types/preview-content';

export const RepositoryCardHeader: React.FC<RepositoryCardHeaderProps> = ({
  name,
  visibility = 'Public',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      <span className="font-bold text-sm text-blue-600 dark:text-blue-400 group-hover:underline truncate">
        {name}
      </span>
      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 shrink-0">
        {visibility}
      </span>
    </div>
  );
};

export default RepositoryCardHeader;
