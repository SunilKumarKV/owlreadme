export interface PanelMetadata {
  id: string;
  name: string;
  category: string;
}

export const RESTORE_FIELD_LABELS: Record<string, string> = {
  name: 'Header Developer Name',
  role: 'Header Sub-title/Role',
  about: 'Biography Description',
  skills: 'Skills Tags/Categories',
  projects: 'Projects Section (Standard/Featured)',
  socials: 'Social Links Badges',
  avatarUrl: 'GitHub Avatar URL',
  githubStats: 'GitHub Stats Cards Settings',
  techStack: 'Tech Stack Registry',
  socialLinks: 'Social Link Badge Values',
};

export const DEFAULT_RESTORE_FIELDS = {
  name: true,
  role: true,
  about: true,
  skills: true,
  projects: true,
  socials: true,
  avatarUrl: true,
  githubStats: true,
  techStack: true,
  socialLinks: true,
};
