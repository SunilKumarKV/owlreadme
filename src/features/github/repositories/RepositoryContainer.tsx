import React, { useMemo } from 'react';
import { useRepositories } from '@/hooks/github/useRepositories';
import RepositorySearch from './RepositorySearch';
import RepositoryFilters from './RepositoryFilters';
import RepositoryGrid from './RepositoryGrid';
import RepositoryPagination from './RepositoryPagination';
import RepositorySkeleton from './RepositorySkeleton';
import RepositoryError from './RepositoryError';

export interface RepositoryContainerProps {
  username?: string;
  className?: string;
}

export const RepositoryContainer: React.FC<RepositoryContainerProps> = ({
  username,
  className = '',
}) => {
  const {
    repositories,
    allRepositories,
    isLoading,
    error,
    options,
    totalPages,
    totalCount,
    setOptions,
    setSearch,
    setPage,
    refetch,
  } = useRepositories(username);

  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    allRepositories.forEach((repo) => {
      if (repo.language) set.add(repo.language);
    });
    return Array.from(set).sort();
  }, [allRepositories]);

  if (isLoading) {
    return <RepositorySkeleton className={className} />;
  }

  if (error) {
    return <RepositoryError error={error} onRetry={refetch} className={className} />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <RepositorySearch value={options.search || ''} onChange={setSearch} className="md:w-72" />
        <RepositoryFilters
          options={options}
          availableLanguages={availableLanguages}
          onChange={setOptions}
        />
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        Showing {repositories.length} of {totalCount} repositories
      </div>

      <RepositoryGrid repositories={repositories} />

      <RepositoryPagination
        page={options.page || 1}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default RepositoryContainer;
