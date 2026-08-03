"use client";

import React from 'react';
import { ActivityStatsCardProps } from '../../types/preview-content';
import ActivityStatItem from './ActivityStatItem';

export const ActivityStatsCard: React.FC<ActivityStatsCardProps> = ({ config, className = '' }) => {
  return (
    <div
      className={`p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800 space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {config.title || 'GitHub Activity Stats'}
        </h3>
        {config.rank && (
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold font-mono border border-emerald-500/20">
            Rank {config.rank}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {config.stats.map((stat) => (
          <ActivityStatItem key={stat.id} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default ActivityStatsCard;
