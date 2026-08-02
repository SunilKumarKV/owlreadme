"use client";

import React, { useEffect, useState } from 'react';

export interface LoadingStatsProps {
  stats?: {
    publicRepos?: number;
    followers?: number;
    following?: number;
    primaryLanguage?: string;
  };
  className?: string;
}

const useCountUp = (targetValue: number, durationMs = 1000): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (targetValue <= 0) {
      return;
    }

    let start = 0;
    const increment = targetValue / (durationMs / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetValue, durationMs]);

  return targetValue <= 0 ? 0 : count;
};

export const LoadingStats: React.FC<LoadingStatsProps> = ({ stats, className = '' }) => {
  const reposCount = useCountUp(stats?.publicRepos ?? 0);
  const followersCount = useCountUp(stats?.followers ?? 0);
  const followingCount = useCountUp(stats?.following ?? 0);

  // If no stats are provided yet, do not render fake metrics
  if (!stats || (stats.publicRepos === undefined && stats.followers === undefined)) {
    return null;
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 w-full animate-fade-in-smooth ${className}`}>
      {stats.publicRepos !== undefined && (
        <div className="p-3 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-gray-200/50 dark:border-gray-700/40 backdrop-blur-xs text-center space-y-0.5">
          <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
            {reposCount}
          </span>
          <span className="block text-3xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Repositories
          </span>
        </div>
      )}

      {stats.followers !== undefined && (
        <div className="p-3 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-gray-200/50 dark:border-gray-700/40 backdrop-blur-xs text-center space-y-0.5">
          <span className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
            {followersCount}
          </span>
          <span className="block text-3xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Followers
          </span>
        </div>
      )}

      {stats.following !== undefined && (
        <div className="p-3 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-gray-200/50 dark:border-gray-700/40 backdrop-blur-xs text-center space-y-0.5">
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {followingCount}
          </span>
          <span className="block text-3xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Following
          </span>
        </div>
      )}

      {stats.primaryLanguage && (
        <div className="p-3 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-gray-200/50 dark:border-gray-700/40 backdrop-blur-xs text-center space-y-0.5">
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono truncate block">
            {stats.primaryLanguage}
          </span>
          <span className="block text-3xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Primary Stack
          </span>
        </div>
      )}
    </div>
  );
};

export default LoadingStats;
