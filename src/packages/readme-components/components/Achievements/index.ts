import { renderAchievements } from '../../../readme-engine/sections/achievements';
import type { READMEComponent } from '../../types';

export const AchievementsComponent: READMEComponent = {
  metadata: {
    id: 'Achievements',
    name: 'Achievements & Badges',
    category: 'GitHub',
    icon: 'Award',
    description: 'Displays custom medals, contribution path lines, views trackers, and badges.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config) => renderAchievements(config),
  defaultConfig: {
    enabled: true,
    username: '',
    widgets: {
      trophy: { enabled: true, theme: 'flat', rows: 1, columns: 6 },
      visitor: { enabled: true, color: '0078d7', style: 'flat' },
      snake: { enabled: true },
      graph: { enabled: true, theme: 'github', hideBorder: false },
    },
    order: ['trophy', 'visitor', 'graph', 'snake'],
  },
};

export default AchievementsComponent;
