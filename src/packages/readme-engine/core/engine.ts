/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type {
  READMEData,
  RoadmapData,
} from '../types';
import {
  renderHeader,
  renderTechStack,
  renderGitHubStats,
  renderSocialLinks,
  renderAchievements,
  renderTemplates,
} from '../sections';
import { renderRegisteredSection } from '../registry';
import { getTheme, getDefaultTheme } from '../../theme-engine';

export type { READMEData, RoadmapData } from '../types';

// Memoization cache mapping cache keys to rendered markdown strings
const renderCache = new Map<string, string>();

/**
 * Renders a section with memoized cache lookup to avoid expensive rebuilds.
 */
export const renderWithCache = (sectionId: string, config: any, context: any): string => {
  const cacheKey = `${sectionId}-${JSON.stringify(config)}-${JSON.stringify(context)}`;
  if (renderCache.has(cacheKey)) {
    return renderCache.get(cacheKey)!;
  }
  const rendered = renderRegisteredSection(sectionId, config, context);
  renderCache.set(cacheKey, rendered);

  // Maintain a fixed cache pool size to prevent memory leaks
  if (renderCache.size > 150) {
    const firstKey = renderCache.keys().next().value;
    if (firstKey) renderCache.delete(firstKey);
  }
  return rendered;
};

/**
 * Generates the complete README markdown content based on the provided configuration data.
 * Executes each active section's renderer in the order defined by the sections manager layout.
 * Falls back to legacy style templates if order layout configurations are missing.
 *
 * @param data The structured profile information data object.
 * @returns The final rendered markdown string.
 */
export const generateREADME = (data: READMEData): string => {
  if (data.sections && data.sections.order && data.sections.order.length > 0) {
    const { order, sections } = data.sections;
    const blocks: string[] = [];

    const activeThemeId = data.template || 'classic';
    const theme = getTheme(activeThemeId) || getDefaultTheme();

    const context = {
      username: data.githubStats?.username || '',
      socials: data.socials || '',
      projects: data.projects || '',
      theme: theme,
    };

    for (const sectionId of order) {
      const sectionConfig = sections[sectionId];
      if (sectionConfig && !sectionConfig.enabled) continue;

      let sectionMarkdown = '';

      if (sectionId === 'header' && (!data.header || !data.header.enabled)) {
        // Fallback header logic when header configuration is absent or disabled
        const avatarMarkdown = data.avatarUrl
          ? `<p align="center">\n  <img src="${data.avatarUrl}" alt="Avatar" width="120" height="120" style="border-radius: 50%;" />\n</p>`
          : '';
        const statsMarkdown = (data.followers !== undefined && data.following !== undefined && data.publicRepos !== undefined)
          ? `<p align="center">\n  👥 <b>Followers:</b> ${data.followers} | 👥 <b>Following:</b> ${data.following} | 📦 <b>Repos:</b> ${data.publicRepos}\n</p>`
          : '';
        sectionMarkdown = [
          avatarMarkdown,
          data.name ? `# ${data.name}` : '',
          data.role ? `## ${data.role}` : '',
          statsMarkdown,
        ].filter(Boolean).join('\n\n');
      } else {
        // Resolve standard section config mapping dynamically
        let config: any = undefined;
        switch (sectionId) {
          case 'header':
            config = data.header;
            break;
          case 'about':
            config = { about: data.about, skills: data.skills };
            break;
          case 'socials':
            config = data.socialLinks;
            break;
          case 'techStack':
            config = data.techStack;
            break;
          case 'stats':
            config = data.githubStats;
            break;
          case 'achievements':
            config = data.achievements;
            break;
          case 'projects':
            config = data.featuredProjects;
            break;
          case 'support':
            config = data.support;
            break;
          case 'quotes':
            config = data.quotes;
            break;
          case 'visitor':
            config = data.standaloneVisitor;
            break;
          case 'custom':
            config = data.customMarkdown;
            break;
          case 'animatedComponents':
            config = data.animatedComponents;
            break;
          default:
            config = (data as any)[sectionId];
        }

        // Call the cached renderer function
        sectionMarkdown = renderWithCache(sectionId, config, context);
      }

      if (sectionMarkdown && sectionMarkdown.trim()) {
        blocks.push(sectionMarkdown.trim());
      }
    }

    return blocks.join('\n\n');
  }

  // Template fallback logic for backwards compatibility
  const headerMarkdown = renderHeader(data.header, data.githubStats?.username || '');
  let body = '';

  if (headerMarkdown) {
    body = [
      headerMarkdown,
      data.skills ? `### Skills\n${data.skills}` : '',
      data.projects ? `### Projects\n${data.projects}` : '',
    ].filter(Boolean).join('\n\n');
  } else {
    body = renderTemplates(data);
  }

  let output = body;
  const githubStatsMarkdown = renderGitHubStats(data.githubStats);
  if (githubStatsMarkdown) {
    output = [output, githubStatsMarkdown].filter(Boolean).join('\n\n');
  }

  const techStackMarkdown = renderTechStack(data.techStack);
  if (techStackMarkdown) {
    output = [output, techStackMarkdown].filter(Boolean).join('\n\n');
  }

  const socialLinksMarkdown = renderSocialLinks(data.socialLinks);
  if (socialLinksMarkdown) {
    output = [output, socialLinksMarkdown].filter(Boolean).join('\n\n');
  }

  const achievementsMarkdown = renderAchievements(data.achievements);
  if (achievementsMarkdown) {
    output = [output, achievementsMarkdown].filter(Boolean).join('\n\n');
  }

  return output;
};

export { renderRegisteredSection as renderSection } from '../registry';

/**
 * Generates the roadmap guide markdown list based on steps data.
 *
 * @param data The roadmap step data configuration.
 * @returns The formatted roadmap markdown list.
 */
export const generateRoadmapMarkdown = (data: RoadmapData): string => {
  const steps = data.steps || [];
  const validSteps = steps.filter((step) => step.trim() !== '');
  return [
    data.title ? `# ${data.title}` : '',
    validSteps.length ? validSteps.map((step, index) => `${index + 1}. ${step}`).join('\n') : '',
  ].filter(Boolean).join('\n\n');
};

/**
 * Combines the profile README markdown and roadmap list markdown with clean spacing.
 *
 * @param readme The generated README profile markdown.
 * @param roadmap The generated roadmap list markdown.
 * @returns The unified combined markdown string.
 */
export const combineMarkdown = (readme: string, roadmap: string): string => {
  return [readme, roadmap].filter(Boolean).join('\n\n');
};
