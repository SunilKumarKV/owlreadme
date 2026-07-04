import type { GitHubStatsConfig } from '../../types';

export const renderGitHubStats = (stats?: GitHubStatsConfig, context?: any): string => {
  if (!stats || !stats.enabled || !stats.username) return '';

  const { username, theme, hideBorder, showIcons, compactMode, layout, cardOrder, cardConfigs } = stats;
  const activeLayout = layout || context?.theme?.statisticsLayout || 'default';

  const themeParam = theme && theme !== 'default' ? `&theme=${theme}` : '';
  const borderParam = hideBorder ? '&hide_border=true' : '';
  const iconsParam = showIcons ? '&show_icons=true' : '';

  const statsMarkdownBlocks: string[] = [];
  cardOrder.forEach((cardId) => {
    if (cardConfigs[cardId]?.enabled) {
      if (cardId === 'stats') {
        const layoutParam = activeLayout === 'compact' ? '&layout=compact' : '';
        statsMarkdownBlocks.push(
          `<img src="https://github-readme-stats.vercel.app/api?username=${username}${themeParam}${borderParam}${iconsParam}${layoutParam}" alt="GitHub Stats" />`
        );
      } else if (cardId === 'languages') {
        const compactParam = compactMode ? '&layout=compact' : '';
        statsMarkdownBlocks.push(
          `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}${themeParam}${borderParam}${compactParam}" alt="Top Languages" />`
        );
      } else if (cardId === 'streak') {
        statsMarkdownBlocks.push(
          `<img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}${themeParam}${borderParam}" alt="GitHub Streak" />`
        );
      }
    }
  });

  if (statsMarkdownBlocks.length === 0) return '';

  return [
    '### 📊 GitHub Stats',
    '<p align="center">',
    statsMarkdownBlocks.map((block) => `  ${block}`).join('\n  &nbsp;&nbsp;\n'),
    '</p>',
  ].join('\n');
};
