import React from 'react';
import { FeaturedRepositoriesProps } from '../../types/preview-content';
import RepositoryCard from './RepositoryCard';

export const FeaturedRepositories: React.FC<FeaturedRepositoriesProps> = ({
  title = 'Featured Repositories',
  repositories,
  className = '',
}) => {
  if (!repositories || repositories.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="text-blue-500">📌</span> {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedRepositories;
