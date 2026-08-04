import React from 'react';
import { CardTitleProps } from '../../types/card';

export const CardTitle: React.FC<CardTitleProps> = ({
  as: Component = 'h3',
  className = '',
  children,
  ...rest
}) => {
  return (
    <Component className={`text-lg font-bold tracking-tight text-white ${className}`} {...rest}>
      {children}
    </Component>
  );
};

export default CardTitle;
