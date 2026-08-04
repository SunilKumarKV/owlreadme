import React from 'react';
import { CardBadgeProps } from '../../types/card';

export const CardBadge: React.FC<CardBadgeProps> = ({
  className = '',
  children,
  ...rest
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};

export default CardBadge;
