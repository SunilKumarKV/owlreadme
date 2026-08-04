import React from 'react';
import { ButtonGroupProps } from '../../types/button';

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  orientation = 'horizontal',
  spacing = 'sm',
  className = '',
  children,
}) => {
  const orientationClass = orientation === 'vertical' ? 'flex-col' : 'flex-row';
  const spacingClasses = {
    none: 'space-x-0 space-y-0',
    sm: orientation === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: orientation === 'vertical' ? 'space-y-3' : 'space-x-3',
    lg: orientation === 'vertical' ? 'space-y-4' : 'space-x-4',
  };

  return (
    <div
      className={`inline-flex items-center ${orientationClass} ${spacingClasses[spacing]} ${className}`}
      role="group"
    >
      {children}
    </div>
  );
};

export default ButtonGroup;
