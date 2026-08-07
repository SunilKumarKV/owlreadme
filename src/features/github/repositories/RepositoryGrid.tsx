import React from 'react';
import { GitHubRepository } from '@/types/github';
import RepositoryCard from './RepositoryCard';

export interface RepositoryGridProps {
  repositories: GitHubRepository[];
  className?: string;
}

export const RepositoryGrid: React.FC<RepositoryGridProps> = ({
  repositories,
  className = '',
}) => {
  if (repositories.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        No repositories found matching your filters.
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}
    </div>
  );
};

export default RepositoryGrid;
