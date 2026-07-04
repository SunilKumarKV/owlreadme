import type { Theme } from '../types';
import classicTheme from '../themes/classic';
import minimalTheme from '../themes/minimal';
import developerTheme from '../themes/developer';
import modernTheme from '../themes/modern';
import terminalTheme from '../themes/terminal';
import glassTheme from '../themes/glass';
import professionalTheme from '../themes/professional';
import openSourceTheme from '../themes/open-source';
import startupTheme from '../themes/startup';
import creativeTheme from '../themes/creative';
import academicTheme from '../themes/academic';
import portfolioTheme from '../themes/portfolio';

const themesList: Theme[] = [
  classicTheme,
  minimalTheme,
  developerTheme,
  modernTheme,
  terminalTheme,
  glassTheme,
  professionalTheme,
  openSourceTheme,
  startupTheme,
  creativeTheme,
  academicTheme,
  portfolioTheme,
];

const themesMap = new Map<string, Theme>(
  themesList.map((t) => [t.id, t])
);

/**
 * Returns a list of all registered themes.
 */
export const getThemes = (): readonly Theme[] => {
  return themesList;
};

/**
 * Resolves a registered theme by its unique id identifier.
 *
 * @param id Theme identifier (e.g. 'classic', 'minimal').
 * @returns The resolved Theme object or undefined.
 */
export const getTheme = (id: string): Theme | undefined => {
  return themesMap.get(id);
};

/**
 * Returns the default fallback theme (Classic).
 */
export const getDefaultTheme = (): Theme => {
  return classicTheme;
};

/**
 * Validates a theme configuration object.
 *
 * @param theme The theme configuration to validate.
 * @returns True if the theme object is valid and safe.
 */
export const validateTheme = (theme: any): boolean => {
  if (!theme || typeof theme !== 'object') return false;
  
  const requiredKeys: (keyof Theme)[] = [
    'id',
    'name',
    'description',
    'author',
    'version',
    'supportedFeatures',
    'formatHeading',
    'formatSpacing',
    'formatSeparator',
    'badgeStyle',
    'formatCodeBlock',
    'formatTable',
    'formatQuote',
    'projectCardLayout',
    'statisticsLayout',
    'socialBadgeLayout',
    'emojiUsage',
  ];

  return requiredKeys.every((key) => key in theme);
};
