import type { READMEComponent } from '../../types';

export const SkillsComponent: READMEComponent = {
  metadata: {
    id: 'Skills',
    name: 'Skills Summary',
    category: 'Profile',
    icon: 'CheckSquare',
    description: 'Formatted visual list highlighting your secondary stack proficiencies, tools, or operations.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config) => {
    if (!config || !config.enabled || !config.skillsList || config.skillsList.length === 0) return '';
    return `### 🛠️ Skills\n\n${config.skillsList.map((s: string) => `- ${s}`).join('\n')}`;
  },
  defaultConfig: {
    enabled: true,
    skillsList: [],
  },
};

export default SkillsComponent;
