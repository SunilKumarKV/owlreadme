import Button from '@/components/Button';
import { AISuggestionsSkeleton } from '@/components/Skeleton';
import { Sparkles } from 'lucide-react';
import { RepoAnalysisResult, AISuggestions } from '@/stores/readme-store';

interface OwlAIAssistantPanelProps {
  isReadmeType: boolean;
  isRoadmapType: boolean;
  repoAnalysis: RepoAnalysisResult | null;
  aiLoading: boolean;
  aiSuggestions: AISuggestions | null;
  aiTab: 'readme' | 'roadmap' | 'profile';
  setAiTab: (tab: 'readme' | 'roadmap' | 'profile') => void;
  handleConsultOwlAI: () => void;
  applyIntro: () => void;
  applyAboutMe: () => void;
  applySkills: () => void;
  applyProjects: () => void;
  applyRoadmapSteps: () => void;
  applyProfileBio: () => void;
  applyPortfolioDescription: () => void;
}

export const OwlAIAssistantPanel = ({
  isReadmeType,
  isRoadmapType,
  repoAnalysis,
  aiLoading,
  aiSuggestions,
  aiTab,
  setAiTab,
  handleConsultOwlAI,
  applyIntro,
  applyAboutMe,
  applySkills,
  applyProjects,
  applyRoadmapSteps,
  applyProfileBio,
  applyPortfolioDescription,
}: OwlAIAssistantPanelProps) => {
  if (!(isReadmeType || isRoadmapType) || !repoAnalysis) return null;

  return (
    <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
      <div className="border-b pb-3 border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
          Owl AI Assistant
        </h2>
        <Button
          onClick={handleConsultOwlAI}
          loading={aiLoading}
          className="text-xs py-1.5 px-3"
          variant="primary"
        >
          Consult Owl AI
        </Button>
      </div>

      {aiLoading ? (
        <AISuggestionsSkeleton />
      ) : !aiSuggestions ? (
        <div className="py-6 text-center text-gray-500 text-xs">
          <p className="mb-2">Click &quot;Consult Owl AI&quot; to generate smart recommendations for your profile, README, and learning roadmap.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sub-tabs for README, Roadmap, and Profile suggestions */}
          <div role="tablist" className="flex border-b border-gray-100 dark:border-gray-800 text-xs font-semibold">
            {isReadmeType && (
              <button
                role="tab"
                aria-selected={aiTab === 'readme'}
                onClick={() => setAiTab('readme')}
                className={`pb-2 px-4 border-b-2 transition cursor-pointer ${
                  aiTab === 'readme'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                README
              </button>
            )}
            {isRoadmapType && (
              <button
                role="tab"
                aria-selected={aiTab === 'roadmap'}
                onClick={() => setAiTab('roadmap')}
                className={`pb-2 px-4 border-b-2 transition cursor-pointer ${
                  aiTab === 'roadmap'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Roadmap
              </button>
            )}
            {isReadmeType && (
              <button
                role="tab"
                aria-selected={aiTab === 'profile'}
                onClick={() => setAiTab('profile')}
                className={`pb-2 px-4 border-b-2 transition cursor-pointer ${
                  aiTab === 'profile'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Profile & Bio
              </button>
            )}
          </div>

          {/* Tab contents */}
          {aiTab === 'readme' && isReadmeType && aiSuggestions.readme && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 dark:text-gray-200">Suggested Bio Intro</span>
                  <button onClick={applyIntro} className="text-blue-500 hover:underline font-semibold cursor-pointer">Apply</button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 italic">&quot;{aiSuggestions.readme.introduction}&quot;</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 dark:text-gray-200">Suggested About Me Paragraph</span>
                  <button onClick={applyAboutMe} className="text-blue-500 hover:underline font-semibold cursor-pointer">Apply</button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 italic">&quot;{aiSuggestions.readme.aboutMe}&quot;</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 dark:text-gray-200">Suggested Core Skills</span>
                  <button onClick={applySkills} className="text-blue-500 hover:underline font-semibold cursor-pointer">Apply</button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 italic">&quot;{aiSuggestions.readme.skills}&quot;</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 dark:text-gray-200">Suggested Projects Section</span>
                  <button onClick={applyProjects} className="text-blue-500 hover:underline font-semibold cursor-pointer">Apply</button>
                </div>
                <pre className="text-gray-500 dark:text-gray-400 italic font-mono text-[10px] overflow-auto whitespace-pre-wrap">
                  {aiSuggestions.readme.projects}
                </pre>
              </div>
            </div>
          )}

          {aiTab === 'roadmap' && isRoadmapType && aiSuggestions.roadmap && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-1">Suggested Next Topics</h4>
                <div className="flex flex-wrap gap-1.5">
                  {aiSuggestions.roadmap.nextTopics.map((topic: string) => (
                    <span key={topic} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-600 dark:text-gray-300">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-1">Recommended Tech Options</h4>
                <div className="flex flex-wrap gap-1.5">
                  {aiSuggestions.roadmap.technologies.map((tech: string) => (
                    <span key={tech} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-200">Recommended Steps Workflow</span>
                  <button onClick={applyRoadmapSteps} className="text-blue-500 hover:underline font-semibold cursor-pointer font-bold">Apply Steps</button>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-gray-500 dark:text-gray-400">
                  {aiSuggestions.roadmap.roadmapSteps.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {aiTab === 'profile' && isReadmeType && aiSuggestions.profile && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 dark:text-gray-200">Suggested Bio Improvement</span>
                  <button onClick={applyProfileBio} className="text-blue-500 hover:underline font-semibold cursor-pointer">Apply</button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 italic">&quot;{aiSuggestions.profile.improvedBio}&quot;</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 dark:text-gray-200">Portfolio Tagline Suggestion</span>
                  <button
                    onClick={applyPortfolioDescription}
                    className="text-blue-500 hover:underline font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 italic">&quot;{aiSuggestions.profile.portfolioDescription}&quot;</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-1">GitHub Account Improvements</h4>
                <ul className="list-disc pl-4 space-y-1 text-gray-500 dark:text-gray-400">
                  {aiSuggestions.profile.githubImprovements.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
