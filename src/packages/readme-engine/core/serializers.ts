import { READMEData } from '../types';

export const serializeREADME = (data: READMEData): string => {
  return JSON.stringify(data, null, 2);
};

export const deserializeREADME = (payload: string): READMEData => {
  try {
    const parsed = JSON.parse(payload);
    return parsed as READMEData;
  } catch (error) {
    throw new Error('Failed to parse README payload.');
  }
};

export const serializeRoadmap = (data: { title?: string; steps?: string[] }): string => {
  return JSON.stringify(data, null, 2);
};

export const deserializeRoadmap = (payload: string): { title?: string; steps?: string[] } => {
  try {
    const parsed = JSON.parse(payload);
    return parsed as { title?: string; steps?: string[] };
  } catch (error) {
    throw new Error('Failed to parse roadmap payload.');
  }
};
