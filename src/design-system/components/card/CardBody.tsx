import React from 'react';
import { CardBodyProps } from '../../types/card';

export const CardBody: React.FC<CardBodyProps> = ({
  className = '',
  children,
  ...rest
}) => {
  return (
    <div className={`space-y-3 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default CardBody;
