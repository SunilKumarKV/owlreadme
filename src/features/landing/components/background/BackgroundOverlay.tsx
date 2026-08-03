import React from 'react';
import { BackgroundOverlayProps } from '../../types/background';
import BackgroundLayer from './BackgroundLayer';

export const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({
  className = '',
  opacity = 0.4,
}) => {
  return (
    <BackgroundLayer
      zIndex={8}
      className={`bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-black/20 ${className}`}
      style={{ opacity }}
    />
  );
};

export default BackgroundOverlay;
