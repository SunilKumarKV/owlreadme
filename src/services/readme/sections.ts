import { GitHubUserProfile, GitHubRepository } from '@/types/github';

export interface SectionDefinition {
  id: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
  requiresData?: (profile?: GitHubUserProfile | null, repos?: GitHubRepository[]) => boolean;
}

export const README_SECTIONS_REGISTRY: Record<string, SectionDefinition> = {
  header: {
    id: 'header',
    title: 'Header & Intro',
    description: 'Avatar, greeting, title, and bio',
    defaultEnabled: true,
  },
  about: {
    id: 'about',
    title: 'About Me',
    description: 'Developer background, role, and location',
    defaultEnabled: true,
  },
  stats: {
    id: 'stats',
    title: 'GitHub Stats Cards',
    description: 'Stars, commits, PRs, issues, and streak badges',
    defaultEnabled: true,
    requiresData: (profile) => Boolean(profile?.login),
  },
  techStack: {
    id: 'techStack',
    title: 'Tech Stack & Tools',
    description: 'Languages, frameworks, databases, and tools',
    defaultEnabled: true,
  },
  projects: {
    id: 'projects',
    title: 'Featured Repositories',
    description: 'Pinned or top starred repositories',
    defaultEnabled: true,
    requiresData: (_, repos) => Boolean(repos && repos.length > 0),
  },
  socials: {
    id: 'socials',
    title: 'Social Links',
    description: 'Website, Twitter/X, email, LinkedIn badges',
    defaultEnabled: true,
  },
  achievements: {
    id: 'achievements',
    title: 'Trophies & Badges',
    description: 'GitHub profile trophies and achievements',
    defaultEnabled: false,
  },
  support: {
    id: 'support',
    title: 'Support & Buy Me A Coffee',
    description: 'Sponsor and donation badges',
    defaultEnabled: false,
  },
};

export function getActiveSectionIds(
  customOrder?: string[],
  disabledSections?: Record<string, boolean>
): string[] {
  const baseOrder = customOrder || Object.keys(README_SECTIONS_REGISTRY);
  return baseOrder.filter((id) => disabledSections?.[id] !== false);
}
