import { CardPadding, CardVariant } from '../types/card';

export const CARD_CONFIG = {
  defaultVariant: 'default' as CardVariant,
  defaultPadding: 'md' as CardPadding,
  blurLevels: {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  },
} as const;
