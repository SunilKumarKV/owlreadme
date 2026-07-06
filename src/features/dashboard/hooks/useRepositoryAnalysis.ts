import { useCallback } from 'react';
import useReadmeStore, { RepoAnalysisResult } from '@/stores/readme-store';

interface RepositoryAnalysisOptions {
  addNotification: (msg: string) => void;
  repoAnalysis: RepoAnalysisResult | null;
}

export const useRepositoryAnalysis = (options: RepositoryAnalysisOptions) => {
  const { addNotification, repoAnalysis } = options;
  const { setSkills, setProjects } = useReadmeStore();

  const applySuggestedSkills = useCallback(() => {
    if (!repoAnalysis) return;
    setSkills(repoAnalysis.suggestedSkills.join(', '));
    addNotification('Suggested skills applied to your profile README!');
  }, [repoAnalysis, setSkills, addNotification]);

  const applySuggestedProjects = useCallback(() => {
    if (!repoAnalysis) return;
    const projectList = repoAnalysis.topStarred
      .map((repo) => `- [${repo.name}](${repo.url}) - ${repo.description} (⭐ ${repo.stars})`)
      .join('\n');
    setProjects(projectList);
    addNotification('Starred projects applied to your profile README!');
  }, [repoAnalysis, setProjects, addNotification]);

  return {
    applySuggestedSkills,
    applySuggestedProjects,
  };
};
