import { TypographyVariant } from '../types/typography';

export const typographyTokens: Record<TypographyVariant, string> = {
  'display-xl': 'text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none',
  'display-lg': 'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight',
  'heading-xl': 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug',
  'heading-lg': 'text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-snug',
  'heading-md': 'text-lg sm:text-xl lg:text-2xl font-semibold tracking-normal leading-snug',
  'title-lg': 'text-lg font-bold tracking-normal leading-normal',
  'title-md': 'text-base font-semibold tracking-normal leading-normal',
  'title-sm': 'text-sm font-semibold tracking-wide uppercase',
  'body-lg': 'text-lg font-normal tracking-normal leading-relaxed',
  'body-md': 'text-base font-normal tracking-normal leading-normal',
  'body-sm': 'text-sm font-normal tracking-normal leading-normal',
  caption: 'text-xs font-medium tracking-normal leading-normal',
  label: 'text-xs font-semibold tracking-wider uppercase',
  button: 'text-sm font-bold tracking-wide uppercase',
  code: 'font-mono text-xs sm:text-sm leading-relaxed',
  mono: 'font-mono text-sm leading-normal',
};
