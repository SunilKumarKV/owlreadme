import React from 'react';
import Image from 'next/image';

export interface LoadingAvatarProps {
  avatarUrl?: string;
  username?: string;
  className?: string;
}

export const LoadingAvatar: React.FC<LoadingAvatarProps> = ({ avatarUrl, username, className = '' }) => {
  if (!avatarUrl) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center gap-2 animate-fade-in-smooth ${className}`}>
      <div className="relative group">
        {/* Glow Ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500" />
        
        {/* Avatar Image */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800">
          <Image
            src={avatarUrl}
            alt={username ? `${username}'s GitHub Avatar` : 'GitHub Avatar'}
            width={80}
            height={80}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
      </div>

      {username && (
        <span className="text-xs font-mono font-bold px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200/60 dark:border-blue-800/40 shadow-xs">
          @{username}
        </span>
      )}
    </div>
  );
};

export default LoadingAvatar;
