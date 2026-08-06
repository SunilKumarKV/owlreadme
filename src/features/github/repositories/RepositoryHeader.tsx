import React from 'react';
import { Typography, Icon } from '@/design-system';
import { GitHubRepository } from '@/types/github';

export interface RepositoryHeaderProps {
  repository: GitHubRepository;
  className?: string;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  repository,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <Icon name="folder" size="sm" className="text-blue-500 shrink-0" />
          <a
            href={repository.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 min-w-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
          >
            <Typography
              variant="heading-md"
              className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline truncate"
            >
              {repository.name}
            </Typography>
            <Icon name="external-link" size="xs" className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 shrink-0" />
          </a>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {repository.isPinned && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Pinned
            </span>
          )}
          {repository.isPrivate ? (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Private
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20">
              Public
            </span>
          )}
          {repository.isFork && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Fork
            </span>
          )}
          {repository.isArchived && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              Archived
            </span>
          )}
        </div>
      </div>

      {repository.description && (
        <Typography variant="body-sm" className="text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {repository.description}
        </Typography>
      )}
    </div>
  );
};

export default RepositoryHeader;
