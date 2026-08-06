import React from 'react';
import { GlassCard, Button } from '@/design-system';
import { GitHubUserProfile } from '@/types/github';
import ProfileAvatar from './ProfileAvatar';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileLinks from './ProfileLinks';

export interface ProfileCardProps {
  profile: GitHubUserProfile;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  className = '',
}) => {
  return (
    <GlassCard className={`p-6 space-y-6 border border-gray-200/80 dark:border-gray-800/80 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            url={profile.avatarUrl}
            name={profile.name}
            username={profile.login}
            size={72}
          />
          <ProfileHeader profile={profile} />
        </div>

        <Button
          variant="outline"
          size="sm"
          href={profile.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          View Profile ↗
        </Button>
      </div>

      <ProfileLinks profile={profile} />
      <ProfileStats profile={profile} />
    </GlassCard>
  );
};

export default ProfileCard;
