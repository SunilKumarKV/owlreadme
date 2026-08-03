export const SHADOW_STYLES = {
  sm: 'shadow-xs shadow-gray-900/5 dark:shadow-black/20',
  md: 'shadow-md shadow-gray-900/5 dark:shadow-black/40',
  lg: 'shadow-xl shadow-gray-900/10 dark:shadow-black/60',
  glow: 'shadow-2xl shadow-blue-500/10 dark:shadow-indigo-500/20 hover:shadow-blue-500/20 dark:hover:shadow-indigo-500/30',
  hover: 'transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/15 dark:hover:shadow-indigo-500/25',
} as const;

export type ShadowVariant = keyof typeof SHADOW_STYLES;
