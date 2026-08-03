export interface TechBadgeConfig {
  id: string;
  label: string;
  icon?: string;
  colorVariant?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'gray';
  tooltip?: string;
  href?: string;
}

export interface ActivityStatItemConfig {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
}

export interface ActivityStatsConfig {
  title?: string;
  rank?: string;
  stats: ActivityStatItemConfig[];
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
  developerTitle?: string;
  commentText?: string;
  techStackTitle?: string;
  techStack: TechBadgeConfig[];
  activityStats: ActivityStatsConfig;
  repositoriesTitle?: string;
  repositories: RepositoryCardConfig[];
}

export interface ReadmeHeadingProps {
  username: string;
  className?: string;
}

export interface ReadmeCommentProps {
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

export interface ActivityStatItemProps {
  stat: ActivityStatItemConfig;
  className?: string;
}

export interface ActivityStatsCardProps {
  config: ActivityStatsConfig;
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

export interface RepositorySectionProps {
  title?: string;
  repositories: RepositoryCardConfig[];
  className?: string;
}

export interface ReadmeContentProps {
  config?: ReadmeContentConfig;
  className?: string;
}
