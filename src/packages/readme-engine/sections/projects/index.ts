import type { FeaturedProjectsConfig } from '../../types';
import { heading, table as helperTable, link as helperLink, badge as helperBadge } from '../../utils/markdown-helpers';

export const renderProjects = (config?: FeaturedProjectsConfig, legacyProjects?: string, context?: any): string => {
  if (!config || !config.enabled || !config.projects || config.projects.length === 0) {
    return legacyProjects ? `${heading(3, 'Projects')}\n${legacyProjects}` : '';
  }

  const { projects, cardStyle, layout, sortMode, badgeStyle, showStars, showForks, showLanguage, showTopics } = config;
  const activeCardStyle = cardStyle || context?.theme?.projectCardLayout || 'minimal';

  let sorted = [...projects];
  if (sortMode === 'stars') {
    sorted = sorted.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
  } else if (sortMode === 'updated') {
    sorted = sorted.sort((a, b) => {
      const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bDate - aDate;
    });
  }

  const lines: string[] = [];
  lines.push('## 📂 Featured Projects');
  lines.push('');

  if (activeCardStyle === 'grid' || layout === 'grid') {
    const cards = sorted.map((p) => {
      const url = p.repoUrl || p.demoUrl;
      const displayName = p.title || p.repoName || 'Project';
      const desc = p.description || '';
      const badges: string[] = [];
      if (showLanguage && p.language) {
        badges.push(helperBadge(p.language, 'blue', badgeStyle));
      }
      if (showStars && p.stars !== undefined) {
        badges.push(helperBadge(`⭐ Stars-${p.stars}`, 'yellow', badgeStyle));
      }
      if (showForks && p.forks !== undefined) {
        badges.push(helperBadge(`🍴 Forks-${p.forks}`, 'orange', badgeStyle));
      }
      const badgeRow = badges.length > 0 ? `\n${badges.join(' ')}` : '';
      return url
        ? `${heading(3, helperLink(displayName, url))}\n${desc}${badgeRow}`
        : `${heading(3, displayName)}\n${desc}${badgeRow}`;
    });
    lines.push(cards.join('\n\n')); } else if (activeCardStyle === 'gprm') {
    const cards = sorted
      .filter((p) => p.repoName && p.repoUrl)
      .map((p) => {
        const match = p.repoUrl!.match(/github\.com\/([^/]+\/[^/]+)/);
        const slug = match ? match[1] : p.repoName;
        return `<a href="${p.repoUrl}">\n  <img align="center" src="https://github-readme-stats.vercel.app/api/pin/?username=${slug?.split('/')[0]}&repo=${slug?.split('/')[1]}&theme=default" />\n</a>`;
      });

    if (layout === '2-col') {
      const pairs: string[] = [];
      for (let i = 0; i < cards.length; i += 2) {
        const row = cards.slice(i, i + 2);
        pairs.push(row.join('\n'));
      }
      lines.push('<p align="center">');
      lines.push(pairs.join('\n\n'));
      lines.push('</p>');
    } else {
      lines.push('<p align="center">');
      lines.push(cards.join('\n\n'));
      lines.push('</p>');
    } } else if (activeCardStyle === 'compact') {
    const rows = sorted.map((p) => {
      const url = p.repoUrl || p.demoUrl;
      const name = p.title || p.repoName || 'Project';
      const desc = p.description || '-';
      const lang = p.language || '-';
      const stars = p.stars !== undefined ? `⭐ ${p.stars}` : '-';
      const forks = p.forks !== undefined ? `🍴 ${p.forks}` : '-';
      const displayName = url ? helperLink(name, url) : name;
      return [displayName, desc, lang, stars, forks];
    });
    const headers = ['Project', 'Description', 'Language', 'Stars', 'Forks'];
    lines.push(helperTable(headers, rows));
  } else if (activeCardStyle === 'minimal') {
    const items = sorted.map((p) => {
      const url = p.repoUrl || p.demoUrl;
      const name = p.title || p.repoName || 'Project';
      const desc = p.description ? ` — ${p.description}` : '';
      const stars = showStars && p.stars !== undefined ? ` ⭐ ${p.stars}` : '';
      return url ? `- ${helperLink(`**${name}**`, url)}${desc}${stars}` : `- **${name}**${desc}${stars}`;
    });
    lines.push(items.join('\n'));
  } else {
    const cards = sorted.map((p) => {
      const url = p.repoUrl || p.demoUrl;
      const name = p.title || p.repoName || 'Project';
      const desc = p.description || '';
      const parts: string[] = [];

      parts.push(url ? `#### ${helperLink(name, url)}` : `#### ${name}`);
      if (desc) parts.push(`> ${desc}`);

      const badges: string[] = [];
      if (showLanguage && p.language) {
        badges.push(helperBadge(p.language, 'blue', badgeStyle));
      }
      if (showStars && p.stars !== undefined) {
        badges.push(helperBadge(`⭐ ${p.stars}-Stars`, 'yellow', badgeStyle));
      }
      if (showForks && p.forks !== undefined) {
        badges.push(helperBadge(`🍴 ${p.forks}-Forks`, 'orange', badgeStyle));
      }
      if (showTopics && p.topics && p.topics.length > 0) {
        p.topics.slice(0, 4).forEach((topic) => {
          badges.push(helperBadge(topic, 'lightgrey', badgeStyle));
        });
      }
      if (badges.length > 0) parts.push(badges.join(' '));
      if (p.demoUrl && p.repoUrl) {
        parts.push(`[🔗 Demo](${p.demoUrl}) · [📦 Repo](${p.repoUrl})`);
      }
      if (p.technologies && p.technologies.length > 0) {
        parts.push(`**Stack:** ${p.technologies.join(', ')}`);
      }
      return parts.join('\n');
    });

    if (layout === '2-col') {
      const tableRows: string[] = [];
      for (let i = 0; i < cards.length; i += 2) {
        const left = cards[i];
        const right = cards[i + 1] || '';
        tableRows.push(`<td valign="top" width="50%">\n\n${left}\n\n</td>\n<td valign="top" width="50%">\n\n${right}\n\n</td>`);
      }
      lines.push('<table><tr>');
      lines.push(tableRows.join('</tr>\n<tr>'));
      lines.push('</tr></table>');
    } else {
      lines.push(cards.join('\n\n'));
    }
  }

  return lines.join('\n');
};
