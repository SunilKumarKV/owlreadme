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
    label: 'Workspace',
    href: '#preview-showcase',
  },
  {
    id: 'faq',
    label: 'FAQ',
    href: '#faq',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: BRANDING.socialLinks.github,
    external: true,
  },
];
