import { AnnouncementConfig, AnnouncementType } from '../types/announcement';

export const DEFAULT_ANNOUNCEMENT_CONFIG: AnnouncementConfig = {
  id: 'owlreadme-v120-release',
  type: 'release',
  version: 'OwlREADME v1.2.0',
  badge: 'v1.2.0',
  title: 'OwlREADME v1.2.0',
  headline: 'Smarter. Faster. More Powerful.',
  subtitle: 'Smarter. Faster. More Powerful.',
  description: 'Smarter. Faster. More Powerful.',
  buttonText: 'View Changelog →',
  buttonLink: '#changelog',
  ctaLabel: 'View Changelog →',
  ctaHref: '#changelog',
  icon: 'sparkles',
  visible: true,
  dismissible: true,
  dismissKey: 'owlreadme_announcement_v120_dismissed',
};

export const ANNOUNCEMENT_TYPE_STYLES: Record<
  AnnouncementType,
  {
    badge: string;
    border: string;
    bgLight: string;
    bgDark: string;
  }
> = {
  release: {
    badge: 'bg-blue-600 dark:bg-blue-500 text-white',
    border: 'border-blue-500/20 dark:border-blue-500/30',
    bgLight: 'bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-blue-50/90',
    bgDark: 'dark:bg-gradient-to-r dark:from-blue-950/60 dark:via-indigo-950/50 dark:to-blue-950/60',
  },
  feature: {
    badge: 'bg-emerald-600 dark:bg-emerald-500 text-white',
    border: 'border-emerald-500/20 dark:border-emerald-500/30',
    bgLight: 'bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-emerald-50/90',
    bgDark: 'dark:bg-gradient-to-r dark:from-emerald-950/60 dark:via-teal-950/50 dark:to-emerald-950/60',
  },
  maintenance: {
    badge: 'bg-amber-600 dark:bg-amber-500 text-white',
    border: 'border-amber-500/20 dark:border-amber-500/30',
    bgLight: 'bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/90',
    bgDark: 'dark:bg-gradient-to-r dark:from-amber-950/60 dark:via-orange-950/50 dark:to-amber-950/60',
  },
  event: {
    badge: 'bg-purple-600 dark:bg-purple-500 text-white',
    border: 'border-purple-500/20 dark:border-purple-500/30',
    bgLight: 'bg-gradient-to-r from-purple-50/90 via-pink-50/80 to-purple-50/90',
    bgDark: 'dark:bg-gradient-to-r dark:from-purple-950/60 dark:via-pink-950/50 dark:to-purple-950/60',
  },
};
