/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type { READMEComponent } from '../types';
import { getRegisteredSections, getSectionMetadata } from '@/packages/readme-engine';

/**
 * Helper to map SectionCategory to legacy visual category strings
 */
const mapCategory = (cat: string): string => {
  switch (cat) {
    case 'profile':
      return 'Branding';
    case 'activity':
      return 'Activity';
    case 'content':
      return 'Content';
    default:
      return 'Custom';
  }
};

/**
 * Returns a list of all registered README components dynamically compiled from the Section Registry.
 */
export const getComponents = (): readonly READMEComponent[] => {
  return getRegisteredSections().map((section) => ({
    metadata: {
      id: section.id,
      name: section.name,
      category: mapCategory(section.category),
      icon: section.icon,
      description: section.description,
      author: 'OwlREADME Team',
      version: '2.0.0',
    },
    renderer: section.renderer,
    validator: section.validator ? (config: any) => section.validator!(config).valid : undefined,
    defaultConfig: section.defaultConfig || {},
  }));
};

/**
 * Resolves a registered component by its unique id dynamically.
 *
 * @param id The component ID (e.g. 'Header', 'TechStack').
 * @returns The resolved READMEComponent object or undefined.
 */
export const getComponent = (id: string): READMEComponent | undefined => {
  // Support both PascalCase and camelCase lookups
  const resolvedId = id.charAt(0).toLowerCase() + id.slice(1);
  const section = getSectionMetadata(id) || getSectionMetadata(resolvedId);
  if (!section) return undefined;
  return {
    metadata: {
      id: section.id,
      name: section.name,
      category: mapCategory(section.category),
      icon: section.icon,
      description: section.description,
      author: 'OwlREADME Team',
      version: '2.0.0',
    },
    renderer: section.renderer,
    validator: section.validator ? (config: any) => section.validator!(config).valid : undefined,
    defaultConfig: section.defaultConfig || {},
  };
};

/**
 * Returns a list of unique component categories.
 */
export const getCategories = (): string[] => {
  const categoriesSet = new Set(getComponents().map((c) => c.metadata.category));
  return Array.from(categoriesSet).sort();
};

/**
 * Searches components by display name, category, or description.
 *
 * @param query Search keyword string.
 * @returns A filtered list of matching components.
 */
export const searchComponents = (query: string): READMEComponent[] => {
  const term = query.toLowerCase().trim();
  const list = getComponents();
  if (!term) return [...list];
  return list.filter(
    (c) =>
      c.metadata.name.toLowerCase().includes(term) ||
      c.metadata.category.toLowerCase().includes(term) ||
      c.metadata.description.toLowerCase().includes(term)
  );
};

/**
 * Gets the default configuration object for a component.
 *
 * @param id The component ID.
 * @returns The defaultConfig object or undefined.
 */
export const getDefaultConfiguration = (id: string): any => {
  return getComponent(id)?.defaultConfig;
};
