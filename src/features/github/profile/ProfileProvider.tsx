import React, { createContext, useContext } from 'react';
import { useGitHubProfile } from '@/hooks/github/useGitHubProfile';
import { ProfileContextValue, ProfileProviderProps } from '@/types/github';

const ProfileContext = createContext<ProfileContextValue | null>(null);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  username,
  children,
}) => {
  const value = useGitHubProfile(username);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfileContext(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileProvider;
