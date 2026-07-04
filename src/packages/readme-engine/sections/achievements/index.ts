import type { AchievementsConfig } from '../../types';

export const renderAchievements = (config?: AchievementsConfig): string => {
  if (!config || !config.enabled || !config.username) return '';

  const user = config.username.trim();
  if (!user) return '';

  const { widgets, order = ['trophy', 'visitor', 'graph', 'snake'] } = config;
  const renderedWidgets: string[] = [];

  for (const widgetId of order) {
    const wConfig = widgets[widgetId];
    if (!wConfig || !wConfig.enabled) continue;

    if (widgetId === 'trophy') {
      const trophyTheme = wConfig.theme || 'flat';
      const trophyRows = wConfig.rows || 1;
      const trophyColumns = wConfig.columns || 6;
      const trophyUrl = `https://github-profile-trophy.vercel.app/?username=${user}&theme=${trophyTheme}${wConfig.noFrame ? '&no-frame=true' : ''}${wConfig.noBg ? '&no-bg=true' : ''}${trophyRows ? `&row=${trophyRows}` : ''}${trophyColumns ? `&column=${trophyColumns}` : ''}`;
      renderedWidgets.push(`### 🏆 GitHub Trophies\n\n[![GitHub Trophies](${trophyUrl})](https://github.com/ryo-ma/github-profile-trophy)`);
    } else if (widgetId === 'visitor') {
      const visitorColor = wConfig.color || '0078d7';
      const visitorStyle = wConfig.style || 'flat';
      const visitorUrl = `https://komarev.com/ghpvc/?username=${user}&color=${visitorColor}&style=${visitorStyle}`;
      renderedWidgets.push(`### 👀 Profile Views\n\n![Profile Views](${visitorUrl})`);
    } else if (widgetId === 'snake') {
      const snakeUrl = `https://raw.githubusercontent.com/${user}/${user}/output/github-contribution-grid-snake.svg`;
      renderedWidgets.push(`### 🐍 Contribution Snake\n\n![Contribution Snake](${snakeUrl})`);
    } else if (widgetId === 'graph') {
      const graphTheme = wConfig.theme || 'github';
      const graphUrl = `https://github-readme-activity-graph.vercel.app/graph?username=${user}&theme=${graphTheme}${wConfig.hideBorder ? '&hide_border=true' : ''}`;
      renderedWidgets.push(`### 📈 Activity Graph\n\n[![Activity Graph](${graphUrl})](https://github.com/Ashutosh00710/github-readme-activity-graph)`);
    }
  }

  if (renderedWidgets.length === 0) return '';

  return `## 🏆 GitHub Achievements\n\n${renderedWidgets.join('\n\n')}`;
};
