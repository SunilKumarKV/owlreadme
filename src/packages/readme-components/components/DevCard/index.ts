import type { READMEComponent } from '../../types';

export const DevCardComponent: READMEComponent = {
  metadata: {
    id: 'DevCard',
    name: 'Developer Card',
    category: 'Productivity',
    icon: 'Contact',
    description: 'Dynamic profile cards detailing language proficiency metrics or repository stats in SVG format.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => {
    if (!config || !config.enabled) return '';
    const user = (config.username || context?.username || '').trim();
    if (!user) return '';
    const theme = config.theme || 'default';
    const cardUrl = `https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&theme=${theme}`;
    return `## 📇 Dev Card\n\n<p align="center">\n  <a href="https://github.com/${user}">\n    <img src="${cardUrl}" alt="${user}'s Developer Card" />\n  </a>\n</p>`;
  },
  defaultConfig: {
    enabled: true,
    username: '',
    theme: 'default',
  },
};

export default DevCardComponent;
