"use client";

import React, { useState, useEffect } from 'react';
import { BackgroundParticlesProps } from '../../types/background-animation';
import { DEFAULT_PARTICLES } from '../../constants/background-animation';
import BackgroundParticle from './BackgroundParticle';
import BackgroundAnimationLayer from './BackgroundAnimationLayer';

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  count = 12,
  className = '',
}) => {
  const [effectiveCount, setEffectiveCount] = useState<number>(count);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEffectiveCount(Math.min(4, count));
      } else {
        setEffectiveCount(count);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [count]);

  const activeParticles = DEFAULT_PARTICLES.slice(0, effectiveCount);

  return (
    <BackgroundAnimationLayer className={className} zIndex={2}>
      {activeParticles.map((particle) => (
        <BackgroundParticle key={particle.id} particle={particle} />
      ))}
    </BackgroundAnimationLayer>
  );
};

export default BackgroundParticles;
