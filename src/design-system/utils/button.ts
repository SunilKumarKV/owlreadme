import { ButtonSize, ButtonVariant } from '../types/button';
import { baseButtonClasses, buttonSizeClasses, buttonVariantClasses } from '../components/button/ButtonStyles';
import { BUTTON_CONFIG } from '../constants/button';

export function getButtonClasses(
  variant: ButtonVariant = BUTTON_CONFIG.defaultVariant,
  size: ButtonSize = BUTTON_CONFIG.defaultSize,
  fullWidth = false,
  className = ''
): string {
  return [
    baseButtonClasses,
    buttonVariantClasses[variant] || buttonVariantClasses.primary,
    buttonSizeClasses[size] || buttonSizeClasses.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getButtonIconSize(size: ButtonSize = BUTTON_CONFIG.defaultSize): number {
  return BUTTON_CONFIG.spinnerSizes[size] || 16;
}
