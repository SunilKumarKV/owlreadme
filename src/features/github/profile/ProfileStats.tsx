import React from 'react';
import { GlassCard, Typography } from '@/design-system';
import { GitHubUserProfile } from '@/types/github';

export interface ProfileStatsProps {
  profile: GitHubUserProfile;
  className?: string;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  profile,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      <GlassCard className="p-3 text-center border border-gray-200/60 dark:border-gray-800/60">
        <Typography variant="heading-md" className="font-extrabold text-blue-600 dark:text-blue-400 block">
          {profile.publicRepos}
        </Typography>
        <Typography variant="caption" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-0.5">
          Repos
        </Typography>
      </GlassCard>

      <GlassCard className="p-3 text-center border border-gray-200/60 dark:border-gray-800/60">
        <Typography variant="heading-md" className="font-extrabold text-purple-600 dark:text-purple-400 block">
          {profile.followers}
        </Typography>
        <Typography variant="caption" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-0.5">
          Followers
        </Typography>
      </GlassCard>

      <GlassCard className="p-3 text-center border border-gray-200/60 dark:border-gray-800/60">
        <Typography variant="heading-md" className="font-extrabold text-indigo-600 dark:text-indigo-400 block">
          {profile.following}
        </Typography>
        <Typography variant="caption" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-0.5">
          Following
        </Typography>
      </GlassCard>

      <GlassCard className="p-3 text-center border border-gray-200/60 dark:border-gray-800/60">
        <Typography variant="heading-md" className="font-extrabold text-emerald-600 dark:text-emerald-400 block">
          {profile.publicGists}
        </Typography>
        <Typography variant="caption" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-0.5">
          Gists
        </Typography>
      </GlassCard>
    </div>
  );
};

export default ProfileStats;
