import React from 'react';
import { GlassCard } from '@/design-system';

export interface ProfileSkeletonProps {
  className?: string;
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ className = '' }) => {
  return (
    <GlassCard
      className={`p-6 space-y-6 animate-pulse border border-gray-200/80 dark:border-gray-800/80 ${className}`}
      aria-busy="true"
      aria-label="Loading profile data"
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
          <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        ))}
      </div>
    </GlassCard>
  );
};

export default ProfileSkeleton;
