/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SectionRegistryEntry, SectionValidationResult } from './section-types';
import { renderHeader } from '../sections/header';
import { renderAbout } from '../sections/about';
import { renderTechStack } from '../sections/tech-stack';
import { renderGitHubStats } from '../sections/github-stats';
import { renderSocialLinks } from '../sections/social-links';
import { renderAchievements } from '../sections/achievements';
import { renderProjects } from '../sections/projects';
import {
  generateSupportMarkdown,
  generateQuotesMarkdown,
  generateStandaloneVisitorMarkdown,
  renderAnimations
} from '../sections';

// Helper utilities for validations
const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidGithubUsername = (value: string): boolean => {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(value);
};

export const RAW_SECTION_METADATA: SectionRegistryEntry[] = [
  {
    id: 'header',
    name: 'Header Profile',
    category: 'profile',
    icon: 'Layout',
    description: 'Banners, avatar positioning, located metrics, typing subtitles, and custom status badges.',
    defaultEnabled: true,
    displayOrder: 10,
    renderer: (config, context) => renderHeader(config, context?.username),
    validator: (config): SectionValidationResult => {
      const errors: string[] = [];
      if (!config?.name?.trim()) errors.push('Developer name is required.');
      if (!config?.title?.trim()) errors.push('Professional role/title is required.');
      if (config?.avatarUrl && !isValidUrl(config.avatarUrl)) {
        errors.push('Avatar URL is invalid.');
      }
      let score = 100;
      if (!config?.name?.trim()) score -= 40;
      if (!config?.title?.trim()) score -= 30;
      if (!config?.intro?.trim()) score -= 20;
      if (!config?.avatarUrl?.trim()) score -= 10;
      return {
        valid: errors.length === 0,
        errors,
        warnings: [],
        completionStatus: Math.max(0, score),
      };
    },
    defaultConfig: {
      enabled: true,
      name: '',
      pronouns: '',
      location: '',
      title: '',
      intro: '',
      alignment: 'center',
      bannerType: 'none',
      bannerTheme: 'gradient',
      bannerText: '',
      typingEnabled: false,
      typingLines: [],
      typingSpeed: 200,
      typingDelay: 1000,
      typingColor: '36BCF7',
      typingCenter: true,
      badges: { openToWork: false, freelance: false, learning: '', building: '' },
      visitorPlacement: 'hidden',
    },
  },
  {
    id: 'about',
    name: 'About Me',
    category: 'profile',
    icon: 'User',
    description: 'Paragraph introducing yourself, your objectives, and lists of core skills.',
    defaultEnabled: true,
    displayOrder: 20,
    renderer: (config) => renderAbout(config?.about, config?.skills),
    validator: (config): SectionValidationResult => {
      const errors: string[] = [];
      if (!config?.about?.trim()) {
        errors.push('About section should not be empty.');
      }
      let score = 100;
      if (!config?.about?.trim()) score -= 60;
      if (!config?.skills?.trim()) score -= 40;
      return {
        valid: errors.length === 0,
        errors,
        warnings: [],
        completionStatus: Math.max(0, score),
      };
    },
    defaultConfig: {
      about: '',
      skills: '',
    },
  },
  {
    id: 'socials',
    name: 'Social Links',
    category: 'profile',
    icon: 'Link',
    description: 'Clickable shields.io contact badges mapping social accounts.',
    defaultEnabled: true,
    displayOrder: 30,
    renderer: (config) => renderSocialLinks(config),
    validator: (config): SectionValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];
      let activePlatforms = 0;
      if (config?.platforms) {
        Object.entries(config.platforms).forEach(([platformId, platformConfig]: [string, any]) => {
          if (platformConfig?.enabled && platformConfig?.value) {
            activePlatforms++;
            const val = platformConfig.value.trim();
            if (val.startsWith('http') && !isValidUrl(val)) {
              errors.push(`Social link URL invalid for ${platformId}.`);
            }
          }
        });
      }
      if (activePlatforms === 0) {
        warnings.push('No active social links specified.');
      }
      return {
        valid: errors.length === 0,
        errors,
        warnings,
        completionStatus: activePlatforms > 0 ? 100 : 0,
      };
    },
    defaultConfig: {
      enabled: false,
      style: 'for-the-badge',
      iconOnly: false,
      platforms: {},
      order: [
        'linkedin', 'portfolio', 'github', 'gitlab',
        'x', 'instagram', 'youtube', 'twitch', 'discord',
        'stackoverflow', 'devto', 'hashnode', 'medium',
        'email', 'gmail', 'buymeacoffee', 'kofi'
      ],
    },
  },
  {
    id: 'techStack',
    name: 'Tech Stack',
    category: 'profile',
    icon: 'Cpu',
    description: 'Categorized badges illustrating language systems and framework stack proficiencies.',
    defaultEnabled: true,
    displayOrder: 40,
    renderer: (config) => renderTechStack(config),
    validator: (config): SectionValidationResult => {
      const warnings: string[] = [];
      const selectedCount = config?.selectedIds?.length || 0;
      if (selectedCount === 0) {
        warnings.push('No tech stack icons selected.');
      }
      return {
        valid: true,
        errors: [],
        warnings,
        completionStatus: selectedCount > 0 ? 100 : 0,
      };
    },
    defaultConfig: {
      enabled: false,
      style: 'for-the-badge',
      iconOnly: false,
      groupByCategory: true,
      hideEmptyCategories: false,
      selectedIds: [],
    },
  },
  {
    id: 'stats',
    name: 'GitHub Stats',
    category: 'activity',
    icon: 'LineChart',
    description: 'Live-updating statistics, streaks, and top language graphics.',
    defaultEnabled: true,
    displayOrder: 50,
    renderer: (config) => renderGitHubStats(config),
    validator: (config): SectionValidationResult => {
      const errors: string[] = [];
      if (config?.enabled && !config?.username?.trim()) {
        errors.push('GitHub username is required for stats.');
      } else if (config?.username && !isValidGithubUsername(config.username)) {
        errors.push('GitHub username is invalid.');
      }
      return {
        valid: errors.length === 0,
        errors,
        warnings: [],
        completionStatus: config?.username?.trim() ? 100 : 0,
      };
    },
    defaultConfig: {
      enabled: false,
      username: '',
      theme: 'default',
      hideBorder: false,
      showIcons: true,
      compactMode: false,
      layout: 'default',
      cardOrder: ['stats', 'languages', 'streak'],
      cardConfigs: { stats: { enabled: true }, languages: { enabled: true }, streak: { enabled: true } },
    },
  },
  {
    id: 'achievements',
    name: 'Achievements & Badges',
    category: 'activity',
    icon: 'Award',
    description: 'GitHub trophies, contribution graph overlays, and activity counters.',
    defaultEnabled: false,
    displayOrder: 60,
    renderer: (config) => renderAchievements(config),
    validator: (): SectionValidationResult => ({ valid: true, errors: [], warnings: [], completionStatus: 100 }),
    defaultConfig: {
      enabled: false,
      username: '',
      widgets: {
        trophy: { enabled: true, theme: 'flat', noFrame: false, noBg: false, rows: 1, columns: 6 },
        visitor: { enabled: true, color: '0078d7', style: 'flat' },
        snake: { enabled: true },
        graph: { enabled: true, theme: 'github', hideBorder: false },
      },
      order: ['trophy', 'visitor', 'graph', 'snake'],
    },
  },
  {
    id: 'projects',
    name: 'Featured Projects',
    category: 'content',
    icon: 'Folder',
    description: 'Highlighting public repositories using grid cards, tables, or item lists.',
    defaultEnabled: true,
    displayOrder: 70,
    renderer: (config) => renderProjects(config),
    validator: (config): SectionValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const projects = config?.projects || [];
      projects.forEach((project: any) => {
        if (project.repoUrl && !isValidUrl(project.repoUrl)) {
          errors.push(`Project URL invalid for ${project.repoName || project.title || project.id}.`);
        }
        if (project.demoUrl && !isValidUrl(project.demoUrl)) {
          errors.push(`Project demo URL invalid for ${project.repoName || project.title || project.id}.`);
        }
      });
      if (projects.length === 0) {
        warnings.push('No featured projects listed.');
      }
      return {
        valid: errors.length === 0,
        errors,
        warnings,
        completionStatus: projects.length > 0 ? 100 : 0,
      };
    },
    defaultConfig: {
      enabled: false,
      projects: [],
      cardStyle: 'minimal',
      layout: '1-col',
      sortMode: 'manual',
      badgeStyle: 'flat',
      showStars: true,
      showForks: true,
      showLanguage: true,
      showTopics: true,
    },
  },
  {
    id: 'support',
    name: 'Support & Sponsorship',
    category: 'content',
    icon: 'Heart',
    description: 'Pledge buttons mapping Buy Me A Coffee and Ko-fi user targets.',
    defaultEnabled: false,
    displayOrder: 80,
    renderer: (config) => generateSupportMarkdown(config),
    validator: (): SectionValidationResult => ({ valid: true, errors: [], warnings: [], completionStatus: 100 }),
    defaultConfig: {
      enabled: false,
      buyMeACoffeeUsername: '',
      kofiUsername: '',
      style: 'for-the-badge',
    },
  },
  {
    id: 'quotes',
    name: 'Daily Quotes',
    category: 'content',
    icon: 'MessageSquare',
    description: 'Dynamic programming quotes badge.',
    defaultEnabled: false,
    displayOrder: 90,
    renderer: (config) => generateQuotesMarkdown(config),
    validator: (): SectionValidationResult => ({ valid: true, errors: [], warnings: [], completionStatus: 100 }),
    defaultConfig: {
      enabled: false,
      theme: 'radical',
      quoteType: 'programming',
    },
  },
  {
    id: 'visitor',
    name: 'Visitor Counter',
    category: 'content',
    icon: 'Eye',
    description: 'Profile views tracking indicator.',
    defaultEnabled: false,
    displayOrder: 100,
    renderer: (config, context) => generateStandaloneVisitorMarkdown(config, context?.username),
    validator: (): SectionValidationResult => ({ valid: true, errors: [], warnings: [], completionStatus: 100 }),
    defaultConfig: {
      enabled: false,
      username: '',
      color: 'green',
      style: 'flat',
    },
  },
  {
    id: 'custom',
    name: 'Custom Markdown',
    category: 'content',
    icon: 'FileCode',
    description: 'Custom markdown slot for raw editor overrides.',
    defaultEnabled: false,
    displayOrder: 110,
    renderer: (config) => config?.content || '',
    validator: (config): SectionValidationResult => {
      const errors: string[] = [];
      if (config?.enabled && (!config?.content || config?.content.trim().length === 0)) {
        errors.push('Custom markdown is enabled but empty.');
      }
      return {
        valid: errors.length === 0,
        errors,
        warnings: [],
        completionStatus: config?.content?.trim() ? 100 : 0,
      };
    },
    defaultConfig: {
      enabled: false,
      content: '',
    },
  },
  {
    id: 'animatedComponents',
    name: 'Animated Details',
    category: 'activity',
    icon: 'Sparkles',
    description: 'Typing overlays, waves headers, dots dividers, and footer grids.',
    defaultEnabled: false,
    displayOrder: 120,
    renderer: (config, context) => renderAnimations(config, context?.username),
    validator: (): SectionValidationResult => ({ valid: true, errors: [], warnings: [], completionStatus: 100 }),
    defaultConfig: {
      enabled: false,
      components: [],
    },
  }
];

export default RAW_SECTION_METADATA;
