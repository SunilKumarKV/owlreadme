import React, { MouseEvent } from 'react';
import { CardProps } from '../../types/card';
import { getCardClasses } from '../../utils/card';
import useCard from '../../hooks/useCard';

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  children,
  ...rest
}) => {
  const { tabIndex, role, handleKeyDown } = useCard({
    clickable,
    disabled,
    onClick: onClick ? (event) => onClick(event as MouseEvent<HTMLDivElement>) : undefined,
  });

  const combinedClasses = getCardClasses(variant, padding, hover, clickable, className);

  return (
    <div
      tabIndex={tabIndex}
      role={role}
      onKeyDown={handleKeyDown}
      onClick={clickable && !disabled && onClick ? (event) => onClick(event) : onClick}
      aria-disabled={disabled}
      aria-busy={loading}
      className={`${combinedClasses} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Card;
