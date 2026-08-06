import React from 'react';
import { useGitHubProfile } from '@/hooks/github/useGitHubProfile';
import ProfileCard from './ProfileCard';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileError from './ProfileError';

export interface ProfileContainerProps {
  username?: string;
  className?: string;
}

export const ProfileContainer: React.FC<ProfileContainerProps> = ({
  username,
  className = '',
}) => {
  const { profile, isLoading, error, refetch } = useGitHubProfile(username);

  if (isLoading) {
    return <ProfileSkeleton className={className} />;
  }

  if (error) {
    return <ProfileError error={error} onRetry={refetch} className={className} />;
  }

  if (!profile) {
    return null;
  }

  return <ProfileCard profile={profile} className={className} />;
};

export default ProfileContainer;
