import { renderProjects } from '../../../readme-engine/sections/projects';
import type { READMEComponent } from '../../types';

export const ProjectsComponent: READMEComponent = {
  metadata: {
    id: 'Projects',
    name: 'Featured Projects',
    category: 'Projects',
    icon: 'Folder',
    description: 'Highlights featured repositories and manual custom projects using dynamic grid-cards, tables, or list styles.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config, context) => renderProjects(config, context?.projects, context),
  defaultConfig: {
    enabled: true,
    projects: [],
    cardStyle: 'minimal',
    layout: '1-col',
    sortMode: 'manual',
    badgeStyle: 'flat',
    showStars: true,
    showForks: true,
    showLanguage: true,
    showTopics: true,
  },
};

export default ProjectsComponent;
