import { BackgroundVariant, GlowColor, GridPattern } from '../types/background';

export const BACKGROUND_CONFIG = {
  defaultVariant: 'hero' as BackgroundVariant,
  defaultGridPattern: 'perspective' as GridPattern,
  defaultGlowColor: 'dual' as GlowColor,
  gridOpacity: 0.15,
  waveSvgPath:
    'M0,160 C320,300 420,0 740,160 C1060,320 1120,40 1440,160 L1440,320 L0,320 Z',
  perspectiveGridSvg: {
    width: 60,
    height: 60,
  },
} as const;

export const GLOW_BLUR_MAP = {
  sm: 'blur-xl',
  md: 'blur-2xl',
  lg: 'blur-3xl',
  xl: 'blur-[120px]',
} as const;

export const BLUR_LEVEL_MAP = {
  sm: 'backdrop-blur-xs',
  md: 'backdrop-blur-sm',
  lg: 'backdrop-blur-md',
  xl: 'backdrop-blur-xl',
} as const;
