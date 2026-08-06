import React from 'react';
import { GitHubRepository } from '@/types/github';

export interface RepositoryTopicsProps {
  topics: GitHubRepository['topics'];
  maxDisplay?: number;
  className?: string;
}

export const RepositoryTopics: React.FC<RepositoryTopicsProps> = ({
  topics,
  maxDisplay = 4,
  className = '',
}) => {
  if (!topics || topics.length === 0) return null;

  const visibleTopics = topics.slice(0, maxDisplay);
  const remainingCount = topics.length - maxDisplay;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visibleTopics.map((topic) => (
        <span
          key={topic}
          className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          {topic}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

export default RepositoryTopics;
