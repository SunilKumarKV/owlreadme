import React from 'react';

export type ParticleColor = 'blue' | 'purple' | 'indigo' | 'cyan';

export interface ParticleConfig {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: ParticleColor;
  delay: number;
}

export interface BackgroundParticleProps {
  particle: ParticleConfig;
  className?: string;
}

export interface BackgroundParticlesProps {
  count?: number;
  colorPreset?: 'dual' | 'blue' | 'purple';
  speed?: number;
  className?: string;
}

export interface BackgroundLightProps {
  color?: ParticleColor;
  blurSize?: 'sm' | 'md' | 'lg' | 'xl';
  speed?: number;
  className?: string;
}

export interface BackgroundLightStreakProps {
  speed?: number;
  opacity?: number;
  className?: string;
}

export interface BackgroundAnimationLayerProps {
  children?: React.ReactNode;
  className?: string;
  zIndex?: number;
}

export interface BackgroundMotionProps {
  children?: React.ReactNode;
  enableParticles?: boolean;
  enableGlowPulse?: boolean;
  enableStreaks?: boolean;
  className?: string;
}
