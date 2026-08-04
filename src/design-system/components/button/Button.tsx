import React from 'react';
import { ButtonProps } from '../../types/button';
import { getButtonClasses, getButtonIconSize } from '../../utils/button';
import ButtonSpinner from './ButtonSpinner';
import ButtonLink from './ButtonLink';
import useButton from '../../hooks/useButton';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  href,
  target,
  rel,
  type = 'button',
  onClick,
  className = '',
  children,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const { isDisabled, isLoading, handleClick } = useButton({
    onClick,
    disabled,
    loading,
  });

  if (href && !isDisabled) {
    return (
      <ButtonLink
        variant={variant}
        size={size}
        href={href}
        target={target}
        rel={rel}
        fullWidth={fullWidth}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        className={className}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </ButtonLink>
    );
  }

  const spinnerSize = getButtonIconSize(size);
  const combinedClasses = getButtonClasses(variant, size, fullWidth, className);

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      aria-label={ariaLabel}
      className={combinedClasses}
      {...rest}
    >
      {isLoading ? (
        <>
          <ButtonSpinner size={spinnerSize} />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        <>
          {leftIcon}
          {!iconOnly && children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;
