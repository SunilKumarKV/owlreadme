import { ButtonSize, ButtonVariant } from '../types/button';

export const BUTTON_CONFIG = {
  defaultVariant: 'primary' as ButtonVariant,
  defaultSize: 'md' as ButtonSize,
  spinnerSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    icon: 16,
  },
} as const;
