export const BORDER_STYLES = {
  normal: 'border border-gray-200/80 dark:border-gray-800/80',
  thin: 'border border-gray-200/60 dark:border-gray-800/60',
  gradient: 'border border-gray-300/80 dark:border-gray-700/80',
  glow: 'border border-gray-200/80 dark:border-gray-800/80 hover:border-blue-500/30 dark:hover:border-blue-500/30',
} as const;

export type BorderVariant = keyof typeof BORDER_STYLES;
