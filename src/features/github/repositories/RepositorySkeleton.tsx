import React from 'react';
import { GlassCard } from '@/design-system';

export interface RepositorySkeletonProps {
  count?: number;
  className?: string;
}

export const RepositorySkeleton: React.FC<RepositorySkeletonProps> = ({
  count = 6,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse ${className}`}
      aria-busy="true"
      aria-label="Loading repositories data"
    >
      {Array.from({ length: count }).map((_, i) => (
        <GlassCard key={i} className="p-5 space-y-4 border border-gray-200/80 dark:border-gray-800/80">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
          </div>

          <div className="flex gap-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-12" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
          </div>

          <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60">
            <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default RepositorySkeleton;
