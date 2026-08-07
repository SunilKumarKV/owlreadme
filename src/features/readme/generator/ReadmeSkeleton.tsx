import React from 'react';
import { GlassCard } from '@/design-system';

export interface ReadmeSkeletonProps {
  className?: string;
}

export const ReadmeSkeleton: React.FC<ReadmeSkeletonProps> = ({ className = '' }) => {
  return (
    <GlassCard
      className={`p-8 space-y-6 animate-pulse border border-gray-200/80 dark:border-gray-800/80 ${className}`}
      aria-busy="true"
      aria-label="Generating README preview"
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800/60">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
    </GlassCard>
  );
};

export default ReadmeSkeleton;
