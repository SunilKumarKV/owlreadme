/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { StateCreator } from 'zustand';
import { READMEState } from '../readme-store';

export interface InsightsSlice {
  repoAnalysis: any | null;
  aiSuggestions: any | null;
  aiGenerationsCount: number;

  setRepoAnalysis: (analysis: any) => void;
  setAiSuggestions: (suggestions: any) => void;
  incrementAiGenerations: () => void;
}

export const createInsightsSlice: StateCreator<
  READMEState,
  [],
  [],
  InsightsSlice
> = (set) => ({
  repoAnalysis: null,
  aiSuggestions: null,
  aiGenerationsCount: 0,

  setRepoAnalysis: (analysis) =>
    set({ repoAnalysis: analysis } as Partial<READMEState>),

  setAiSuggestions: (suggestions) =>
    set({ aiSuggestions: suggestions } as Partial<READMEState>),

  incrementAiGenerations: () =>
    set((state) => ({
      aiGenerationsCount: state.aiGenerationsCount + 1,
    }) as Partial<READMEState>),
});
