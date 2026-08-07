import React from 'react';
import { Typography } from '@/design-system';
import { GitHubStatistics } from '@/types/github';

export interface StatisticsGridProps {
  statistics: GitHubStatistics;
  className?: string;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  statistics,
  className = '',
}) => {
  const items = [
    { label: 'Total Stars', value: statistics.totalStars.toLocaleString() },
    { label: 'Primary Language', value: statistics.primaryLanguage || '—' },
    { label: 'Total Commits', value: statistics.totalCommits !== null ? statistics.totalCommits.toLocaleString() : '—' },
    { label: 'Contributions', value: statistics.contributions !== null ? statistics.contributions.toLocaleString() : '—' },
    { label: 'Public Repos', value: statistics.repositoryCount.toLocaleString() },
    { label: 'Followers', value: statistics.followers.toLocaleString() },
  ];

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <Typography variant="caption" className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
            {item.label}
          </Typography>
          <Typography variant="body-md" className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white block">
            {item.value}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default StatisticsGrid;
