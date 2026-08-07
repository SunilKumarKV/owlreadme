import React from 'react';
import { GlassCard, Typography } from '@/design-system';
import { GitHubStatistics } from '@/types/github';
import StatisticsGrid from './StatisticsGrid';

export interface StatisticsCardProps {
  statistics: GitHubStatistics;
  className?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  statistics,
  className = '',
}) => {
  return (
    <GlassCard className={`p-4 sm:p-5 space-y-4 border border-gray-200/80 dark:border-gray-800 ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-800 pb-3">
        <Typography variant="heading-md" className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-purple-500">📊</span> GitHub Activity Stats
        </Typography>
        {statistics.rank && (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs border border-purple-500/20">
            Rank {statistics.rank}
          </span>
        )}
      </div>

      <StatisticsGrid statistics={statistics} />
    </GlassCard>
  );
};

export default StatisticsCard;
