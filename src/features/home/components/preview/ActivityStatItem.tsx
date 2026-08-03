"use client";

import React from 'react';
import { Star, Code, GitCommit, Award } from 'lucide-react';
import { ActivityStatItemProps } from '../../types/preview-content';

export const ActivityStatItem: React.FC<ActivityStatItemProps> = ({ stat, className = '' }) => {
  const renderIcon = () => {
    switch (stat.icon) {
      case 'star':
        return <Star className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'code':
        return <Code className="h-4 w-4 text-blue-500 shrink-0" />;
      case 'git-commit':
        return <GitCommit className="h-4 w-4 text-emerald-500 shrink-0" />;
      default:
        return <Award className="h-4 w-4 text-purple-500 shrink-0" />;
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl bg-gray-100/60 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 ${className}`}
    >
      <div className="flex items-center gap-2">
        {renderIcon()}
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.label}</span>
      </div>
      <span className="text-xs font-bold text-gray-900 dark:text-white font-mono">{stat.value}</span>
    </div>
  );
};

export default ActivityStatItem;
