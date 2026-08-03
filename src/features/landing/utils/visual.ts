import { GLASS_STYLES, GlassVariant } from '../styles/glass';
import { SHADOW_STYLES, ShadowVariant } from '../styles/shadows';
import { BORDER_STYLES, BorderVariant } from '../styles/borders';

export function getGlassStyle(variant: GlassVariant = 'card'): string {
  return GLASS_STYLES[variant] || GLASS_STYLES.card;
}

export function getShadowStyle(variant: ShadowVariant = 'glow'): string {
  return SHADOW_STYLES[variant] || SHADOW_STYLES.glow;
}

export function getBorderStyle(variant: BorderVariant = 'glow'): string {
  return BORDER_STYLES[variant] || BORDER_STYLES.glow;
}
