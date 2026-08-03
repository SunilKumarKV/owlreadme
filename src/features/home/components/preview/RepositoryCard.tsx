"use client";

import React from 'react';
import { RepositoryCardProps } from '../../types/preview-content';
import RepositoryCardHeader from './RepositoryCardHeader';
import RepositoryCardFooter from './RepositoryCardFooter';

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo, className = '' }) => {
  return (
    <div
      className={`p-4 rounded-xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800 space-y-2.5 transition-all hover:border-blue-500/40 dark:hover:border-blue-500/40 ${className}`}
    >
      <RepositoryCardHeader name={repo.name} visibility={repo.visibility} url={repo.url} />
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
        {repo.description}
      </p>
      <RepositoryCardFooter language={repo.language} stars={repo.stars} forks={repo.forks} updatedAt={repo.updatedAt} />
    </div>
  );
};

export default RepositoryCard;
