/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
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
  DEFAULT_ANIMATED_COMPONENTS,
  DEFAULT_FEATURED_PROJECTS,
  READMEField
} from './readme-store-types';

import { createProfileSlice, ProfileSlice } from './slices/profile-slice';
import { createSectionsSlice, SectionsSlice } from './slices/sections-slice';
import { createStatsSlice, StatsSlice } from './slices/stats-slice';
import { createInsightsSlice, InsightsSlice } from './slices/insights-slice';

export * from './readme-store-types';

export interface READMEState extends ProfileSlice, SectionsSlice, StatsSlice, InsightsSlice {
  setField: (field: READMEField, value: any) => void;
  reset: () => void;
}

export const useReadmeStore = create<READMEState>()(
  persist(
    (set, get, store) => ({
      ...createProfileSlice(set, get, store),
      ...createSectionsSlice(set, get, store),
      ...createStatsSlice(set, get, store),
      ...createInsightsSlice(set, get, store),
      setField: (field, value) => set({ [field]: value } as Partial<READMEState>),
      reset: () =>
        set({
          name: '',
          role: '',
          about: '',
          skills: '',
          projects: '',
          socials: '',
          avatarUrl: '',
          followers: undefined,
          following: undefined,
          publicRepos: undefined,
          template: 'minimal',
          readmeExportsCount: 0,
          templatesUsedCount: 0,
          exportHistory: [],
          repoAnalysis: null,
          aiSuggestions: null,
          aiGenerationsCount: 0,
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
        }),
    }),
    { name: 'readme-store' }
  )
);

const useREADMEStore = useReadmeStore;
export default useREADMEStore;