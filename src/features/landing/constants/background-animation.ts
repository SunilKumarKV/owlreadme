import { ParticleConfig } from '../types/background-animation';

export const ANIMATION_DEFAULTS = {
  particleCountDesktop: 12,
  particleCountMobile: 6,
  glowPulseDuration: 8,
  streakDuration: 12,
} as const;

export const DEFAULT_PARTICLES: ParticleConfig[] = [
  { id: 'p1', x: 15, y: 20, size: 4, speed: 6, opacity: 0.4, color: 'blue', delay: 0 },
  { id: 'p2', x: 85, y: 15, size: 6, speed: 8, opacity: 0.3, color: 'purple', delay: 1 },
  { id: 'p3', x: 45, y: 35, size: 3, speed: 5, opacity: 0.5, color: 'indigo', delay: 2 },
  { id: 'p4', x: 75, y: 65, size: 5, speed: 7, opacity: 0.35, color: 'blue', delay: 0.5 },
  { id: 'p5', x: 25, y: 75, size: 4, speed: 9, opacity: 0.4, color: 'purple', delay: 1.5 },
  { id: 'p6', x: 60, y: 85, size: 3, speed: 6, opacity: 0.45, color: 'cyan', delay: 2.5 },
  { id: 'p7', x: 10, y: 45, size: 5, speed: 7, opacity: 0.3, color: 'blue', delay: 3 },
  { id: 'p8', x: 90, y: 40, size: 4, speed: 8, opacity: 0.35, color: 'purple', delay: 3.5 },
  { id: 'p9', x: 35, y: 55, size: 6, speed: 5, opacity: 0.4, color: 'indigo', delay: 0.8 },
  { id: 'p10', x: 80, y: 80, size: 3, speed: 6.5, opacity: 0.45, color: 'blue', delay: 1.8 },
  { id: 'p11', x: 20, y: 90, size: 5, speed: 7.5, opacity: 0.3, color: 'purple', delay: 2.2 },
  { id: 'p12', x: 50, y: 10, size: 4, speed: 8.5, opacity: 0.5, color: 'cyan', delay: 1.2 },
];
