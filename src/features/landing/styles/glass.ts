export const GLASS_STYLES = {
  card: 'bg-white/70 dark:bg-[#0d1117]/80 backdrop-blur-2xl ring-1 ring-white/30 dark:ring-white/10',
  panel: 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10',
  overlay: 'bg-white/40 dark:bg-black/40 backdrop-blur-md',
  frosted: 'bg-white/80 dark:bg-[#0d1117]/90 backdrop-blur-3xl ring-1 ring-white/40 dark:ring-white/15',
} as const;

export type GlassVariant = keyof typeof GLASS_STYLES;
