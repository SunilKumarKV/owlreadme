import React from 'react';
import { BackgroundLayerProps } from '../../types/background';

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  children,
  className = '',
  zIndex = 0,
  ariaHidden = true,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex }}
      aria-hidden={ariaHidden}
    >
      {children}
    </div>
  );
};

export default BackgroundLayer;
