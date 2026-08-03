import React from 'react';
import { GithubStatProps } from '../../types/preview-content';

export const GithubStat: React.FC<GithubStatProps> = ({
  stat,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
        {stat.label}
      </span>
      <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white block">
        {stat.value}
      </span>
    </div>
  );
};

export default GithubStat;
