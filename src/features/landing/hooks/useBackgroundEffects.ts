import { useState, useEffect } from 'react';
import useReducedMotion from './useReducedMotion';

export interface BackgroundEffectsConfig {
  showGradient?: boolean;
  showGlow?: boolean;
  showBlur?: boolean;
  showGrid?: boolean;
  showWave?: boolean;
  showLights?: boolean;
  showParticles?: boolean;
  showOverlay?: boolean;
}

export interface UseBackgroundEffectsResult extends Required<BackgroundEffectsConfig> {
  prefersReducedMotion: boolean;
  particleCount: number;
}

export function useBackgroundEffects(config: BackgroundEffectsConfig = {}): UseBackgroundEffectsResult {
  const prefersReducedMotion = useReducedMotion();
  const [particleCount, setParticleCount] = useState<number>(12);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setParticleCount(6);
      } else if (window.innerWidth < 1024) {
        setParticleCount(9);
      } else {
        setParticleCount(12);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    showGradient: config.showGradient ?? true,
    showGlow: config.showGlow ?? true,
    showBlur: config.showBlur ?? true,
    showGrid: config.showGrid ?? true,
    showWave: config.showWave ?? true,
    showLights: config.showLights ?? !prefersReducedMotion,
    showParticles: config.showParticles ?? !prefersReducedMotion,
    showOverlay: config.showOverlay ?? true,
    prefersReducedMotion,
    particleCount,
  };
}

export default useBackgroundEffects;
