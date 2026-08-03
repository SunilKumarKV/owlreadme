import React from 'react';
import { RepositoryCardFooterProps } from '../../types/preview-content';
import { formatStarCount } from '../../utils/preview-content';

export const RepositoryCardFooter: React.FC<RepositoryCardFooterProps> = ({
  language,
  stars,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 font-medium ${className}`}>
      <div className="flex items-center space-x-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" aria-hidden="true" />
        <span>{language}</span>
      </div>
      <div className="flex items-center space-x-1">
        <span>★</span>
        <span>{formatStarCount(stars)}</span>
      </div>
    </div>
  );
};

export default RepositoryCardFooter;
