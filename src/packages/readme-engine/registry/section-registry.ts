/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type { SectionId } from '../types';
import type { SectionRegistryEntry } from './section-types';
import { RAW_SECTION_METADATA } from './section-metadata';

// Create a static registry map for quick, single-source-of-truth lookups
const registryMap = new Map<SectionId, SectionRegistryEntry>(
  RAW_SECTION_METADATA.map((entry) => [entry.id, entry])
);

/**
 * Returns a list of all registered section metadata objects, sorted by displayOrder.
 */
export const getRegisteredSections = (): readonly SectionRegistryEntry[] => {
  return [...RAW_SECTION_METADATA].sort((a, b) => a.displayOrder - b.displayOrder);
};

/**
 * Returns metadata for a single section.
 */
export const getSectionMetadata = (id: SectionId): SectionRegistryEntry | undefined => {
  return registryMap.get(id);
};

/**
 * Returns the renderer function for a specific section.
 */
export const getRenderer = (id: SectionId): ((config: any, context?: any) => string) | undefined => {
  return registryMap.get(id)?.renderer;
};

/**
 * Returns the validator function for a specific section.
 */
export const getValidator = (id: SectionId): ((config: any) => boolean) | undefined => {
  return registryMap.get(id)?.validator;
};

/**
 * Returns default enabled/disabled state structures.
 */
export const getDefaultSections = (): Record<SectionId, { enabled: boolean; collapsed: boolean }> => {
  const result = {} as Record<SectionId, { enabled: boolean; collapsed: boolean }>;
  RAW_SECTION_METADATA.forEach((entry) => {
    result[entry.id] = {
      enabled: entry.defaultEnabled,
      collapsed: false,
    };
  });
  return result;
};

/**
 * Invokes the renderer for a registered section.
 */
export const renderRegisteredSection = (id: SectionId, config: any, context?: any): string => {
  const renderer = getRenderer(id);
  if (!renderer) return '';
  try {
    return renderer(config, context);
  } catch (error) {
    console.error(`Error rendering section ${id}:`, error);
    return '';
  }
};

/**
 * Invokes the validator for a registered section.
 */
export const validateRegisteredSection = (id: SectionId, config: any): boolean => {
  const validator = getValidator(id);
  if (!validator) return true; // Default true if no validator registered
  try {
    return validator(config);
  } catch (error) {
    console.error(`Error validating section ${id}:`, error);
    return false;
  }
};
