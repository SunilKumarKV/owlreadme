/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */

export type SectionCategory =
  | 'profile'      // header, about, socials, tech-stack
  | 'activity'     // github-stats, achievements, animatedComponents
  | 'content'      // projects, support, quotes, custom, visitor
  | 'system';      // templates, badges, footer

export interface SectionValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  completionStatus?: number; // 0 to 100 representing completion score
}

export interface SectionRegistryEntry<TConfig = any> {
  id: string;
  name: string;
  category: SectionCategory;
  icon: string; // Lucide icon identifier (string name)
  description: string;
  defaultEnabled: boolean;
  displayOrder: number;
  dependencies?: string[];
  renderer: (config: TConfig, context?: any) => string;
  validator?: (config: TConfig) => SectionValidationResult;
  serializer?: (config: TConfig) => string;
  defaultConfig?: TConfig;
  metadata?: Record<string, any>; // Extra metadata for AI, plugins, search etc.
}
