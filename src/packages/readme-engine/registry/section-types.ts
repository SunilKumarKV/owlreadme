/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type { SectionId } from '../types';

export type SectionCategory =
  | 'profile'      // header, about, socials, tech-stack
  | 'activity'     // github-stats, achievements, animatedComponents
  | 'content'      // projects, support, quotes, custom, visitor
  | 'system';      // templates, badges, footer

export interface SectionRegistryEntry<TConfig = any> {
  id: SectionId;
  name: string;
  category: SectionCategory;
  icon: string; // Lucide icon identifier (string name)
  description: string;
  defaultEnabled: boolean;
  displayOrder: number;
  dependencies?: SectionId[];
  renderer: (config: TConfig, context?: any) => string;
  validator?: (config: TConfig) => boolean;
  serializer?: (config: TConfig) => string;
  metadata?: Record<string, any>; // Extra metadata for AI, plugins, search etc.
}
