import React from 'react';
import { CardFooterProps } from '../../types/card';

export const CardFooter: React.FC<CardFooterProps> = ({
  className = '',
  children,
  ...rest
}) => {
  return (
    <div className={`flex items-center justify-between mt-6 pt-4 border-t border-gray-800/60 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default CardFooter;
