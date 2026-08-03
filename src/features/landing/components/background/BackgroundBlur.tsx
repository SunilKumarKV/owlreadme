import React from 'react';
import { BackgroundBlurProps } from '../../types/background';
import { getBlurLevelClass } from '../../utils/background';
import BackgroundLayer from './BackgroundLayer';

export const BackgroundBlur: React.FC<BackgroundBlurProps> = ({
  className = '',
  blurLevel = 'md',
}) => {
  const blurClass = getBlurLevelClass(blurLevel);

  return (
    <BackgroundLayer
      zIndex={5}
      className={`${blurClass} pointer-events-none opacity-40 dark:opacity-60 ${className}`}
    />
  );
};

export default BackgroundBlur;
