import React from 'react';
import { useGitHubStatistics } from '@/hooks/github/useGitHubStatistics';
import StatisticsCard from './StatisticsCard';
import StatisticsSkeleton from './StatisticsSkeleton';
import StatisticsError from './StatisticsError';

export interface StatisticsContainerProps {
  username?: string;
  className?: string;
}

export const StatisticsContainer: React.FC<StatisticsContainerProps> = ({
  username,
  className = '',
}) => {
  const { statistics, isLoading, error, refetch } = useGitHubStatistics(username);

  if (isLoading) {
    return <StatisticsSkeleton className={className} />;
  }

  if (error) {
    return <StatisticsError error={error} onRetry={refetch} className={className} />;
  }

  if (!statistics) {
    return null;
  }

  return <StatisticsCard statistics={statistics} className={className} />;
};

export default StatisticsContainer;
