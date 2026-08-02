"use client";

import React from 'react';
import LoadingBackground from './LoadingBackground';
import OwlLoader from './OwlLoader';
import LoadingAvatar from './LoadingAvatar';
import LoadingProgress from './LoadingProgress';
import LoadingTimeline, { StepItem } from './LoadingTimeline';
import LoadingStats from './LoadingStats';

export interface LoadingScreenProps {
  status?: string;
  progress?: number;
  steps?: StepItem[];
  username?: string;
  avatarUrl?: string;
  stats?: {
    publicRepos?: number;
    followers?: number;
    following?: number;
    primaryLanguage?: string;
  };
  fullScreen?: boolean;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  status = 'Fetching GitHub profile...',
  progress,
  steps,
  username,
  avatarUrl,
  stats,
  fullScreen = true,
  className = '',
}) => {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className={`relative bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-slate-800/80 shadow-2xl rounded-2xl p-6 sm:p-10 flex flex-col items-center gap-6 overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Gloss Reflection Highlight Sweep */}
      <div 
        className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10 rounded-full blur-xl pointer-events-none" 
      />

      {/* 1. Header Loader / Avatar */}
      {avatarUrl ? (
        <LoadingAvatar avatarUrl={avatarUrl} username={username} />
      ) : (
        <OwlLoader size="md" progress={progress} />
      )}

      {/* 2. Main Title */}
      <div className="text-center space-y-1">
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white">
          {username ? `Setting up @${username}` : 'OwlREADME Workspace'}
        </h2>
        <p className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
          Automating markdown profiles & repository metrics
        </p>
      </div>

      {/* 3. Progress Bar */}
      <LoadingProgress status={status} progress={progress} />

      {/* 4. Real Stats (if available) */}
      <LoadingStats stats={stats} />

      {/* 5. Live Timeline */}
      <LoadingTimeline steps={steps} />
    </div>
  );

  if (fullScreen) {
    return <LoadingBackground>{content}</LoadingBackground>;
  }

  return content;
};

export default LoadingScreen;
