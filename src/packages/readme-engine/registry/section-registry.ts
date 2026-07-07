/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type { SectionRegistryEntry, SectionValidationResult } from './section-types';
import { RAW_SECTION_METADATA } from './section-metadata';

// Create a dynamic registry map for quick, single-source-of-truth lookups
const registryMap = new Map<string, SectionRegistryEntry>();

// Initialize the registry with the default built-in section metadata
RAW_SECTION_METADATA.forEach((entry) => {
  registryMap.set(entry.id, entry);
});

/**
 * Registers a new section in the builder engine.
 *
 * @param entry The section entry to register.
 */
export const registerSection = (entry: SectionRegistryEntry): void => {
  registryMap.set(entry.id, entry);
};

/**
 * Unregisters a section from the builder engine.
 *
 * @param id The unique identifier of the section to remove.
 */
export const unregisterSection = (id: string): void => {
  registryMap.delete(id);
};

/**
 * Returns a list of all registered section metadata objects, sorted by displayOrder.
 */
export const getRegisteredSections = (): readonly SectionRegistryEntry[] => {
  return Array.from(registryMap.values()).sort((a, b) => a.displayOrder - b.displayOrder);
};

/**
 * Returns metadata for a single section.
 */
export const getSectionMetadata = (id: string): SectionRegistryEntry | undefined => {
  return registryMap.get(id);
};

/**
 * Returns the renderer function for a specific section.
 */
export const getRenderer = (id: string): ((config: any, context?: any) => string) | undefined => {
  return registryMap.get(id)?.renderer;
};

/**
 * Returns the validator function for a specific section.
 */
export const getValidator = (id: string): ((config: any) => SectionValidationResult) | undefined => {
  return registryMap.get(id)?.validator;
};

/**
 * Returns default enabled/disabled state structures.
 */
export const getDefaultSections = (): Record<string, { enabled: boolean; collapsed: boolean }> => {
  const result = {} as Record<string, { enabled: boolean; collapsed: boolean }>;
  registryMap.forEach((entry, id) => {
    result[id] = {
      enabled: entry.defaultEnabled,
      collapsed: false,
    };
  });
  return result;
};

/**
 * Invokes the renderer for a registered section.
 */
export const renderRegisteredSection = (id: string, config: any, context?: any): string => {
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
export const validateRegisteredSection = (id: string, config: any): SectionValidationResult => {
  const validator = getValidator(id);
  if (!validator) {
    return {
      valid: true,
      errors: [],
      warnings: [],
      completionStatus: 100,
    }; // Default valid with 100% completion if no validator registered
  }
  try {
    return validator(config);
  } catch (error) {
    console.error(`Error validating section ${id}:`, error);
    return {
      valid: false,
      errors: [`Validation crashed for section ${id}`],
      warnings: [],
      completionStatus: 0,
    };
  }
};
