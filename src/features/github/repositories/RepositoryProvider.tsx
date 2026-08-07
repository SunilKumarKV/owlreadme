import React, { createContext, useContext } from 'react';
import { useRepositories } from '@/hooks/github/useRepositories';
import { RepositoryContextValue, RepositoryProviderProps } from '@/types/github';

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

export const RepositoryProvider: React.FC<RepositoryProviderProps> = ({
  username,
  initialOptions,
  children,
}) => {
  const value = useRepositories(username, initialOptions);

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
};

export function useRepositoryContext(): RepositoryContextValue {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepositoryContext must be used within a RepositoryProvider');
  }
  return context;
}

export default RepositoryProvider;
