import { generateStandaloneVisitorMarkdown } from '../../../readme-engine/sections';
import type { READMEComponent } from '../../types';

export const VisitorsComponent: READMEComponent = {
  metadata: {
    id: 'Visitors',
    name: 'Profile View Counter',
    category: 'Metrics',
    icon: 'Eye',
    description: 'Dynamic profile hit views tracking count badge.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => generateStandaloneVisitorMarkdown(config, context?.username),
  defaultConfig: {
    enabled: true,
    username: '',
    color: 'green',
    style: 'flat',
  },
};

export default VisitorsComponent;
