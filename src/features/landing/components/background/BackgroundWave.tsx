import React from 'react';
import { BackgroundWaveProps } from '../../types/background';
import { BACKGROUND_CONFIG } from '../../constants/background';
import BackgroundLayer from './BackgroundLayer';

export const BackgroundWave: React.FC<BackgroundWaveProps> = ({
  className = '',
  color = 'currentColor',
}) => {
  return (
    <BackgroundLayer zIndex={4} className={`overflow-hidden opacity-30 dark:opacity-20 ${className}`}>
      <svg
        className="w-full h-auto text-blue-500/40 dark:text-indigo-400/30"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d={BACKGROUND_CONFIG.waveSvgPath}
          fill="none"
          stroke={color === 'currentColor' ? 'url(#wave-gradient)' : color}
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </BackgroundLayer>
  );
};

export default BackgroundWave;
