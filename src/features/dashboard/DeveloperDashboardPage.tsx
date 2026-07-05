/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import useReadmeStore from '@/stores/readme-store';
import useRoadmapStore from '@/stores/roadmap-store';
import useThemeStore from '@/stores/theme-store';
import { fetchGithubProfile, fetchGithubRepos } from '@/utils/github-api';
import { analyzeRepositories } from '@/utils/repo-analyzer';
import { getAIService } from '@/utils/ai/ai-service';
import { Sparkles, CheckCircle, Edit2, Plus, Trash2, Copy } from 'lucide-react';
import { generateShareUrl } from '@/utils/share-utils';
import useWorkspaceStore from '@/stores/workspace-store';
import { ProfileCardSkeleton, AISuggestionsSkeleton } from '@/components/Skeleton';

const DeveloperDashboardPage = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTab, setAiTab] = useState<'readme' | 'roadmap' | 'profile'>('readme');

  // Read README store data
  const readmeState = useReadmeStore();
  const {
    name: readmeName,
    role: readmeRole,
    about: readmeAbout,
    avatarUrl,
    followers,
    publicRepos,
    template: readmeTemplate,
    readmeExportsCount,
    templatesUsedCount: readmeTemplatesCount,
    repoAnalysis,
    aiSuggestions,
    setName,
    setRole,
    setAbout,
    setProjects,
    setSocials,
    setAvatarUrl,
    setFollowers,
    setFollowing,
    setPublicRepos,
    setSkills,
    setRepoAnalysis,
    setAiSuggestions,
  } = readmeState;

  // Read Roadmap store data
  const roadmapState = useRoadmapStore();
  const {
    title: roadmapTitle,
    steps,
    template: roadmapTemplate,
    roadmapExportsCount,
    templatesUsedCount: roadmapTemplatesCount,
    setField: setRoadmapField,
  } = roadmapState;

  // Read Theme store data
  const { theme, templatesUsedCount: themeTemplatesCount } = useThemeStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Read Workspace store data
  const {
    workspaces,
    activeWorkspaceId,
    createWorkspace,
    deleteWorkspace,
    renameWorkspace,
    duplicateWorkspace,
    loadWorkspace,
  } = useWorkspaceStore();

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const isReadmeType = activeWorkspace ? activeWorkspace.type === 'readme' || activeWorkspace.type === 'combined' : true;
  const isRoadmapType = activeWorkspace ? activeWorkspace.type === 'roadmap' || activeWorkspace.type === 'combined' : true;

  // Modal and inline edit states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<'readme' | 'roadmap' | 'combined'>('combined');
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      createWorkspace(newProjectName.trim(), newProjectType);
      setNewProjectName('');
      setIsCreateModalOpen(false);
      setNotification(`Project "${newProjectName.trim()}" created successfully!`);
    }
  };

  const handleRenameSave = (id: string) => {
    if (editingName.trim()) {
      renameWorkspace(id, editingName.trim());
      setEditingWorkspaceId(null);
      setNotification('Project renamed successfully!');
    }
  };

  // Sync AI tabs depending on active workspace type during render
  if (!isReadmeType && aiTab !== 'roadmap') {
    setAiTab('roadmap');
  } else if (!isRoadmapType && aiTab === 'roadmap') {
    setAiTab('readme');
  }




  const applySuggestedSkills = () => {
    if (!repoAnalysis) return;
    setSkills(repoAnalysis.suggestedSkills.join(', '));
    setNotification('Suggested skills applied to your profile README!');
  };

  const applySuggestedProjects = () => {
    if (!repoAnalysis) return;
    const projectList = repoAnalysis.topStarred
      .map((repo) => `- [${repo.name}](${repo.url}) - ${repo.description} (⭐ ${repo.stars})`)
      .join('\n');
    setProjects(projectList);
    setNotification('Starred projects applied to your profile README!');
  };

  const handleConsultOwlAI = async () => {
    setAiLoading(true);
    try {
      const service = getAIService();
      const profileData = {
        name: readmeName,
        role: readmeRole,
        bio: readmeAbout,
        followers,
        publicRepos,
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

      setNotification('Owl AI suggestions generated successfully!');
    } catch (err) {
      console.error(err);
      setError('AI generation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyIntro = () => {
    if (!aiSuggestions?.readme) return;
    setAbout(aiSuggestions.readme.introduction + '\n\n' + readmeAbout);
    setNotification('AI Introduction appended to About Me!');
  };

  const applyAboutMe = () => {
    if (!aiSuggestions?.readme) return;
    setAbout(aiSuggestions.readme.aboutMe);
    setNotification('AI About Me set as profile description!');
  };

  const applySkills = () => {
    if (!aiSuggestions?.readme) return;
    setSkills(aiSuggestions.readme.skills);
    setNotification('AI Skills applied successfully!');
  };

  const applyProjects = () => {
    if (!aiSuggestions?.readme) return;
    setProjects(aiSuggestions.readme.projects);
    setNotification('AI Projects markdown applied successfully!');
  };

  const applyRoadmapSteps = () => {
    if (!aiSuggestions?.roadmap) return;
    setRoadmapField('steps', aiSuggestions.roadmap.roadmapSteps);
    setNotification('AI learning steps applied to your roadmap!');
  };

  const applyProfileBio = () => {
    if (!aiSuggestions?.profile) return;
    setAbout(aiSuggestions.profile.improvedBio);
    setNotification('Improved Bio set to profile!');
  };

  // GitHub import side effect
  useEffect(() => {
    if (!username) return;

    const importGitHubData = async () => {
      // Auto-create workspace if none is active
      let currentActiveId = useWorkspaceStore.getState().activeWorkspaceId;
      if (!currentActiveId) {
        currentActiveId = useWorkspaceStore.getState().createWorkspace(`${username}'s Workspace`, 'combined');
      }

      setLoading(true);
      setError(null);
      try {
        const profile = await fetchGithubProfile(username);
        const repos = await fetchGithubRepos(username);

        setName(profile.name || profile.login || '');

        let inferredRole = '';
        if (profile.company) {
          inferredRole = profile.company.startsWith('@')
            ? `Developer at ${profile.company.substring(1)}`
            : `Developer at ${profile.company}`;
        } else {
          inferredRole = 'Software Developer';
        }
        setRole(inferredRole);

        const bioParts = [];
        if (profile.bio) bioParts.push(profile.bio);
        if (profile.location) bioParts.push(`📍 Based in ${profile.location}`);
        setAbout(bioParts.join('\n\n'));

        setAvatarUrl(profile.avatar_url);
        setFollowers(profile.followers);
        setFollowing(profile.following);
        setPublicRepos(profile.public_repos);

        // Run repository analysis
        const analysis = analyzeRepositories(repos);
        setRepoAnalysis(analysis);

        const topRepos = repos
          .filter((repo) => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5);

        const projectList = topRepos
          .map((repo) => `- [${repo.name}](${repo.html_url})${repo.description ? ` - ${repo.description}` : ''} (⭐ ${repo.stargazers_count})`)
          .join('\n');
        setProjects(projectList);

        const socialList = [
          `- GitHub: [${profile.login}](${profile.html_url})`,
          profile.blog ? `- Website: [${profile.blog.replace(/https?:\/\//, '')}](${profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`})` : '',
          profile.twitter_username ? `- Twitter: [@${profile.twitter_username}](https://twitter.com/${profile.twitter_username})` : '',
        ]
          .filter(Boolean)
          .join('\n');
        setSocials(socialList);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to import GitHub data.');
      } finally {
        setLoading(false);
      }
    };

    importGitHubData();
  }, [username, setName, setRole, setAbout, setProjects, setSocials, setAvatarUrl, setFollowers, setPublicRepos, setRepoAnalysis]);

  const totalTemplatesCount = readmeTemplatesCount + roadmapTemplatesCount + themeTemplatesCount;

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-[#1e1e1e] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center lg:text-left">Developer Workspace</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card & Quick Actions */}
          <div className="space-y-8 lg:col-span-1">
            {/* Profile Card */}
            {isReadmeType && (
              loading ? (
                <ProfileCardSkeleton />
              ) : (
                <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                  <h2 className="text-xl font-bold mb-4 text-left border-b pb-2 border-gray-100 dark:border-gray-800">GitHub Profile</h2>
                  {avatarUrl ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={avatarUrl}
                        alt="GitHub Avatar"
                        className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-sm mb-4"
                      />
                      <h3 className="text-lg font-bold">{readmeName || 'Unnamed Developer'}</h3>
                      {readmeRole && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{readmeRole}</p>}
                      {readmeAbout && <p className="text-xs text-gray-600 dark:text-gray-400 px-4 line-clamp-3 mb-4">{readmeAbout}</p>}
                      <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
                        <div>
                          <span className="block font-bold text-blue-500">{followers ?? 0}</span>
                          <span className="text-xs text-gray-500">Followers</span>
                        </div>
                        <div>
                          <span className="block font-bold text-blue-500">{publicRepos ?? 0}</span>
                          <span className="text-xs text-gray-500">Repositories</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-gray-500 text-sm">
                      <p className="mb-4">No GitHub profile loaded.</p>
                      <Button href="/" variant="secondary" className="w-full text-xs">Import from GitHub</Button>
                    </div>
                  )}
                </div>
              )
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                {isReadmeType && <Button href="/readme-builder" variant="primary" className="w-full text-sm">Create / Edit README</Button>}
                {isRoadmapType && <Button href="/roadmap-builder" variant={isReadmeType ? "secondary" : "primary"} className="w-full text-sm">Create / Edit Roadmap</Button>}
                <Button href="/gallery" variant="secondary" className="w-full text-sm">README Showcase Gallery</Button>
                <Button href="/export" variant="secondary" className="w-full text-sm">Export Markdown</Button>
                <Button href="/theme" variant="secondary" className="w-full text-sm">Change Theme</Button>
                <Button href="/analytics" variant="secondary" className="w-full text-sm">View Analytics</Button>
              </div>
            </div>
          </div>

          {/* Right Column: Projects, Templates, Statistics */}
          <div className="space-y-8 lg:col-span-2">
            {/* Project Workspace Manager (Replacing Recent Projects) */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-800 mb-4">
                <h2 className="text-xl font-bold">Project Workspaces</h2>
                <Button onClick={() => setIsCreateModalOpen(true)} className="text-xs py-1.5 px-3 flex items-center gap-1" variant="primary">
                  <Plus className="h-3.5 w-3.5" /> New Project
                </Button>
              </div>

              {workspaces.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <p className="mb-4">No project workspaces found.</p>
                  <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" className="text-xs">Create your first project</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {workspaces.map((w) => {
                    const isActive = w.id === activeWorkspaceId;
                    const isEditing = editingWorkspaceId === w.id;

                    return (
                      <div
                        key={w.id}
                        className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isActive
                            ? 'border-blue-500 bg-blue-50/10 dark:bg-blue-950/10'
                            : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="px-2 py-0.5 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-black dark:text-white"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRenameSave(w.id);
                                    if (e.key === 'Escape') setEditingWorkspaceId(null);
                                  }}
                                />
                                <button
                                  onClick={() => handleRenameSave(w.id)}
                                  className="text-xs text-green-500 hover:underline font-bold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingWorkspaceId(null)}
                                  className="text-xs text-gray-500 hover:underline"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <h3 className="font-bold text-base text-gray-800 dark:text-gray-100">{w.name}</h3>
                                <button
                                  onClick={() => {
                                    setEditingWorkspaceId(w.id);
                                    setEditingName(w.name);
                                  }}
                                  className="text-xs text-gray-400 hover:text-blue-500 transition cursor-pointer"
                                  title="Rename project"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}

                            {/* Workspace Type Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide ${
                                w.type === 'readme'
                                  ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                                  : w.type === 'roadmap'
                                  ? 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400'
                                  : 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                              }`}
                            >
                              {w.type}
                            </span>

                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-blue-500 text-white uppercase tracking-wide">
                                Active
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-gray-400">
                            Updated: {new Date(w.updatedAt).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Theme: <span className="capitalize">{w.theme}</span>
                            {w.type !== 'roadmap' && ` | Template: ${w.readmeData.template || 'minimal'}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {!isActive && (
                            <Button onClick={() => loadWorkspace(w.id)} className="text-xs py-1.5 px-3 animate-hover" variant="primary">
                              Open
                            </Button>
                          )}
                          <Button
                            onClick={() => duplicateWorkspace(w.id)}
                            className="text-xs py-1.5 px-3 animate-hover"
                            variant="secondary"
                            title="Duplicate project"
                            aria-label={`Duplicate project ${w.name}`}
                          >
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                          {confirmDeleteId === w.id ? (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-red-500 font-semibold">Delete?</span>
                              <button
                                onClick={() => { deleteWorkspace(w.id); setConfirmDeleteId(null); }}
                                className="text-red-500 hover:underline font-bold cursor-pointer"
                                aria-label={`Confirm delete project ${w.name}`}
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-gray-500 hover:underline cursor-pointer"
                                aria-label="Cancel delete"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => setConfirmDeleteId(w.id)}
                              className="text-xs py-1.5 px-3 bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 animate-hover"
                              variant="secondary"
                              title="Delete project"
                              aria-label={`Delete project ${w.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Repository Insights Card */}
            {isReadmeType && repoAnalysis && (
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
            )}

            {/* Owl AI Assistant Card */}
            {(isReadmeType || isRoadmapType) && repoAnalysis && (
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
                            {aiSuggestions.roadmap.nextTopics.map((topic) => (
                              <span key={topic} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-600 dark:text-gray-300">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-1">Recommended Tech Options</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {aiSuggestions.roadmap.technologies.map((tech) => (
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
                            {aiSuggestions.roadmap.roadmapSteps.map((step, idx) => (
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
                              onClick={() => {
                                if (aiSuggestions?.profile) {
                                  setAbout(aiSuggestions.profile.portfolioDescription);
                                  setNotification('Portfolio tagline applied successfully!');
                                }
                              }}
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
                            {aiSuggestions.profile.githubImprovements.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Configured Templates */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Workspace Configurations</h2>
              <div className={`grid grid-cols-1 ${isReadmeType && isRoadmapType ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 text-center`}>
                {isReadmeType && (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
                    <span className="text-xs text-gray-500 block">README Style</span>
                    <span className="font-bold text-sm capitalize">{readmeTemplate}</span>
                  </div>
                )}
                {isRoadmapType && (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
                    <span className="text-xs text-gray-500 block">Roadmap Style</span>
                    <span className="font-bold text-sm capitalize">{roadmapTemplate ? roadmapTemplate.replace('-', ' ') : 'Custom'}</span>
                  </div>
                )}
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
                  <span className="text-xs text-gray-500 block">Workspace Theme</span>
                  <span className="font-bold text-sm capitalize">{theme}</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Workspace Statistics</h2>
              <div className={`grid grid-cols-1 ${isReadmeType && isRoadmapType ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 text-center`}>
                {isReadmeType && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">README Exports</span>
                    <span className="text-3xl font-extrabold text-blue-500">{readmeExportsCount}</span>
                  </div>
                )}
                {isRoadmapType && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Roadmap Exports</span>
                    <span className="text-3xl font-extrabold text-blue-500">{roadmapExportsCount}</span>
                  </div>
                )}
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Styles Tested</span>
                  <span className="text-3xl font-extrabold text-blue-500">{totalTemplatesCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in text-black dark:text-white">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., Portfolio README, Node curriculum"
                  className="w-full px-3 py-2 border rounded-md bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Workspace Type
                </label>
                <select
                  value={newProjectType}
                  onChange={(e) => setNewProjectType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                >
                  <option value="combined">Combined (README + Roadmap)</option>
                  <option value="readme">README Profile Only</option>
                  <option value="roadmap">Learning Roadmap Only</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setIsCreateModalOpen(false)}
                  type="button"
                  variant="secondary"
                  className="text-xs py-1.5 px-4 animate-hover"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-xs py-1.5 px-4 animate-hover">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Local Notification Overlay */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in transition-all duration-300">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default DeveloperDashboardPage;
