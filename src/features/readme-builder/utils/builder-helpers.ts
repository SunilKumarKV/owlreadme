import useReadmeStore from '@/stores/readme-store';

export interface PanelWidthsParams {
  fullscreenPanel: 'builder' | 'preview' | 'markdown' | null;
  builderCollapsed: boolean;
  previewCollapsed: boolean;
  markdownCollapsed: boolean;
  builderSize: number;
  previewSize: number;
  markdownSize: number;
}

export const calculatePanelWidths = ({
  fullscreenPanel,
  builderCollapsed,
  previewCollapsed,
  markdownCollapsed,
  builderSize,
  previewSize,
  markdownSize,
}: PanelWidthsParams) => {
  if (fullscreenPanel) {
    return {
      builder: fullscreenPanel === 'builder' ? '100%' : '0%',
      preview: fullscreenPanel === 'preview' ? '100%' : '0%',
      markdown: fullscreenPanel === 'markdown' ? '100%' : '0%',
    };
  }

  let sum = 0;
  if (!builderCollapsed) sum += builderSize;
  if (!previewCollapsed) sum += previewSize;
  if (!markdownCollapsed) sum += markdownSize;

  if (sum === 0) {
    const visibleCount = [!builderCollapsed, !previewCollapsed, !markdownCollapsed].filter(Boolean).length;
    const defaultVal = visibleCount > 0 ? 100 / visibleCount : 33.3;
    return {
      builder: !builderCollapsed ? `${defaultVal}%` : '0%',
      preview: !previewCollapsed ? `${defaultVal}%` : '0%',
      markdown: !markdownCollapsed ? `${defaultVal}%` : '0%',
    };
  }

  return {
    builder: !builderCollapsed ? `${(builderSize / sum) * 100}%` : '0%',
    preview: !previewCollapsed ? `${(previewSize / sum) * 100}%` : '0%',
    markdown: !markdownCollapsed ? `${(markdownSize / sum) * 100}%` : '0%',
  };
};

export const getCurrentConfig = () => {
  const state = useReadmeStore.getState();
  return {
    name: state.name,
    role: state.role,
    about: state.about,
    skills: state.skills,
    projects: state.projects,
    socials: state.socials,
    avatarUrl: state.avatarUrl,
    followers: state.followers,
    following: state.following,
    publicRepos: state.publicRepos,
    template: state.template,
    githubStats: state.githubStats,
    techStack: state.techStack,
    socialLinks: state.socialLinks,
  };
};
