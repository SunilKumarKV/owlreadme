"use client";

import React from 'react';
import { BackgroundMotionProps } from '../../types/background-animation';
import useBackgroundAnimation from '../../hooks/useBackgroundAnimation';
import BackgroundParticles from './BackgroundParticles';
import BackgroundLight from './BackgroundLight';
import BackgroundLightStreak from './BackgroundLightStreak';

export const BackgroundMotion: React.FC<BackgroundMotionProps> = ({
  children,
  enableParticles = true,
  enableGlowPulse = true,
  enableStreaks = true,
  className = '',
}) => {
  const { isAnimated } = useBackgroundAnimation();

  if (!isAnimated) {
    return <div className={`relative w-full ${className}`}>{children}</div>;
  }

  return (
    <div className={`relative w-full ${className}`}>
      {enableGlowPulse && <BackgroundLight color="blue" speed={8} />}
      {enableParticles && <BackgroundParticles count={12} />}
      {enableStreaks && <BackgroundLightStreak speed={12} opacity={0.15} />}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default BackgroundMotion;
