import { NavItem } from '../types/navigation';
import { BRANDING } from '@/config/branding';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'features',
    label: 'Features',
    href: '#features',
  },
  {
    id: 'process',
    label: 'How It Works',
    href: '#process',
  },
  {
    id: 'preview',
    label: 'Preview',
    href: '#preview-showcase',
  },
  {
    id: 'faq',
    label: 'FAQ',
    href: '#faq',
  },
  {
    id: 'templates',
    label: 'Templates',
    href: '/templates',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    href: '#pricing',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: BRANDING.socialLinks.github,
    external: true,
  },
];
