import { renderAbout } from '../../../readme-engine/sections/about';
import type { READMEComponent } from '../../types';

export const AboutComponent: READMEComponent = {
  metadata: {
    id: 'About',
    name: 'About Me',
    category: 'Profile',
    icon: 'User',
    description: 'A friendly written introduction of your professional journey and summary list of your skills.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config) => renderAbout(config?.about, config?.skills),
  defaultConfig: {
    about: '',
    skills: '',
  },
};

export default AboutComponent;
