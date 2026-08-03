import React from 'react';
import { RepositoryCardProps } from '../../types/preview-content';
import RepositoryCardHeader from './RepositoryCardHeader';
import RepositoryCardFooter from './RepositoryCardFooter';

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repo,
  className = '',
}) => {
  return (
    <div
      className={`group p-4 rounded-xl border border-gray-200/80 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xs space-y-2.5 transition-all duration-200 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md ${className}`}
    >
      <RepositoryCardHeader name={repo.name} visibility={repo.visibility} url={repo.url} />
      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed font-normal">
        {repo.description}
      </p>
      <RepositoryCardFooter language={repo.language} stars={repo.stars} forks={repo.forks} />
    </div>
  );
};

export default RepositoryCard;
