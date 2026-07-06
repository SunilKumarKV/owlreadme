import Button from '@/components/Button';
import { Sparkles } from 'lucide-react';
import { RepoAnalysisResult } from '@/stores/readme-store';

interface RepositoryInsightsPanelProps {
  repoAnalysis: RepoAnalysisResult | null;
  applySuggestedSkills: () => void;
  applySuggestedProjects: () => void;
}

export const RepositoryInsightsPanel = ({
  repoAnalysis,
  applySuggestedSkills,
  applySuggestedProjects,
}: RepositoryInsightsPanelProps) => {
  if (!repoAnalysis) return null;

  return (
    <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
      <div className="border-b pb-3 border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-green-500 shrink-0" />
          Repository Insights & Suggestions
        </h2>
        <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full uppercase tracking-wider">
          AI Analyzed
        </span>
      </div>

      {/* Languages breakdown */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Most Used Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {repoAnalysis.languages.slice(0, 8).map((lang) => (
            <span
              key={lang.name}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center space-x-1"
            >
              <span>{lang.name}</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-1 rounded">
                {lang.count}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Starred vs Active lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Most Starred</h3>
          <div className="space-y-2">
            {repoAnalysis.topStarred.slice(0, 3).map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 bg-gray-50/50 dark:bg-black/10 transition group text-xs"
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="group-hover:text-blue-500 transition line-clamp-1">{repo.name}</span>
                  <span className="text-yellow-500 flex items-center shrink-0">⭐ {repo.stars}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{repo.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Active Repositories</h3>
          <div className="space-y-2">
            {repoAnalysis.topActive.slice(0, 3).map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 bg-gray-50/50 dark:bg-black/10 transition group text-xs"
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="group-hover:text-blue-500 transition line-clamp-1">{repo.name}</span>
                  <span className="text-[10px] text-gray-500 shrink-0 font-normal">
                    {new Date(repo.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{repo.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions and Apply actions */}
      <div className="bg-blue-50/20 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-100/30 dark:border-blue-900/20 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Suggested Tech Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {repoAnalysis.suggestedSkills.slice(0, 8).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button onClick={applySuggestedSkills} className="text-xs py-1.5 px-3" variant="primary">
            Apply Skills to Profile
          </Button>
          <Button onClick={applySuggestedProjects} className="text-xs py-1.5 px-3" variant="secondary">
            Apply Starred Projects
          </Button>
        </div>
      </div>
    </div>
  );
};
