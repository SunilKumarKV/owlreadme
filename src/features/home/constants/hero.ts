import { HeroConfig } from '../types/hero';

export const HERO_CONFIG: HeroConfig = {
  badge: {
    text: '✨ Introducing OwlREADME v1.2.0',
    icon: 'sparkles',
    href: '#features',
  },
  headline: {
    prefix: 'Your GitHub Profile Automated in ',
    highlight: 'Seconds.',
    suffix: '',
  },
  description:
    'Professional GitHub README Builder for developers. Build custom layout structures, sync your repository metrics, and present your developer portfolio cleanly.',
  input: {
    placeholder: 'Enter GitHub username',
    ariaLabel: 'Enter GitHub username',
  },
  cta: {
    label: 'Get Started →',
  },
  featureChips: [
    {
      id: 'free-open-source',
      title: 'Free & Open Source',
      icon: 'shield-check',
      tooltip: '100% Free & Open Source',
    },
    {
      id: 'local-storage',
      title: 'Local Browser Storage',
      icon: 'database',
      tooltip: 'Privacy first local storage',
    },
    {
      id: 'one-click-export',
      title: '1-Click Export Pack',
      icon: 'zap',
      tooltip: 'Export production markdown instantly',
    },
  ],
};
