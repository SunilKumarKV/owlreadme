"use client";

import React from 'react';
import { LandingBackgroundProps } from '../../types/background';
import useBackgroundEffects from '../../hooks/useBackgroundEffects';
import BackgroundGradient from './BackgroundGradient';
import BackgroundGlow from './BackgroundGlow';
import BackgroundBlur from './BackgroundBlur';
import BackgroundGrid from './BackgroundGrid';
import BackgroundWave from './BackgroundWave';
import BackgroundLights from './BackgroundLights';
import BackgroundParticles from './BackgroundParticles';
import BackgroundOverlay from './BackgroundOverlay';

export const LandingBackground: React.FC<LandingBackgroundProps> = ({
  children,
  className = '',
  variant = 'hero',
  showGradient,
  showGlow,
  showBlur,
  showGrid,
  showWave,
  showLights,
  showParticles,
  showOverlay,
}) => {
  const effects = useBackgroundEffects({
    showGradient,
    showGlow,
    showBlur,
    showGrid,
    showWave,
    showLights,
    showParticles,
    showOverlay,
  });

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Layer 1: Base Dark Gradient */}
      {effects.showGradient && <BackgroundGradient variant={variant} />}

      {/* Layer 2: Radial Hero Glow */}
      {effects.showGlow && <BackgroundGlow position="hero" color="dual" />}

      {/* Layer 3: Blur Overlay */}
      {effects.showBlur && <BackgroundBlur blurLevel="sm" />}

      {/* Layer 4: Perspective Grid Floor */}
      {effects.showGrid && <BackgroundGrid perspective opacity={0.15} />}

      {/* Layer 5: Curved Neon Wave */}
      {effects.showWave && <BackgroundWave />}

      {/* Layer 6: Animated Lights */}
      {effects.showLights && <BackgroundLights />}

      {/* Layer 7: Floating Blue Particles */}
      {effects.showParticles && <BackgroundParticles count={effects.particleCount} colorPreset="blue" />}

      {/* Layer 8: Vignette & Glass Overlay */}
      {effects.showOverlay && <BackgroundOverlay />}

      {/* Content Container Layer */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default LandingBackground;
