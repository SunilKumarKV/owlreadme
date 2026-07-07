/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { StateCreator } from 'zustand';
import { READMEState } from '../readme-store';
import {
  GitHubStatsConfig,
  TechStackConfig,
  SocialLinksConfig,
  AchievementsConfig,
  HeaderConfig,
  SectionOrderConfig,
  SupportConfig,
  QuotesConfig,
  CustomMarkdownConfig,
  StandaloneVisitorConfig,
  AnimatedComponentsConfig,
  FeaturedProjectsConfig,
  SectionId,
  AnimatedComponentItem,
  DEFAULT_GITHUB_STATS,
  DEFAULT_TECH_STACK,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_HEADER,
  DEFAULT_SECTIONS,
  DEFAULT_SUPPORT,
  DEFAULT_QUOTES,
  DEFAULT_CUSTOM_MARKDOWN,
  DEFAULT_STANDALONE_VISITOR,
  DEFAULT_FEATURED_PROJECTS,
  DEFAULT_ANIMATED_COMPONENTS,
  PRESETS,
} from '../readme-store-types';

export interface SectionsSlice {
  githubStats: GitHubStatsConfig;
  techStack: TechStackConfig;
  socialLinks: SocialLinksConfig;
  achievements: AchievementsConfig;
  header: HeaderConfig;
  sections: SectionOrderConfig;
  support: SupportConfig;
  quotes: QuotesConfig;
  customMarkdown: CustomMarkdownConfig;
  standaloneVisitor: StandaloneVisitorConfig;
  featuredProjects: FeaturedProjectsConfig;
  animatedComponents: AnimatedComponentsConfig;

  setGithubStats: (config: Partial<GitHubStatsConfig>) => void;
  setTechStack: (config: Partial<TechStackConfig>) => void;
  setSocialLinks: (config: Partial<SocialLinksConfig>) => void;
  setAchievements: (config: Partial<AchievementsConfig>) => void;
  setHeader: (config: Partial<HeaderConfig>) => void;
  setSections: (config: Partial<SectionOrderConfig>) => void;
  setSupport: (config: Partial<SupportConfig>) => void;
  setQuotes: (config: Partial<QuotesConfig>) => void;
  setCustomMarkdown: (config: Partial<CustomMarkdownConfig>) => void;
  setStandaloneVisitor: (config: Partial<StandaloneVisitorConfig>) => void;
  setFeaturedProjects: (config: Partial<FeaturedProjectsConfig>) => void;
  setAnimatedComponents: (config: Partial<AnimatedComponentsConfig>) => void;
  updateAnimatedComponentItem: (id: string, updates: Partial<AnimatedComponentItem>) => void;
  reorderAnimatedComponents: (items: AnimatedComponentItem[]) => void;
  applyPreset: (presetName: string) => void;
  applyTemplate: (template: any) => void;
  importReadmeData: (importedData: any, selectedSectionIds: SectionId[]) => void;
}

export const createSectionsSlice: StateCreator<
  READMEState,
  [],
  [],
  SectionsSlice
