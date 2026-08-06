import React from 'react';
import { Typography } from '@/design-system';
import { GitHubUserProfile } from '@/types/github';

export interface ProfileHeaderProps {
  profile: GitHubUserProfile;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  className = '',
}) => {
  const createdYear = new Date(profile.createdAt).getFullYear();

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex flex-wrap items-baseline gap-2">
        <Typography variant="heading-lg" className="font-extrabold text-gray-900 dark:text-white">
          {profile.name || profile.login}
        </Typography>
        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 font-mono">
          @{profile.login}
        </Typography>
      </div>

      {profile.bio && (
        <Typography variant="body-md" className="text-gray-600 dark:text-gray-300 leading-relaxed block">
          {profile.bio}
        </Typography>
      )}

      <Typography variant="caption" className="text-gray-400 dark:text-gray-500 block text-xs">
        Member since {createdYear}
      </Typography>
    </div>
  );
};

export default ProfileHeader;
