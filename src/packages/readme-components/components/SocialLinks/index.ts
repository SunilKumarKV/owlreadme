import { renderSocialLinks } from '../../../readme-engine/sections/social-links';
import type { READMEComponent } from '../../types';

export const SocialLinksComponent: READMEComponent = {
  metadata: {
    id: 'SocialLinks',
    name: 'Social Links',
    category: 'Social',
    icon: 'Link',
    description: 'Renders sleek shields.io indicators linked to your email, socials, and contact platforms.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => renderSocialLinks(config, context?.socials, context),
  defaultConfig: {
    enabled: true,
    style: 'flat',
    iconOnly: false,
    platforms: {},
    order: [],
  },
};

export default SocialLinksComponent;
