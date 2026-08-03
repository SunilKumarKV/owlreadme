import { HeroConfig } from '../types/hero';

export const HERO_CONFIG: HeroConfig = {
  badge: {
    text: 'v1.2.0 Production Release',
    icon: 'sparkles',
    href: '#features',
  },
  headline: {
    prefix: 'Build Beautiful',
    highlight: 'GitHub READMEs',
    suffix: 'In Seconds',
  },
  description:
    'Transform your GitHub profile into an extraordinary developer portfolio. Choose curated sections, customize real-time themes, and export production-ready markdown instantly.',
  input: {
    placeholder: 'Enter your GitHub username',
    ariaLabel: 'GitHub Username Input',
  },
  cta: {
    label: 'Get Started',
  },
  featureChips: [
    {
      id: 'open-source',
      title: '100% Free & Open Source',
      icon: 'shield-check',
      tooltip: 'MIT Licensed, community driven',
    },
    {
      id: 'live-preview',
      title: 'Instant Live Sync',
      icon: 'zap',
      tooltip: 'Real-time markdown preview',
    },
    {
      id: 'no-lock-in',
      title: 'Zero Configuration',
      icon: 'sparkles',
      tooltip: 'Works out of the box with browser local storage',
    },
  ],
};
