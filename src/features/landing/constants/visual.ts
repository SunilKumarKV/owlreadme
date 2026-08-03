import { GlassVariant } from '../styles/glass';
import { ShadowVariant } from '../styles/shadows';
import { BorderVariant } from '../styles/borders';

export const VISUAL_CONFIG = {
  defaultGlass: 'card' as GlassVariant,
  defaultShadow: 'glow' as ShadowVariant,
  defaultBorder: 'glow' as BorderVariant,
  transitionDuration: 'duration-500',
  reflectionGradient: 'bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent',
} as const;
