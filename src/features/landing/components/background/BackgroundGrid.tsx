import React from 'react';
import { BackgroundGridProps } from '../../types/background';
import BackgroundLayer from './BackgroundLayer';

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  className = '',
  opacity = 0.12,
  perspective = true,
}) => {
  return (
    <BackgroundLayer zIndex={3} className={`overflow-hidden ${className}`}>
      <div
        className={`w-full h-full ${
          perspective ? '[transform:perspective(1000px)_rotateX(60deg)] origin-top scale-125' : ''
        }`}
        style={{ opacity }}
      >
        <svg
          className="w-full h-full text-gray-900/40 dark:text-gray-100/30"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="landing-bg-grid-pattern"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="grid-fade-mask" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="80%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="grid-mask">
              <rect width="100%" height="100%" fill="url(#grid-fade-mask)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#landing-bg-grid-pattern)"
            mask="url(#grid-mask)"
          />
        </svg>
      </div>
    </BackgroundLayer>
  );
};

export default BackgroundGrid;
