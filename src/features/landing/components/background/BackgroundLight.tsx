"use client";

import React from 'react';
import { BackgroundLightProps } from '../../types/background-animation';
import { getParticleColorClass } from '../../utils/animation';
import BackgroundAnimationLayer from './BackgroundAnimationLayer';

export const BackgroundLight: React.FC<BackgroundLightProps> = ({
  color = 'blue',
  speed = 8,
  className = '',
}) => {
  const colorClass = getParticleColorClass(color);

  return (
    <BackgroundAnimationLayer className={className} zIndex={2}>
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-30 transition-opacity animate-pulse ${colorClass}`}
        style={{
          animationDuration: `${speed}s`,
          willChange: 'opacity, transform',
        }}
      />
    </BackgroundAnimationLayer>
  );
};

export default BackgroundLight;
