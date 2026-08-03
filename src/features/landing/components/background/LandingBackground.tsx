import React from 'react';
import { LandingBackgroundProps } from '../../types/background';
import BackgroundGradient from './BackgroundGradient';
import BackgroundGlow from './BackgroundGlow';
import BackgroundGrid from './BackgroundGrid';
import BackgroundWave from './BackgroundWave';
import BackgroundBlur from './BackgroundBlur';

export const LandingBackground: React.FC<LandingBackgroundProps> = ({
  children,
  className = '',
  variant = 'hero',
  showGrid = true,
  showWave = true,
  showGlow = true,
  showBlur = true,
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Layer 1: Base Gradient */}
      <BackgroundGradient variant={variant} />

      {/* Layer 2: Radial Hero Glow */}
      {showGlow && <BackgroundGlow position="hero" color="dual" />}

      {/* Layer 3: Perspective Grid Floor */}
      {showGrid && <BackgroundGrid perspective opacity={0.15} />}

      {/* Layer 4: Curved Neon Wave */}
      {showWave && <BackgroundWave />}

      {/* Layer 5: Blur Overlay */}
      {showBlur && <BackgroundBlur blurLevel="sm" />}

      {/* Content Container Layer */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default LandingBackground;
