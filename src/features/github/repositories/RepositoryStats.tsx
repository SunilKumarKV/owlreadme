import React from 'react';
import { Icon, Typography } from '@/design-system';
import { GitHubRepository } from '@/types/github';

export interface RepositoryStatsProps {
  repository: GitHubRepository;
  className?: string;
}

export const RepositoryStats: React.FC<RepositoryStatsProps> = ({
  repository,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      <span className="flex items-center gap-1 hover:text-amber-500 transition-colors" title={`${repository.stars} Stars`}>
        <Icon name="star" size="xs" className="text-amber-400" />
        <Typography variant="caption" className="font-semibold">
          {repository.stars.toLocaleString()}
        </Typography>
      </span>

      <span className="flex items-center gap-1 hover:text-blue-500 transition-colors" title={`${repository.forks} Forks`}>
        <Icon name="code" size="xs" className="text-blue-400" />
        <Typography variant="caption" className="font-semibold">
          {repository.forks.toLocaleString()}
        </Typography>
      </span>

      {repository.openIssues > 0 && (
        <span className="flex items-center gap-1 hover:text-emerald-500 transition-colors" title={`${repository.openIssues} Open Issues`}>
          <Icon name="file" size="xs" className="text-emerald-400" />
          <Typography variant="caption" className="font-semibold">
            {repository.openIssues.toLocaleString()}
          </Typography>
        </span>
      )}
    </div>
  );
};

export default RepositoryStats;
