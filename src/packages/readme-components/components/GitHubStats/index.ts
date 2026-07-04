import { renderGitHubStats } from '../../../readme-engine/sections/github-stats';
import type { READMEComponent } from '../../types';

export const GitHubStatsComponent: READMEComponent = {
  metadata: {
    id: 'GitHubStats',
    name: 'GitHub Stats',
    category: 'GitHub',
    icon: 'LineChart',
    description: 'Dynamic live-updating graphic widgets mapping your contributions, stats cards, language meters, and streaks.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => renderGitHubStats(config, context),
  defaultConfig: {
    enabled: true,
    username: '',
    theme: 'default',
    hideBorder: false,
    showIcons: true,
    compactMode: false,
    layout: 'default',
    cardOrder: ['stats', 'languages', 'streak'],
    cardConfigs: {
      stats: { enabled: true },
      languages: { enabled: true },
      streak: { enabled: true },
    },
  },
};

export default GitHubStatsComponent;
