/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
export type READMEStyleTemplate = 'minimal' | 'professional' | 'developer' | 'open-source' | 'portfolio';

export type SectionId =
  | 'header'
  | 'about'
  | 'socials'
  | 'techStack'
  | 'stats'
  | 'achievements'
  | 'projects'
  | 'support'
  | 'quotes'
  | 'visitor'
  | 'custom'
  | 'animatedComponents';

export interface SectionConfig {
  id: SectionId;
  name: string;
  enabled: boolean;
  collapsed: boolean;
}

export interface SectionOrderConfig {
  sections: Record<SectionId, SectionConfig>;
  order: SectionId[];
}

export interface SocialPlatformConfig {
  enabled: boolean;
  value: string;
}

export interface GitHubStatsConfig {
  enabled: boolean;
  username: string;
  theme: string;
  hideBorder: boolean;
  showIcons: boolean;
  compactMode: boolean;
  layout: 'default' | 'compact';
  cardOrder: ('stats' | 'languages' | 'streak')[];
  cardConfigs: Record<'stats' | 'languages' | 'streak', { enabled: boolean }>;
}

export interface TechStackConfig {
  enabled: boolean;
  style: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
  iconOnly: boolean;
  groupByCategory: boolean;
  hideEmptyCategories: boolean;
  selectedIds: string[];
}

export interface SocialLinksConfig {
  enabled: boolean;
  style: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
  iconOnly: boolean;
  platforms: Record<string, SocialPlatformConfig>;
  order: string[];
}

export interface AchievementWidgetConfig {
  enabled: boolean;
  theme?: string;
  color?: string;
  style?: string;
  hideBorder?: boolean;
  noFrame?: boolean;
  noBg?: boolean;
  rows?: number;
  columns?: number;
}

export interface AchievementsConfig {
  enabled: boolean;
  username: string;
  widgets: Record<'trophy' | 'visitor' | 'snake' | 'graph', AchievementWidgetConfig>;
  order: ('trophy' | 'visitor' | 'snake' | 'graph')[];
}

export interface HeaderConfig {
  enabled: boolean;
  name: string;
  pronouns: string;
  location: string;
  title: string;
  intro: string;
  alignment: 'left' | 'center' | 'right';
  bannerType: 'none' | 'capsule' | 'wave' | 'gradient';
  bannerTheme: string;
  bannerText: string;
  typingEnabled: boolean;
  typingLines: string[];
  typingSpeed: number;
  typingDelay: number;
  typingColor: string;
  typingCenter: boolean;
  badges: {
    openToWork: boolean;
    freelance: boolean;
    learning: string;
    building: string;
  };
  visitorPlacement: 'top' | 'bottom' | 'hidden';
}

export interface SupportConfig {
  enabled: boolean;
  buyMeACoffeeUsername: string;
  kofiUsername: string;
  style: 'flat' | 'flat-square' | 'for-the-badge';
}

export interface QuotesConfig {
  enabled: boolean;
  theme: string;
  quoteType: 'programming' | 'funny' | 'motivational';
}

export interface CustomMarkdownConfig {
  enabled: boolean;
  content: string;
}

export interface StandaloneVisitorConfig {
  enabled: boolean;
  username: string;
  color: string;
  style: string;
}

export interface AnimatedComponentItem {
  id: string;
  type: 'typing' | 'waveHeader' | 'divider' | 'snake' | 'decorative' | 'badge' | 'footer';
  enabled: boolean;
  title: string;
  config: Record<string, any>;
}

export interface AnimatedComponentsConfig {
  enabled: boolean;
  components: AnimatedComponentItem[];
}

export interface FeaturedProject {
  id: string;
  source: 'github' | 'manual';
  repoName?: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
  topics?: string[];
  repoUrl?: string;
  updatedAt?: string;
  title?: string;
  demoUrl?: string;
  technologies?: string[];
  pinned?: boolean;
}

export interface FeaturedProjectsConfig {
  enabled: boolean;
  projects: FeaturedProject[];
  cardStyle: 'minimal' | 'modern' | 'compact' | 'grid' | 'gprm';
  layout: '1-col' | '2-col' | 'grid';
  sortMode: 'manual' | 'stars' | 'updated';
  badgeStyle: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
  showStars: boolean;
  showForks: boolean;
  showLanguage: boolean;
  showTopics: boolean;
}

export interface READMEData {
  name?: string;
  role?: string;
  about?: string;
  skills?: string;
  projects?: string;
  socials?: string;
  avatarUrl?: string;
  followers?: number;
  following?: number;
  publicRepos?: number;
  template?: READMEStyleTemplate;
  githubStats?: GitHubStatsConfig;
  techStack?: TechStackConfig;
  socialLinks?: SocialLinksConfig;
  achievements?: AchievementsConfig;
  header?: HeaderConfig;
  sections?: SectionOrderConfig;
  support?: SupportConfig;
  quotes?: QuotesConfig;
  customMarkdown?: CustomMarkdownConfig;
  standaloneVisitor?: StandaloneVisitorConfig;
  featuredProjects?: FeaturedProjectsConfig;
  animatedComponents?: AnimatedComponentsConfig;
}

export interface RoadmapData {
  title?: string;
  steps?: string[];
}
