export interface TechBadgeConfig {
  id: string;
  label: string;
  icon?: string;
  colorVariant?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'gray';
  tooltip?: string;
  href?: string;
}

export interface GithubStatConfig {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
}

export interface GithubStatsConfig {
  title?: string;
  rank?: string;
  stats: GithubStatConfig[];
}

export interface RepositoryCardConfig {
  id: string;
  name: string;
  description: string;
  stars: number;
  language: string;
  visibility?: string;
  forks?: number;
  updatedAt?: string;
  url?: string;
}

export interface ReadmeContentConfig {
  username: string;
  name?: string | null;
  avatarUrl?: string;
  developerTitle?: string;
  commentText?: string;
  techStackTitle?: string;
  techStack: TechBadgeConfig[];
  githubStats: GithubStatsConfig;
  repositoriesTitle?: string;
  repositories: RepositoryCardConfig[];
}

export interface ReadmeHeadingProps {
  username: string;
  name?: string | null;
  avatarUrl?: string;
  className?: string;
}

export interface DeveloperCommentProps {
  comment?: string;
  className?: string;
}

export interface TechBadgeProps {
  badge: TechBadgeConfig;
  className?: string;
}

export interface TechBadgeGroupProps {
  badges: TechBadgeConfig[];
  className?: string;
}

export interface TechStackSectionProps {
  title?: string;
  badges: TechBadgeConfig[];
  className?: string;
}

export interface GithubStatProps {
  stat: GithubStatConfig;
  className?: string;
}

export interface GithubStatsCardProps {
  config: GithubStatsConfig;
  className?: string;
}

export interface RepositoryCardHeaderProps {
  name: string;
  visibility?: string;
  url?: string;
  className?: string;
}

export interface RepositoryCardFooterProps {
  language: string;
  stars: number;
  forks?: number;
  updatedAt?: string;
  className?: string;
}

export interface RepositoryCardProps {
  repo: RepositoryCardConfig;
  className?: string;
}

export interface FeaturedRepositoriesProps {
  title?: string;
  repositories: RepositoryCardConfig[];
  className?: string;
}

export interface ReadmeContentProps {
  config?: ReadmeContentConfig;
  className?: string;
}
