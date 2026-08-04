import React from 'react';
import { CardDescriptionProps } from '../../types/card';

export const CardDescription: React.FC<CardDescriptionProps> = ({
  className = '',
  children,
  ...rest
}) => {
  return (
    <p className={`text-sm text-gray-400 leading-relaxed ${className}`} {...rest}>
      {children}
    </p>
  );
};

export default CardDescription;
