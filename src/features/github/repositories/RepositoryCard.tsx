import React from 'react';
import { GlassCard, Typography } from '@/design-system';
import { GitHubRepository } from '@/types/github';
import RepositoryHeader from './RepositoryHeader';
import RepositoryStats from './RepositoryStats';
import RepositoryTopics from './RepositoryTopics';
import RepositoryLanguage from './RepositoryLanguage';

export interface RepositoryCardProps {
  repository: GitHubRepository;
  className?: string;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  className = '',
}) => {
  const updatedDate = new Date(repository.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <GlassCard className={`p-5 flex flex-col justify-between space-y-4 border border-gray-200/80 dark:border-gray-800/80 hover:border-blue-500/30 transition-all ${className}`}>
      <div className="space-y-3">
        <RepositoryHeader repository={repository} />
        <RepositoryTopics topics={repository.topics} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60 text-xs">
        <div className="flex items-center gap-3">
          <RepositoryLanguage language={repository.language} />
          <RepositoryStats repository={repository} />
        </div>

        <Typography variant="caption" className="text-gray-400 dark:text-gray-500 text-[11px]">
          Updated {updatedDate}
        </Typography>
      </div>
    </GlassCard>
  );
};

export default RepositoryCard;
