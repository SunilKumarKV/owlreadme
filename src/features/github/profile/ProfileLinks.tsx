import React from 'react';
import { Icon, Typography } from '@/design-system';
import { GitHubUserProfile } from '@/types/github';

export interface ProfileLinksProps {
  profile: GitHubUserProfile;
  className?: string;
}

export const ProfileLinks: React.FC<ProfileLinksProps> = ({
  profile,
  className = '',
}) => {
  const links = [
    profile.company ? { id: 'company', icon: 'users' as const, label: profile.company, href: null } : null,
    profile.location ? { id: 'location', icon: 'settings' as const, label: profile.location, href: null } : null,
    profile.blog ? { id: 'blog', icon: 'external-link' as const, label: profile.blog.replace(/^https?:\/\//, ''), href: profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}` } : null,
    profile.twitterUsername ? { id: 'twitter', icon: 'external-link' as const, label: `@${profile.twitterUsername}`, href: `https://twitter.com/${profile.twitterUsername}` } : null,
    profile.email ? { id: 'email', icon: 'user' as const, label: profile.email, href: `mailto:${profile.email}` } : null,
  ].filter(Boolean);

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-x-5 gap-y-2 text-xs ${className}`}>
      {links.map((link) => {
        if (!link) return null;

        const content = (
          <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Icon name={link.icon} size="xs" />
            <Typography variant="caption" className="font-medium">
              {link.label}
            </Typography>
          </span>
        );

        if (link.href) {
          return (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
            >
              {content}
            </a>
          );
        }

        return <div key={link.id}>{content}</div>;
      })}
    </div>
  );
};

export default ProfileLinks;
