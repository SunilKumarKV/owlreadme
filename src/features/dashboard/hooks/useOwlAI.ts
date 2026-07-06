import { useCallback } from 'react';
import { getAIService } from '@/utils/ai/ai-service';
import useReadmeStore from '@/stores/readme-store';
import useRoadmapStore from '@/stores/roadmap-store';

type ReadmeStoreState = ReturnType<typeof useReadmeStore.getState>;
type RoadmapStoreState = ReturnType<typeof useRoadmapStore.getState>;

interface OwlAIOptions {
  readmeState: ReadmeStoreState;
  roadmapState: RoadmapStoreState;
  setAiLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (msg: string) => void;
}

export const useOwlAI = (options: OwlAIOptions) => {
  const { readmeState, roadmapState, setAiLoading, setError, addNotification } = options;
  const {
    name: readmeName,
    role: readmeRole,
    about: readmeAbout,
    followers,
    publicRepos,
    repoAnalysis,
    aiSuggestions,
    setAbout,
    setSkills,
    setProjects,
    setAiSuggestions,
  } = readmeState;

  const {
    title: roadmapTitle,
    steps,
    setField: setRoadmapField,
  } = roadmapState;

  const handleConsultOwlAI = useCallback(async () => {
    setAiLoading(true);
    setError(null);
    try {
      const service = getAIService();
      const profileData = {
        name: readmeName,
        role: readmeRole,
        bio: readmeAbout,
        followers: followers ?? 0,
        publicRepos: publicRepos ?? 0,
      };

      const readmeSugg = await service.generateReadmeSuggestions(profileData, repoAnalysis);
      const roadmapSugg = await service.generateRoadmapSuggestions(roadmapTitle || 'Software Developer', steps);
      const profileSugg = await service.generateProfileSuggestions(profileData, repoAnalysis);

      setAiSuggestions({
        readme: readmeSugg,
        roadmap: roadmapSugg,
        profile: profileSugg,
      });

      readmeState.incrementAiGenerations();
      addNotification('Owl AI suggestions generated successfully!');
    } catch (err) {
      console.error(err);
      setError('AI generation failed.');
    } finally {
      setAiLoading(false);
    }
  }, [
    readmeName,
    readmeRole,
    readmeAbout,
    followers,
    publicRepos,
    repoAnalysis,
    roadmapTitle,
    steps,
    setAiSuggestions,
    readmeState,
    setAiLoading,
    setError,
    addNotification,
  ]);

  const applyIntro = useCallback(() => {
    if (!aiSuggestions?.readme) return;
    setAbout(aiSuggestions.readme.introduction + '\n\n' + readmeAbout);
    addNotification('AI Introduction appended to About Me!');
  }, [aiSuggestions, readmeAbout, setAbout, addNotification]);

  const applyAboutMe = useCallback(() => {
    if (!aiSuggestions?.readme) return;
    setAbout(aiSuggestions.readme.aboutMe);
    addNotification('AI About Me set as profile description!');
  }, [aiSuggestions, setAbout, addNotification]);

  const applySkills = useCallback(() => {
    if (!aiSuggestions?.readme) return;
    setSkills(aiSuggestions.readme.skills);
    addNotification('AI Skills applied successfully!');
  }, [aiSuggestions, setSkills, addNotification]);

  const applyProjects = useCallback(() => {
    if (!aiSuggestions?.readme) return;
    setProjects(aiSuggestions.readme.projects);
    addNotification('AI Projects markdown applied successfully!');
  }, [aiSuggestions, setProjects, addNotification]);

  const applyRoadmapSteps = useCallback(() => {
    if (!aiSuggestions?.roadmap) return;
    setRoadmapField('steps', aiSuggestions.roadmap.roadmapSteps);
    addNotification('AI learning steps applied to your roadmap!');
  }, [aiSuggestions, setRoadmapField, addNotification]);

  const applyProfileBio = useCallback(() => {
    if (!aiSuggestions?.profile) return;
    setAbout(aiSuggestions.profile.improvedBio);
    addNotification('Improved Bio set to profile!');
  }, [aiSuggestions, setAbout, addNotification]);

  const applyPortfolioDescription = useCallback(() => {
    if (!aiSuggestions?.profile) return;
    setAbout(aiSuggestions.profile.portfolioDescription);
    addNotification('Portfolio tagline applied successfully!');
  }, [aiSuggestions, setAbout, addNotification]);

  return {
    aiSuggestions,
    handleConsultOwlAI,
    applyIntro,
    applyAboutMe,
    applySkills,
    applyProjects,
    applyRoadmapSteps,
    applyProfileBio,
    applyPortfolioDescription,
  };
};
