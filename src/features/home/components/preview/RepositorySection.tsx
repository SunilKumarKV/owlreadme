"use client";

import React from 'react';
import { RepositorySectionProps } from '../../types/preview-content';
import RepositoryCard from './RepositoryCard';

export const RepositorySection: React.FC<RepositorySectionProps> = ({
  title = 'Featured Repositories',
  repositories,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-1 border-gray-200/60 dark:border-gray-800">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};

export default RepositorySection;
