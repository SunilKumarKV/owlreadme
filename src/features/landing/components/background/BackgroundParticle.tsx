"use client";

import React from 'react';
import { BackgroundParticleProps } from '../../types/background-animation';
import { getParticleColorClass } from '../../utils/animation';

export const BackgroundParticle: React.FC<BackgroundParticleProps> = ({
  particle,
  className = '',
}) => {
  const colorClass = getParticleColorClass(particle.color);

  return (
    <div
      className={`absolute rounded-full shadow-xs transition-opacity duration-1000 animate-pulse ${colorClass} ${className}`}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        opacity: particle.opacity,
        animationDuration: `${particle.speed}s`,
        animationDelay: `${particle.delay}s`,
        willChange: 'opacity, transform',
      }}
    />
  );
};

export default BackgroundParticle;
