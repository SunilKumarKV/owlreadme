/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { TECHNOLOGY_REGISTRY, CATEGORIES, Technology } from '@/utils/tech-registry';
import type { TechStackConfig } from '../../types';
import { badge as helperBadge, heading } from '../../utils/markdown-helpers';

export const renderTechStack = (config?: TechStackConfig, context?: any): string => {
  if (!config || !config.enabled || !config.selectedIds || config.selectedIds.length === 0) return '';

  const { selectedIds, style, iconOnly, groupByCategory, hideEmptyCategories } = config;
  const activeStyle = style || context?.theme?.badgeStyle || 'flat';

  const selectedTechs = selectedIds
    .map((id) => TECHNOLOGY_REGISTRY.find((t) => t.id === id))
    .filter((t): t is Technology => !!t);

  if (selectedTechs.length === 0) return '';

  const renderBadge = (tech: Technology): string => {
    const label = iconOnly ? '' : encodeURIComponent(tech.name);
    return `![${tech.name}](https://img.shields.io/badge/${label}-${tech.color}?style=${activeStyle}&logo=${tech.logo}&logoColor=${tech.logoColor})`;
  };

  if (groupByCategory) {
    const sections = CATEGORIES.map((category) => {
      const categoryTechs = selectedTechs.filter((t) => t.category === category);
      if (categoryTechs.length === 0) {
        return hideEmptyCategories ? '' : `${heading(3, category)}\n\n*(None selected)*`;
      }
      return `${heading(3, category)}\n\n${categoryTechs.map(renderBadge).join(' ')}`;
    }).filter(Boolean);

    if (sections.length === 0) return '';
    return [`## 💻 Tech Stack`, ...sections].join('\n\n');
  }

  return `## 💻 Tech Stack\n\n${selectedTechs.map(renderBadge).join(' ')}`;
};
