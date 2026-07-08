/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import React, { useState } from 'react';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import { fetchGithubRepos } from '@/utils/github-api';
import { FeaturedProject } from '@/stores/readme-store';

export interface ProjectsPanelProps {
  sectionId: string;
  featuredProjects: {
    enabled: boolean;
    cardStyle: 'minimal' | 'modern' | 'compact' | 'grid' | 'gprm';
    layout: '1-col' | '2-col' | 'grid';
    sortMode: 'manual' | 'stars' | 'updated';
    badgeStyle: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
    showStars: boolean;
    showForks: boolean;
    showLanguage: boolean;
    showTopics: boolean;
    projects: FeaturedProject[];
  };
  setFeaturedProjects: (updates: Partial<ProjectsPanelProps['featuredProjects']>) => void;
  projects: string;
  setProjects: (val: string) => void;
  loading: boolean;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({
  sectionId,
  featuredProjects,
  setFeaturedProjects,
  projects,
  setProjects,
  loading,
}) => {
  // Local presentation states
  const [repoUsername, setRepoUsername] = useState('');
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [fetchedRepos, setFetchedRepos] = useState<FeaturedProject[]>([]);
  const [repoSearchQuery, setRepoSearchQuery] = useState('');
  const [reposFetched, setReposFetched] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTechInput, setManualTechInput] = useState('');
  const [manualDraft, setManualDraft] = useState<Partial<FeaturedProject>>({
    source: 'manual',
    title: '',
    description: '',
    repoUrl: '',
    demoUrl: '',
    language: '',
    technologies: [],
  });

  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          📂 Featured Projects Config
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={featuredProjects.enabled}
            onChange={(e) => setFeaturedProjects({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Fallback plain-text mode when builder disabled */}
      {!featuredProjects.enabled && (
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">Enable the builder above for rich project cards. Or use plain text below.</p>
          <div>
            <label htmlFor="readme-projects" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Projects / Repositories List</label>
            <Textarea
              id="readme-projects"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              placeholder="Projects (comma-separated or list)"
              rows={4}
              loading={loading}
              disabled={loading}
            />
          </div>
        </div>
      )}

      {/* Featured Projects Builder */}
      {featuredProjects.enabled && (
        <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">

          {/* ── Display Options ─────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Card Style</label>
              <select
                value={featuredProjects.cardStyle}
                onChange={(e) => setFeaturedProjects({ cardStyle: e.target.value as any })}
                className="w-full px-3 py-2 text-sm text-black dark:text-white rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:border-gray-600 focus:border-blue-500 transition"
              >
                <option value="minimal">Minimal</option>
                <option value="modern">Modern</option>
                <option value="compact">Compact Table</option>
                <option value="grid">Grid</option>
                <option value="gprm">GPRM Style</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Layout</label>
              <select
                value={featuredProjects.layout}
                onChange={(e) => setFeaturedProjects({ layout: e.target.value as any })}
                className="w-full px-3 py-2 text-sm text-black dark:text-white rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:border-gray-600 focus:border-blue-500 transition"
              >
                <option value="1-col">1 Column</option>
                <option value="2-col">2 Columns</option>
                <option value="grid">Grid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Sort By</label>
              <select
                value={featuredProjects.sortMode}
                onChange={(e) => setFeaturedProjects({ sortMode: e.target.value as any })}
                className="w-full px-3 py-2 text-sm text-black dark:text-white rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:border-gray-600 focus:border-blue-500 transition"
              >
                <option value="manual">Manual Order</option>
                <option value="stars">Most Stars</option>
                <option value="updated">Recently Updated</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Badge Style</label>
              <select
                value={featuredProjects.badgeStyle}
                onChange={(e) => setFeaturedProjects({ badgeStyle: e.target.value as any })}
                className="w-full px-3 py-2 text-sm text-black dark:text-white rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:border-gray-600 focus:border-blue-500 transition"
              >
                <option value="flat">Flat</option>
                <option value="flat-square">Flat Square</option>
                <option value="for-the-badge">For the Badge</option>
                <option value="plastic">Plastic</option>
              </select>
            </div>
          </div>

          {/* ── Show / Hide Toggles ─────────────────── */}
          <div className="flex flex-wrap gap-4 select-none">
            <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredProjects.showStars}
                onChange={(e) => setFeaturedProjects({ showStars: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
              />
              <span>⭐ Stars</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredProjects.showForks}
                onChange={(e) => setFeaturedProjects({ showForks: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
              />
              <span>🍴 Forks</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredProjects.showLanguage}
                onChange={(e) => setFeaturedProjects({ showLanguage: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
              />
              <span>🔵 Language</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredProjects.showTopics}
                onChange={(e) => setFeaturedProjects({ showTopics: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
              />
              <span># Topics</span>
            </label>
          </div>

          {/* ── GitHub Repository Fetcher ─────────────────── */}
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-800 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Import from GitHub</h4>
            <div className="flex gap-2">
              <Input
                value={repoUsername}
                onChange={(e) => setRepoUsername(e.target.value)}
                placeholder="GitHub username…"
              />
              <button
                type="button"
                disabled={reposLoading || !repoUsername.trim()}
                aria-label="Fetch GitHub repositories"
                onClick={async () => {
                  setReposLoading(true);
                  setReposError(null);
                  try {
                    const repos = await fetchGithubRepos(repoUsername.trim());
                    const mapped: FeaturedProject[] = repos
                      .filter((r) => !r.fork)
                      .map((r) => ({
                        id: `gh-${r.name}`,
                        source: 'github' as const,
                        repoName: r.name,
                        description: r.description || '',
                        language: r.language || '',
                        stars: r.stargazers_count,
                        forks: r.forks_count,
                        topics: r.topics || [],
                        repoUrl: r.html_url,
                        updatedAt: r.updated_at || r.pushed_at || '',
                      }));
                    setFetchedRepos(mapped);
                    setReposFetched(true);
                  } catch (err: any) {
                    setReposError(err.message || 'Failed to fetch repositories.');
                    setFetchedRepos([]);
                    setReposFetched(true);
                  } finally {
                    setReposLoading(false);
                  }
                }}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {reposLoading ? 'Loading…' : 'Fetch Repos'}
              </button>
            </div>

            {reposError && (
              <p className="text-xs text-red-500">{reposError}</p>
            )}

            {(reposFetched && !reposLoading && fetchedRepos.length === 0 && !reposError) && (
              <p className="text-xs text-gray-500 dark:text-gray-400">No public repositories were found for this GitHub username.</p>
            )}

            {/* Search + Repo List */}
            {fetchedRepos.length > 0 && (
              <div className="space-y-2">
                <Input
                  value={repoSearchQuery}
                  onChange={(e) => setRepoSearchQuery(e.target.value)}
                  placeholder="Search repositories…"
                />
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                  {fetchedRepos
                    .filter((r) =>
                      (r.repoName || '').toLowerCase().includes(repoSearchQuery.toLowerCase()) ||
                      (r.description || '').toLowerCase().includes(repoSearchQuery.toLowerCase())
                    )
                    .map((repo) => {
                      const alreadyAdded = featuredProjects.projects.some((p) => p.id === repo.id);
                      return (
                        <div
                          key={repo.id}
                          className="flex items-center justify-between p-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block">{repo.repoName}</span>
                            {repo.description && (
                              <span className="text-gray-400 dark:text-gray-550 truncate block">{repo.description}</span>
                            )}
                            <span className="text-gray-300 dark:text-gray-600">
                              {repo.language && `${repo.language} · `}⭐ {repo.stars} · 🍴 {repo.forks}
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label={alreadyAdded ? `Remove ${repo.repoName}` : `Add ${repo.repoName}`}
                            onClick={() => {
                              if (alreadyAdded) {
                                setFeaturedProjects({
                                  projects: featuredProjects.projects.filter((p) => p.id !== repo.id),
                                });
                              } else {
                                setFeaturedProjects({
                                  projects: [...featuredProjects.projects, repo],
                                });
                              }
                            }}
                            className={`ml-3 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                              alreadyAdded
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200'
                            }`}
                          >
                            {alreadyAdded ? '✕ Remove' : '+ Add'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* ── Manual Project Entry ─────────────────────── */}
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-800 text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550">Add Custom Project</h4>
              <button
                type="button"
                aria-label="Toggle manual project form"
                onClick={() => setShowManualForm(!showManualForm)}
                className="text-xs font-semibold text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                {showManualForm ? '▲ Hide Form' : '▼ Show Form'}
              </button>
            </div>

            {showManualForm && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 font-medium">Title *</label>
                    <Input
                      value={manualDraft.title || ''}
                      onChange={(e) => setManualDraft({ ...manualDraft, title: e.target.value })}
                      placeholder="Project name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 font-medium">Language / Primary Tech</label>
                    <Input
                      value={manualDraft.language || ''}
                      onChange={(e) => setManualDraft({ ...manualDraft, language: e.target.value })}
                      placeholder="TypeScript"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 font-medium">GitHub Repo URL</label>
                    <Input
                      value={manualDraft.repoUrl || ''}
                      onChange={(e) => setManualDraft({ ...manualDraft, repoUrl: e.target.value })}
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 font-medium">Live Demo URL</label>
                    <Input
                      value={manualDraft.demoUrl || ''}
                      onChange={(e) => setManualDraft({ ...manualDraft, demoUrl: e.target.value })}
                      placeholder="https://myproject.vercel.app"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 font-medium">Description</label>
                  <Textarea
                    value={manualDraft.description || ''}
                    onChange={(e) => setManualDraft({ ...manualDraft, description: e.target.value })}
                    placeholder="Short project description…"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 font-medium">Technologies (comma-separated)</label>
                  <Input
                    value={manualTechInput}
                    onChange={(e) => setManualTechInput(e.target.value)}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </div>
                <button
                  type="button"
                  disabled={!manualDraft.title?.trim()}
                  aria-label="Add manual project to list"
                  onClick={() => {
                    if (!manualDraft.title?.trim()) return;
                    const newProject: FeaturedProject = {
                      id: `manual-${Date.now()}`,
                      source: 'manual',
                      title: manualDraft.title,
                      description: manualDraft.description || '',
                      repoUrl: manualDraft.repoUrl || '',
                      demoUrl: manualDraft.demoUrl || '',
                      language: manualDraft.language || '',
                      technologies: manualTechInput
                        ? manualTechInput.split(',').map((t) => t.trim()).filter(Boolean)
                        : [],
                    };
                    setFeaturedProjects({
                      projects: [...featuredProjects.projects, newProject],
                    });
                    setManualDraft({ source: 'manual', title: '', description: '', repoUrl: '', demoUrl: '', language: '', technologies: [] });
                    setManualTechInput('');
                    setShowManualForm(false);
                  }}
                  className="w-full py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50 cursor-pointer"
                >
                  + Add Custom Project
                </button>
              </div>
            )}
          </div>

          {/* ── Current Projects List ──────────────────── */}
          {featuredProjects.projects.length > 0 && (
            <div className="space-y-2 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
                Selected Projects ({featuredProjects.projects.length})
              </h4>
              {featuredProjects.projects.map((project, idx) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-gray-400 cursor-move select-none font-bold">⋮⋮</span>
                    <div className="min-w-0">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 block truncate">
                        {project.title || project.repoName}
                      </span>
                      <span className="text-gray-400 dark:text-gray-550 block truncate">
                        {project.source === 'github' ? '🐙 GitHub' : '✏️ Manual'}
                        {project.language ? ` · ${project.language}` : ''}
                        {project.stars !== undefined ? ` · ⭐ ${project.stars}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center ml-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      aria-label={`Move ${project.title || project.repoName} up`}
                      onClick={() => {
                        const newProjects = [...featuredProjects.projects];
                        [newProjects[idx - 1], newProjects[idx]] = [newProjects[idx], newProjects[idx - 1]];
                        setFeaturedProjects({ projects: newProjects });
                      }}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-20 cursor-pointer"
                    >▲</button>
                    <button
                      type="button"
                      disabled={idx === featuredProjects.projects.length - 1}
                      aria-label={`Move ${project.title || project.repoName} down`}
                      onClick={() => {
                        const newProjects = [...featuredProjects.projects];
                        [newProjects[idx + 1], newProjects[idx]] = [newProjects[idx], newProjects[idx + 1]];
                        setFeaturedProjects({ projects: newProjects });
                      }}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-20 cursor-pointer"
                    >▼</button>
                    <button
                      type="button"
                      aria-label={`Remove ${project.title || project.repoName}`}
                      onClick={() =>
                        setFeaturedProjects({
                          projects: featuredProjects.projects.filter((p) => p.id !== project.id),
                        })
                      }
                      className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-905/20 text-red-400 cursor-pointer ml-1"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ProjectsPanel;
