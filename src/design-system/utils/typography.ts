import { TypographyVariant } from '../types/typography';
import { typographyTokens } from '../typography/typography';

export function getTypographyClasses(variant: TypographyVariant): string {
  return typographyTokens[variant] || typographyTokens['body-md'];
}