> = (set) => ({
  githubStats: { ...DEFAULT_GITHUB_STATS },
  techStack: { ...DEFAULT_TECH_STACK },
  socialLinks: { ...DEFAULT_SOCIAL_LINKS },
  achievements: { ...DEFAULT_ACHIEVEMENTS },
  header: { ...DEFAULT_HEADER },
  sections: { ...DEFAULT_SECTIONS },
  support: { ...DEFAULT_SUPPORT },
  quotes: { ...DEFAULT_QUOTES },
  customMarkdown: { ...DEFAULT_CUSTOM_MARKDOWN },
  standaloneVisitor: { ...DEFAULT_STANDALONE_VISITOR },
  featuredProjects: { ...DEFAULT_FEATURED_PROJECTS },
  animatedComponents: { ...DEFAULT_ANIMATED_COMPONENTS },

  setGithubStats: (config) =>
    set((state) => ({
      githubStats: {
        ...state.githubStats,
        ...config,
      },
    }) as Partial<READMEState>),

  setTechStack: (config) =>
    set((state) => ({
      techStack: {
        ...state.techStack,
        ...config,
      },
    }) as Partial<READMEState>),

  setSocialLinks: (config) =>
    set((state) => ({
      socialLinks: {
        ...state.socialLinks,
        ...config,
      },
    }) as Partial<READMEState>),

  setAchievements: (config) =>
    set((state) => ({
      achievements: {
        ...state.achievements,
        ...config,
      },
    }) as Partial<READMEState>),

  setHeader: (config) =>
    set((state) => ({
      header: {
        ...state.header,
        ...config,
      },
    }) as Partial<READMEState>),

  setSections: (config) =>
    set((state) => ({
      sections: {
        ...state.sections,
        ...config,
      },
    }) as Partial<READMEState>),

  setSupport: (config) =>
    set((state) => ({
      support: {
        ...state.support,
        ...config,
      },
    }) as Partial<READMEState>),

  setQuotes: (config) =>
    set((state) => ({
      quotes: {
        ...state.quotes,
        ...config,
      },
    }) as Partial<READMEState>),

  setCustomMarkdown: (config) =>
    set((state) => ({
      customMarkdown: {
        ...state.customMarkdown,
        ...config,
      },
    }) as Partial<READMEState>),

  setStandaloneVisitor: (config) =>
    set((state) => ({
      standaloneVisitor: {
        ...state.standaloneVisitor,
        ...config,
      },
    }) as Partial<READMEState>),

  setFeaturedProjects: (config) =>
    set((state) => ({
      featuredProjects: {
        ...state.featuredProjects,
        ...config,
      },
    }) as Partial<READMEState>),

  setAnimatedComponents: (config) =>
    set((state) => ({
      animatedComponents: {
        ...state.animatedComponents,
        ...config,
      },
    }) as Partial<READMEState>),

  updateAnimatedComponentItem: (id, updates) =>
    set((state) => ({
      animatedComponents: {
        ...state.animatedComponents,
        components: state.animatedComponents.components.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                config: {
                  ...item.config,
                  ...(updates.config || {}),
                },
              }
            : item
        ),
      },
    }) as Partial<READMEState>),

  reorderAnimatedComponents: (items) =>
    set((state) => ({
      animatedComponents: {
        ...state.animatedComponents,
        components: items,
      },
    }) as Partial<READMEState>),

  applyPreset: (presetName) =>
    set((state) => {
      const activeIds = PRESETS[presetName] || PRESETS.minimal;
      const updatedSections = { ...state.sections.sections };

      Object.keys(updatedSections).forEach((key) => {
        const sectionId = key as SectionId;
        updatedSections[sectionId] = {
          ...updatedSections[sectionId],
          enabled: activeIds.includes(sectionId),
        };
      });

      const newOrder = [
        ...activeIds,
        ...state.sections.order.filter((id) => !activeIds.includes(id)),
      ];

      return {
        sections: {
          sections: updatedSections,
          order: newOrder,
        },
      } as Partial<READMEState>;
    }),

  applyTemplate: (template) =>
    set((state) => {
      const activeIds = template.sections || ['header', 'about', 'socials'];
      const updatedSections = { ...state.sections.sections };

      Object.keys(updatedSections).forEach((key) => {
        const sectionId = key as SectionId;
        updatedSections[sectionId] = {
          ...updatedSections[sectionId],
          enabled: activeIds.includes(sectionId),
        };
      });

      const newOrder = [
        ...activeIds,
        ...state.sections.order.filter((id) => !activeIds.includes(id)),
      ];

      return {
        sections: {
          sections: updatedSections,
          order: newOrder,
        },
        name: template.config.header.name || state.name,
        role: template.config.header.title || state.role,
        about: template.config.header.intro || state.about,
        header: {
          ...state.header,
          ...template.config.header,
          enabled: template.config.header.enabled,
        },
        githubStats: {
          ...state.githubStats,
          ...template.config.githubStats,
          enabled: template.config.githubStats.enabled,
        },
        techStack: {
          ...state.techStack,
          ...template.config.techStack,
          enabled: template.config.techStack.enabled,
        },
        socialLinks: {
          ...state.socialLinks,
          ...template.config.socialLinks,
          enabled: template.config.socialLinks.enabled,
        },
        achievements: {
          ...state.achievements,
          ...template.config.achievements,
          enabled: template.config.achievements.enabled,
        },
        quotes: {
          ...state.quotes,
          ...template.config.quotes,
          enabled: template.config.quotes?.enabled || false,
        },
        customMarkdown: template.config.customMarkdown ? {
          ...state.customMarkdown,
          ...template.config.customMarkdown,
        } : state.customMarkdown,
        support: template.config.support ? {
          ...state.support,
          ...template.config.support,
        } : state.support,
        standaloneVisitor: template.config.standaloneVisitor ? {
          ...state.standaloneVisitor,
          ...template.config.standaloneVisitor,
        } : state.standaloneVisitor,
        featuredProjects: template.config.featuredProjects ? {
          ...state.featuredProjects,
          ...template.config.featuredProjects,
        } : state.featuredProjects,
        animatedComponents: template.config.animatedComponents ? {
          ...state.animatedComponents,
          ...template.config.animatedComponents,
        } : state.animatedComponents,
      } as Partial<READMEState>;
    }),

  importReadmeData: (importedData, selectedSectionIds) =>
    set((state) => {
      const updatedSections = { ...state.sections.sections };
      const activeIds = [...selectedSectionIds];

      Object.keys(updatedSections).forEach((key) => {
        const sectionId = key as SectionId;
        updatedSections[sectionId] = {
          ...updatedSections[sectionId],
          enabled: activeIds.includes(sectionId),
        };
      });

      const newOrder = [
        ...activeIds,
        ...state.sections.order.filter((id) => !activeIds.includes(id)),
      ];

      const updates: any = {
        sections: {
          sections: updatedSections,
          order: newOrder,
        },
      };

      if (selectedSectionIds.includes('header')) {
        updates.name = importedData.name || state.name;
        updates.role = importedData.role || state.role;
        updates.about = importedData.about || state.about;
        updates.header = {
          ...state.header,
          ...importedData.header,
          enabled: true,
        };
      }

      if (selectedSectionIds.includes('about')) {
        updates.about = importedData.about || state.about;
      }

      if (selectedSectionIds.includes('socials')) {
        const mergedPlatforms = { ...state.socialLinks.platforms };
        Object.keys(importedData.socialLinks.platforms).forEach((key) => {
          mergedPlatforms[key] = {
            enabled: true,
            value: importedData.socialLinks.platforms[key].value,
          };
        });
        updates.socialLinks = {
          ...state.socialLinks,
          ...importedData.socialLinks,
          platforms: mergedPlatforms,
          enabled: true,
        };
      }

      if (selectedSectionIds.includes('techStack')) {
        updates.techStack = {
          ...state.techStack,
          ...importedData.techStack,
          enabled: true,
        };
      }

      if (selectedSectionIds.includes('stats')) {
        updates.githubStats = {
          ...state.githubStats,
          ...importedData.githubStats,
          enabled: true,
        };
      }

      if (selectedSectionIds.includes('achievements')) {
        updates.achievements = {
          ...state.achievements,
          ...importedData.achievements,
          enabled: true,
        };
      }

      if (selectedSectionIds.includes('quotes')) {
        updates.quotes = {
          ...state.quotes,
          ...importedData.quotes,
          enabled: true,
        };
      }

      if (selectedSectionIds.includes('custom')) {
        updates.customMarkdown = {
          ...state.customMarkdown,
          ...importedData.customMarkdown,
          enabled: true,
        };
      }

      return updates as Partial<READMEState>;
    }),
});
