import type { READMEComponent } from '../../types';

export const MetricsComponent: READMEComponent = {
  metadata: {
    id: 'Metrics',
    name: 'Numerical Stat Counts',
    category: 'Metrics',
    icon: 'TrendingUp',
    description: 'Formatted visual list detailing numerical statistics (stars, followers, repo counts).',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => {
    if (!config || !config.enabled) return '';
    const followers = config.followers ?? context?.followers;
    const following = config.following ?? context?.following;
    const repos = config.publicRepos ?? context?.publicRepos;
    if (followers === undefined && following === undefined && repos === undefined) return '';
    return `<p align="center">\n  👥 <b>Followers:</b> ${followers || 0} | 👥 <b>Following:</b> ${following || 0} | 📦 <b>Repos:</b> ${repos || 0}\n</p>`;
  },
  defaultConfig: {
    enabled: true,
    followers: undefined,
    following: undefined,
    publicRepos: undefined,
  },
};

export default MetricsComponent;
