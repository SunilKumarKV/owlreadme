import { renderFooter } from '../../../readme-engine/sections/footer';
import type { READMEComponent } from '../../types';

export const FooterComponent: READMEComponent = {
  metadata: {
    id: 'Footer',
    name: 'Wave Footer',
    category: 'Branding',
    icon: 'ChevronDown',
    description: 'A waving capsule footer banner with custom typography rules.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config) => renderFooter(config?.text, config?.theme),
  defaultConfig: {
    enabled: true,
    text: '',
    theme: 'auto',
  },
};

export default FooterComponent;
