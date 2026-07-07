import { StateCreator } from 'zustand';
import { READMEState } from '../readme-store';
import { READMEStyleTemplate } from '../readme-store-types';

export interface ProfileSlice {
  name: string;
  role: string;
  about: string;
  skills: string;
  projects: string;
  socials: string;
  avatarUrl: string;
  followers: number | undefined;
  following: number | undefined;
  publicRepos: number | undefined;
  template: READMEStyleTemplate;
  setName: (value: string) => void;
  setRole: (value: string) => void;
  setAbout: (value: string) => void;
  setSkills: (value: string) => void;
  setProjects: (value: string) => void;
  setSocials: (value: string) => void;
  setAvatarUrl: (value: string) => void;
  setFollowers: (value: number | undefined) => void;
  setFollowing: (value: number | undefined) => void;
  setPublicRepos: (value: number | undefined) => void;
  setTemplate: (value: READMEStyleTemplate) => void;
}

export const createProfileSlice: StateCreator<
  READMEState,
  [],
  [],
  ProfileSlice
> = (set) => ({
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
  setName: (value) => set({ name: value } as Partial<READMEState>),
  setRole: (value) => set({ role: value } as Partial<READMEState>),
  setAbout: (value) => set({ about: value } as Partial<READMEState>),
  setSkills: (value) => set({ skills: value } as Partial<READMEState>),
  setProjects: (value) => set({ projects: value } as Partial<READMEState>),
  setSocials: (value) => set({ socials: value } as Partial<READMEState>),
  setAvatarUrl: (value) => set({ avatarUrl: value } as Partial<READMEState>),
  setFollowers: (value) => set({ followers: value } as Partial<READMEState>),
  setFollowing: (value) => set({ following: value } as Partial<READMEState>),
  setPublicRepos: (value) => set({ publicRepos: value } as Partial<READMEState>),
  setTemplate: (value) => {
    set((state) => ({
      template: value,
      templatesUsedCount: state.templatesUsedCount + 1,
    }) as Partial<READMEState>);
  },
});
