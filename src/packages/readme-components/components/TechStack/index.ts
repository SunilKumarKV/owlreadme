import { renderTechStack } from '../../../readme-engine/sections/tech-stack';
import type { READMEComponent } from '../../types';

export const TechStackComponent: READMEComponent = {
  metadata: {
    id: 'TechStack',
    name: 'Tech Stack',
    category: 'Profile',
    icon: 'Cpu',
    description: 'Displays technological and framework badge listings dynamically categorized or formatted.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => renderTechStack(config, context),
  defaultConfig: {
    enabled: true,
    style: 'flat',
    iconOnly: false,
    groupByCategory: false,
    hideEmptyCategories: false,
    selectedIds: [],
  },
};

export default TechStackComponent;
