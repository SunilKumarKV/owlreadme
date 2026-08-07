import React from 'react';
import { GlassCard } from '@/design-system';

export interface StatisticsSkeletonProps {
  className?: string;
}

export const StatisticsSkeleton: React.FC<StatisticsSkeletonProps> = ({ className = '' }) => {
  return (
    <GlassCard
      className={`p-5 space-y-4 animate-pulse border border-gray-200/80 dark:border-gray-800 ${className}`}
      aria-busy="true"
      aria-label="Loading GitHub activity statistics"
    >
      <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-800 pb-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default StatisticsSkeleton;
