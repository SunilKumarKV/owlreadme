import React from 'react';
import { BackgroundGlowProps } from '../../types/background';
import { getGlowBlurClass, getGlowColorClasses } from '../../utils/background';
import BackgroundLayer from './BackgroundLayer';

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({
  className = '',
  color = 'dual',
  blurSize = 'xl',
  position = 'hero',
}) => {
  const blurClass = getGlowBlurClass(blurSize);
  const colorClasses = getGlowColorClasses(color);

  const getPositionClass = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-1/2 -translate-x-1/2';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom':
        return 'bottom-0 left-1/2 -translate-x-1/2';
      case 'hero':
      default:
        return 'top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <BackgroundLayer zIndex={2} className={`overflow-hidden ${className}`}>
      {/* Primary Radial Glow Blob */}
      <div
        className={`absolute w-[700px] h-[400px] rounded-full ${colorClasses.primary} ${blurClass} ${getPositionClass()} pointer-events-none transition-all duration-700`}
      />

      {/* Secondary Accent Glow Blob */}
      <div
        className={`absolute w-[500px] h-[300px] rounded-full ${colorClasses.secondary} ${blurClass} ${getPositionClass()} translate-x-1/4 translate-y-1/4 pointer-events-none transition-all duration-700`}
      />
    </BackgroundLayer>
  );
};

export default BackgroundGlow;
