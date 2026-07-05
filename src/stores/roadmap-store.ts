/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type RoadmapField = 'title' | 'steps' | 'template' | 'roadmapExportsCount' | 'templatesUsedCount';

interface RoadmapState {
  title: string;
  steps: string[];
  template: string;
  roadmapExportsCount: number;
  templatesUsedCount: number;
  setField: (field: RoadmapField, value: any) => void;
  setTemplate: (template: string) => void;
  incrementRoadmapExports: () => void;
  incrementTemplatesUsed: () => void;
  reset: () => void;
}

const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      title: '',
      steps: [],
      template: '',
      roadmapExportsCount: 0,
      templatesUsedCount: 0,
      setField: (field, value) => set({ [field]: value } as Partial<RoadmapState>),
      setTemplate: (template) => {
        set((state) => ({
          template,
          templatesUsedCount: state.templatesUsedCount + 1,
        }));
      },
      incrementRoadmapExports: () => set((state) => ({ roadmapExportsCount: state.roadmapExportsCount + 1 })),
      incrementTemplatesUsed: () => set((state) => ({ templatesUsedCount: state.templatesUsedCount + 1 })),
      reset: () =>
        set({
          title: '',
          steps: [],
          template: '',
          roadmapExportsCount: 0,
          templatesUsedCount: 0,
        }),
    }),
    { name: 'roadmap-store' }
  )
);

export default useRoadmapStore;