/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type { READMEComponent } from '../types';
import HeaderComponent from '../components/Header';
import AboutComponent from '../components/About';
import TechStackComponent from '../components/TechStack';
import GitHubStatsComponent from '../components/GitHubStats';
import SocialLinksComponent from '../components/SocialLinks';
import ProjectsComponent from '../components/Projects';
import AchievementsComponent from '../components/Achievements';
import ContactComponent from '../components/Contact';
import QuoteComponent from '../components/Quote';
import SponsorsComponent from '../components/Sponsors';
import TimelineComponent from '../components/Timeline';
import BlogPostsComponent from '../components/BlogPosts';
import DevCardComponent from '../components/DevCard';
import VisitorsComponent from '../components/Visitors';
import SkillsComponent from '../components/Skills';
import MetricsComponent from '../components/Metrics';
import FooterComponent from '../components/Footer';

const componentsList: READMEComponent[] = [
  HeaderComponent,
  AboutComponent,
  TechStackComponent,
  GitHubStatsComponent,
  SocialLinksComponent,
  ProjectsComponent,
  AchievementsComponent,
  ContactComponent,
  QuoteComponent,
  SponsorsComponent,
  TimelineComponent,
  BlogPostsComponent,
  DevCardComponent,
  VisitorsComponent,
  SkillsComponent,
  MetricsComponent,
  FooterComponent,
];

const componentsMap = new Map<string, READMEComponent>(
  componentsList.map((c) => [c.metadata.id.toLowerCase(), c])
);

/**
 * Returns a list of all registered README components.
 */
export const getComponents = (): readonly READMEComponent[] => {
  return componentsList;
};

/**
 * Resolves a registered component by its unique id.
 *
 * @param id The component ID (e.g. 'Header', 'TechStack').
 * @returns The resolved READMEComponent object or undefined.
 */
export const getComponent = (id: string): READMEComponent | undefined => {
  return componentsMap.get(id.toLowerCase());
};

/**
 * Returns a list of unique component categories.
 */
export const getCategories = (): string[] => {
  const categoriesSet = new Set(componentsList.map((c) => c.metadata.category));
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
  if (!term) return [...componentsList];
  return componentsList.filter(
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
