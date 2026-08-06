import React from 'react';

export interface ProfileAvatarProps {
  url?: string;
  name?: string | null;
  username: string;
  size?: number;
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  url,
  name,
  username,
  size = 80,
  className = '',
}) => {
  const initials = (name || username || 'GH')
    .slice(0, 2)
    .toUpperCase();

  if (!url) {
    return (
      <div
        className={`rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black flex items-center justify-center shadow-md select-none shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.floor(size * 0.4) }}
        aria-label={`${name || username}'s avatar initials`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden border-2 border-white/20 dark:border-gray-800 shadow-md shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`${name || username}'s GitHub profile picture`}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default ProfileAvatar;
