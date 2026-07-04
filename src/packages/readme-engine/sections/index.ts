import { SupportConfig, QuotesConfig, StandaloneVisitorConfig } from '../types';

// Import new renderers
import { renderHeader } from './header';
import { renderAbout } from './about';
import { renderTechStack } from './tech-stack';
import { renderGitHubStats } from './github-stats';
import { renderProjects } from './projects';
import { renderSocialLinks } from './social-links';
import { renderAchievements } from './achievements';
import { renderAnimations } from './animations';
import { renderTemplates } from './templates';
import { renderBadges, renderBadge, renderSupportBadge } from './badges';
import { renderFooter } from './footer';

// Re-export new renderers
export * from './header';
export * from './about';
export * from './tech-stack';
export * from './github-stats';
export * from './projects';
export * from './social-links';
export * from './achievements';
export * from './animations';
export * from './templates';
export * from './badges';
export * from './footer';


// Keep standalone support, quote, and visitor generators in sections index
export function generateSupportMarkdown(config?: SupportConfig): string {
  if (!config || !config.enabled) return '';
  const style = config.style || 'for-the-badge';
  const badges: string[] = [];

  if (config.buyMeACoffeeUsername) {
    const user = config.buyMeACoffeeUsername.trim();
    if (user) {
      badges.push(`[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=${style}&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/${user})`);
    }
  }
  if (config.kofiUsername) {
    const user = config.kofiUsername.trim();
    if (user) {
      badges.push(`[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=${style}&logo=ko-fi&logoColor=white)](https://ko-fi.com/${user})`);
    }
  }

  if (badges.length === 0) return '';
  return `## 💖 Support Me\n\n${badges.join(' &nbsp;&nbsp; ')}`;
}

export function generateQuotesMarkdown(config?: QuotesConfig): string {
  if (!config || !config.enabled) return '';
  const theme = config.theme || 'radical';
  const type = config.quoteType || 'programming';
  return `## 💬 Quote\n\n![Quote](https://github-readme-quotes.vercel.app/api?theme=${theme}&type=${type})`;
}

export function generateStandaloneVisitorMarkdown(config?: StandaloneVisitorConfig, username?: string): string {
  if (!config || !config.enabled) return '';
  const user = (config.username || username || '').trim();
  if (!user) return '';
  const color = config.color || 'green';
  const style = config.style || 'flat';
  const visitorUrl = `https://komarev.com/ghpvc/?username=${user}&color=${color}&style=${style}`;
  return `## 👀 Profile Views\n\n![Visitor Counter](${visitorUrl})`;
}
