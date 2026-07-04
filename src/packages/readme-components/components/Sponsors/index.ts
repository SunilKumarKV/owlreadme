import { generateSupportMarkdown } from '../../../readme-engine/sections';
import type { READMEComponent } from '../../types';

export const SponsorsComponent: READMEComponent = {
  metadata: {
    id: 'Sponsors',
    name: 'Sponsor & Support',
    category: 'Community',
    icon: 'Heart',
    description: 'Sponsor widgets mapping Buy Me A Coffee or Ko-fi platforms.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config) => generateSupportMarkdown(config),
  defaultConfig: {
    enabled: true,
    buyMeACoffeeUsername: '',
    kofiUsername: '',
    style: 'for-the-badge',
  },
};

export default SponsorsComponent;
