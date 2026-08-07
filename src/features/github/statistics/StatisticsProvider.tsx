import React, { createContext, useContext } from 'react';
import { useGitHubStatistics } from '@/hooks/github/useGitHubStatistics';
import { StatisticsContextValue, StatisticsProviderProps } from '@/types/github';

const StatisticsContext = createContext<StatisticsContextValue | null>(null);

export const StatisticsProvider: React.FC<StatisticsProviderProps> = ({
  username,
  children,
}) => {
  const value = useGitHubStatistics(username);

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
};

export function useStatisticsContext(): StatisticsContextValue {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error('useStatisticsContext must be used within a StatisticsProvider');
  }
  return context;
}

export default StatisticsProvider;
