import { renderSocialLinks } from '../../../readme-engine/sections/social-links';
import type { READMEComponent } from '../../types';

export const ContactComponent: READMEComponent = {
  metadata: {
    id: 'Contact',
    name: 'Contact & E-mail',
    category: 'Social',
    icon: 'Mail',
    description: 'Renders custom quick-sends links and chat bubbles mapping to your profiles.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => renderSocialLinks(config, undefined, context),
  defaultConfig: {
    enabled: true,
    style: 'for-the-badge',
    iconOnly: false,
    platforms: {},
    order: [],
  },
};

export default ContactComponent;
