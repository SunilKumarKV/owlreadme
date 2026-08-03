"use client";

import React from 'react';
import { BackgroundLightStreakProps } from '../../types/background-animation';
import BackgroundAnimationLayer from './BackgroundAnimationLayer';

export const BackgroundLightStreak: React.FC<BackgroundLightStreakProps> = ({
  speed = 12,
  opacity = 0.15,
  className = '',
}) => {
  return (
    <BackgroundAnimationLayer className={className} zIndex={3}>
      <div
        className="absolute -top-10 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse"
        style={{
          opacity,
          animationDuration: `${speed}s`,
          willChange: 'opacity',
        }}
      />
    </BackgroundAnimationLayer>
  );
};

export default BackgroundLightStreak;
