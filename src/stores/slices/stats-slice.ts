import { StateCreator } from 'zustand';
import { READMEState } from '../readme-store';
import { ExportHistoryItem } from '../readme-store-types';

export interface StatsSlice {
  readmeExportsCount: number;
  templatesUsedCount: number;
  exportHistory: ExportHistoryItem[];

  incrementReadmeExports: () => void;
  incrementTemplatesUsed: () => void;
  addExportHistoryItem: (format: string, projectName: string) => void;
}

export const createStatsSlice: StateCreator<
  READMEState,
  [],
  [],
  StatsSlice
> = (set) => ({
  readmeExportsCount: 0,
  templatesUsedCount: 0,
  exportHistory: [],

  incrementReadmeExports: () =>
    set((state) => ({
      readmeExportsCount: state.readmeExportsCount + 1,
    }) as Partial<READMEState>),

  incrementTemplatesUsed: () =>
    set((state) => ({
      templatesUsedCount: state.templatesUsedCount + 1,
    }) as Partial<READMEState>),

  addExportHistoryItem: (format, projectName) =>
    set((state) => ({
      exportHistory: [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          format,
          projectName,
        },
        ...(state.exportHistory || []),
      ],
    }) as Partial<READMEState>),
});
