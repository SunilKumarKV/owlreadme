import React from 'react';
import { RepositoryFilterOptions, RepositoryTypeFilter, RepositorySortBy } from '@/types/github';

export interface RepositoryFiltersProps {
  options: RepositoryFilterOptions;
  availableLanguages?: string[];
  onChange: (options: Partial<RepositoryFilterOptions>) => void;
  className?: string;
}

export const RepositoryFilters: React.FC<RepositoryFiltersProps> = ({
  options,
  availableLanguages = [],
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Type Filter */}
      <select
        value={options.type || 'all'}
        onChange={(e) => onChange({ type: e.target.value as RepositoryTypeFilter })}
        className="px-3 py-1.5 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label="Filter repositories by type"
      >
        <option value="all">All Types</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="forks">Forks</option>
        <option value="archived">Archived</option>
        <option value="templates">Templates</option>
      </select>

      {/* Language Filter */}
      {availableLanguages.length > 0 && (
        <select
          value={options.language || 'all'}
          onChange={(e) => onChange({ language: e.target.value })}
          className="px-3 py-1.5 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="Filter repositories by language"
        >
          <option value="all">All Languages</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      )}

      {/* Sort By */}
      <select
        value={options.sortBy || 'updated'}
        onChange={(e) => onChange({ sortBy: e.target.value as RepositorySortBy })}
        className="px-3 py-1.5 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ml-auto"
        aria-label="Sort repositories by"
      >
        <option value="updated">Recently Updated</option>
        <option value="stars">Most Stars</option>
        <option value="created">Recently Created</option>
        <option value="name">Name (A-Z)</option>
      </select>
    </div>
  );
};

export default RepositoryFilters;
