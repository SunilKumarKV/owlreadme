import React from 'react';
import { ButtonProps } from '../../types/button';
import { baseButtonClasses, buttonSizeClasses, buttonVariantClasses } from './ButtonStyles';

export const ButtonLink: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const combinedClasses = [
    baseButtonClasses,
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      href={href}
      target={target}
      rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
      className={combinedClasses}
      aria-label={ariaLabel}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </a>
  );
};

export default ButtonLink;
