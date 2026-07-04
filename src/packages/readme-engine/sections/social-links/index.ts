import { SOCIAL_PLATFORM_REGISTRY } from '@/utils/social-registry';
import type { SocialLinksConfig } from '../../types';
import { heading, link as helperLink } from '../../utils/markdown-helpers';

export const renderSocialLinks = (config?: SocialLinksConfig, legacySocials?: string, context?: any): string => {
  if (!config || !config.enabled || !config.platforms) {
    return legacySocials ? `${heading(3, 'Socials')}\n${legacySocials}` : '';
  }

  const { style, iconOnly, platforms, order = [] } = config;
  const activeStyle = style || context?.theme?.socialBadgeLayout || 'flat';
  const badges: string[] = [];

  for (const platformId of order) {
    const platform = SOCIAL_PLATFORM_REGISTRY.find((item) => item.id === platformId);
    const platformConfig = platforms[platformId];
    if (!platform || !platformConfig || !platformConfig.enabled || !platformConfig.value.trim()) continue;

    const value = platformConfig.value.trim();
    const targetUrl = value.startsWith('http://') || value.startsWith('https://') || value.startsWith('mailto:')
      ? value
      : platform.urlTemplate.replace('{value}', value);

    const label = iconOnly ? '' : encodeURIComponent(platform.name);
    const badgeUrl = `https://img.shields.io/badge/${label}-${platform.color}?style=${activeStyle}&logo=${platform.logo}&logoColor=${platform.logoColor}`;
    
    // Renders as a clickable image link
    badges.push(`[![${platform.name}](${badgeUrl})](${targetUrl})`);
  }

  if (badges.length === 0) return '';
  return `## 🔗 Social Links & Contact\n\n${badges.join(' ')}`;
};
export default renderSocialLinks;
