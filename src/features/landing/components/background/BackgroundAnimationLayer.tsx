import React from 'react';
import { BackgroundAnimationLayerProps } from '../../types/background-animation';

export const BackgroundAnimationLayer: React.FC<BackgroundAnimationLayerProps> = ({
  children,
  className = '',
  zIndex = 2,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

export default BackgroundAnimationLayer;
