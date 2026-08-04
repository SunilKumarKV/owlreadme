import React, { ReactNode } from 'react';

export interface ButtonIconProps {
  children: ReactNode;
  className?: string;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  children,
  className = '',
}) => {
  return <span className={`inline-flex items-center shrink-0 ${className}`}>{children}</span>;
};

export default ButtonIcon;
