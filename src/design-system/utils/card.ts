import { CardPadding, CardVariant } from '../types/card';
import { baseCardClasses, cardHoverClasses, cardPaddingClasses, cardVariantClasses } from '../components/card/CardStyles';
import { CARD_CONFIG } from '../constants/card';

export function getCardClasses(
  variant: CardVariant = CARD_CONFIG.defaultVariant,
  padding: CardPadding = CARD_CONFIG.defaultPadding,
  hover = false,
  clickable = false,
  className = ''
): string {
  return [
    baseCardClasses,
    cardVariantClasses[variant] || cardVariantClasses.default,
    cardPaddingClasses[padding] || cardPaddingClasses.md,
    (hover || clickable) ? cardHoverClasses : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
