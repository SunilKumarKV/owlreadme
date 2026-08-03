import React from 'react';
import { BackgroundGradientProps } from '../../types/background';
import BackgroundLayer from './BackgroundLayer';

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  className = '',
  variant = 'hero',
}) => {
  const getGradientClass = () => {
    switch (variant) {
      case 'dark':
        return 'bg-gradient-to-b from-[#090d16] via-[#0d1117] to-[#04060a]';
      case 'glass':
        return 'bg-gradient-to-b from-gray-50/50 via-white/80 to-gray-100/50 dark:from-[#090d16]/70 dark:via-[#0d1117]/90 dark:to-[#04060a]/70';
      case 'hero':
      default:
        return 'bg-gradient-to-b from-blue-50/40 via-white to-gray-50/60 dark:from-[#090d16] dark:via-[#0d1117] dark:to-[#090d16]';
    }
  };

  return (
    <BackgroundLayer zIndex={1} className={`${getGradientClass()} ${className}`} />
  );
};

export default BackgroundGradient;
