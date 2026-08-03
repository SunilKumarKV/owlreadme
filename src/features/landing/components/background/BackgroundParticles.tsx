"use client";

import React from 'react';
import { BackgroundParticlesProps } from '../../types/background-animation';
import { DEFAULT_PARTICLES } from '../../constants/background-animation';
import BackgroundParticle from './BackgroundParticle';
import BackgroundAnimationLayer from './BackgroundAnimationLayer';

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  count = 12,
  className = '',
}) => {
  const activeParticles = DEFAULT_PARTICLES.slice(0, count);

  return (
    <BackgroundAnimationLayer className={className} zIndex={2}>
      {activeParticles.map((particle) => (
        <BackgroundParticle key={particle.id} particle={particle} />
      ))}
    </BackgroundAnimationLayer>
  );
};

export default BackgroundParticles;
