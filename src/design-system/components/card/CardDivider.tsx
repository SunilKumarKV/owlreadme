import React from 'react';
import { CardDividerProps } from '../../types/card';

export const CardDivider: React.FC<CardDividerProps> = ({
  className = '',
  ...rest
}) => {
  return <div className={`w-full h-px bg-gray-800/80 my-4 ${className}`} {...rest} />;
};

export default CardDivider;
