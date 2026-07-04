import { renderHeader } from '../../../readme-engine/sections/header';
import type { READMEComponent } from '../../types';

export const HeaderComponent: READMEComponent = {
  metadata: {
    id: 'Header',
    name: 'Header Profile',
    category: 'Branding',
    icon: 'Layout',
    description: 'Header component featuring custom greeting titles, pronoun descriptors, locations, typing banners, status labels, and view metrics.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => renderHeader(config, context?.username),
  defaultConfig: {
    enabled: true,
    name: '',
    pronouns: '',
    location: '',
    title: '',
    intro: '',
    alignment: 'center',
    bannerType: 'none',
    bannerTheme: 'gradient',
    bannerText: '',
    typingEnabled: false,
    typingLines: [],
    typingSpeed: 200,
    typingDelay: 1000,
    typingColor: '36BCF7',
    typingCenter: true,
    badges: {
      openToWork: false,
      freelance: false,
      learning: '',
      building: '',
    },
    visitorPlacement: 'hidden',
  },
};

export default HeaderComponent;
