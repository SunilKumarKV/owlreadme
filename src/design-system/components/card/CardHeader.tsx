import React from 'react';
import { CardHeaderProps } from '../../types/card';

export const CardHeader: React.FC<CardHeaderProps> = ({
  className = '',
  children,
  ...rest
}) => {
  return (
    <div className={`flex items-center justify-between space-x-4 mb-4 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default CardHeader;
