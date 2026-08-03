import { GlowColor, GlowBlurSize, BlurLevel } from '../types/background';
import { GLOW_BLUR_MAP, BLUR_LEVEL_MAP } from '../constants/background';

export function getGlowBlurClass(size: GlowBlurSize = 'xl'): string {
  return GLOW_BLUR_MAP[size] || GLOW_BLUR_MAP.xl;
}

export function getBlurLevelClass(level: BlurLevel = 'md'): string {
  return BLUR_LEVEL_MAP[level] || BLUR_LEVEL_MAP.md;
}

export function getGlowColorClasses(color: GlowColor = 'dual'): { primary: string; secondary: string } {
  switch (color) {
    case 'blue':
      return {
        primary: 'bg-blue-600/15 dark:bg-blue-500/20',
        secondary: 'bg-cyan-500/10 dark:bg-cyan-400/15',
      };
    case 'purple':
      return {
        primary: 'bg-purple-600/15 dark:bg-purple-500/20',
        secondary: 'bg-fuchsia-500/10 dark:bg-fuchsia-400/15',
      };
    case 'indigo':
      return {
        primary: 'bg-indigo-600/15 dark:bg-indigo-500/20',
        secondary: 'bg-violet-500/10 dark:bg-violet-400/15',
      };
    case 'dual':
    default:
      return {
        primary: 'bg-blue-600/15 dark:bg-blue-500/20',
        secondary: 'bg-purple-600/15 dark:bg-purple-500/20',
      };
  }
}
