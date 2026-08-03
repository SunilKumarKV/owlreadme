import React from 'react';
import { GithubStatsCardProps } from '../../types/preview-content';
import GithubStat from './GithubStat';

export const GithubStatsCard: React.FC<GithubStatsCardProps> = ({
  config,
  className = '',
}) => {
  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 backdrop-blur-sm space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-800 pb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-purple-500">📊</span> {config.title || 'GitHub Activity Stats'}
        </h3>
        {config.rank && (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs border border-purple-500/20">
            Rank {config.rank}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {config.stats.map((stat) => (
          <GithubStat key={stat.id} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default GithubStatsCard;
