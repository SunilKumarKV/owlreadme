"use client";

import React from 'react';
import { BackgroundLightsProps } from '../../types/background';
import BackgroundLayer from './BackgroundLayer';

export const BackgroundLights: React.FC<BackgroundLightsProps> = ({
  className = '',
  speed = 10,
  opacity = 0.2,
}) => {
  return (
    <BackgroundLayer zIndex={6} className={`overflow-hidden ${className}`}>
      <div
        className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-3xl animate-pulse"
        style={{
          opacity,
          animationDuration: `${speed}s`,
          willChange: 'opacity, transform',
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/15 dark:bg-purple-500/20 blur-3xl animate-pulse"
        style={{
          opacity: opacity * 0.8,
          animationDuration: `${speed * 1.3}s`,
          animationDelay: '2s',
          willChange: 'opacity, transform',
        }}
      />
    </BackgroundLayer>
  );
};

export default BackgroundLights;
