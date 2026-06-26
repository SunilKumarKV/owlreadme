"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import useReadmeStore from '@/stores/readme-store';
import useRoadmapStore from '@/stores/roadmap-store';
import useThemeStore from '@/stores/theme-store';
import { fetchGithubProfile, fetchGithubRepos } from '@/utils/github-api';

const DeveloperDashboardPage = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read README store data
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
    setName,
    setRole,
    setAbout,
    setProjects,
    setSocials,
    setAvatarUrl,
    setFollowers,
    setFollowing,
    setPublicRepos,
  } = useReadmeStore();

  // Read Roadmap store data
  const {
    title: roadmapTitle,
    steps,
    template: roadmapTemplate,
    roadmapExportsCount,
    templatesUsedCount: roadmapTemplatesCount,
    setField: setRoadmapField,
  } = useRoadmapStore();

  // Read Theme store data
  const { theme, templatesUsedCount: themeTemplatesCount } = useThemeStore();

  // GitHub import side effect
  useEffect(() => {
    if (!username) return;

    const importGitHubData = async () => {
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
  }, [username, setName, setRole, setAbout, setProjects, setSocials, setAvatarUrl, setFollowers, setPublicRepos]);

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
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <h2 className="text-xl font-bold mb-4 text-left border-b pb-2 border-gray-100 dark:border-gray-800">GitHub Profile</h2>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm text-gray-500">Syncing GitHub data...</p>
                </div>
              ) : avatarUrl ? (
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

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <Button href="/readme-builder" variant="primary" className="w-full text-sm">Create / Edit README</Button>
                <Button href="/roadmap-builder" variant="secondary" className="w-full text-sm">Create / Edit Roadmap</Button>
                <Button href="/export" variant="secondary" className="w-full text-sm">Export Markdown</Button>
                <Button href="/theme" variant="secondary" className="w-full text-sm">Change Theme</Button>
              </div>
            </div>
          </div>

          {/* Right Column: Projects, Templates, Statistics */}
          <div className="space-y-8 lg:col-span-2">
            {/* Recent Projects */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Recent Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* README Project */}
                <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">GitHub Profile</span>
                    <h3 className="text-lg font-bold mt-1 line-clamp-1">{readmeName || 'My README'}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {readmeRole || 'Custom professional profile README for GitHub'}
                    </p>
                  </div>
                  <Button href="/readme-builder" variant="secondary" className="mt-4 text-xs w-full">Open Editor</Button>
                </div>
                {/* Roadmap Project */}
                <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Learning Roadmap</span>
                    <h3 className="text-lg font-bold mt-1 line-clamp-1">{roadmapTitle || 'My Roadmap'}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {steps.length} roadmap milestones configured
                    </p>
                  </div>
                  <Button href="/roadmap-builder" variant="secondary" className="mt-4 text-xs w-full">Open Editor</Button>
                </div>
              </div>
            </div>

            {/* Configured Templates */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Workspace Configurations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
                  <span className="text-xs text-gray-500 block">README Style</span>
                  <span className="font-bold text-sm capitalize">{readmeTemplate}</span>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
                  <span className="text-xs text-gray-500 block">Roadmap Style</span>
                  <span className="font-bold text-sm capitalize">{roadmapTemplate ? roadmapTemplate.replace('-', ' ') : 'Custom'}</span>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20">
                  <span className="text-xs text-gray-500 block">Workspace Theme</span>
                  <span className="font-bold text-sm capitalize">{theme}</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Workspace Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">README Exports</span>
                  <span className="text-3xl font-extrabold text-blue-500">{readmeExportsCount}</span>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Roadmap Exports</span>
                  <span className="text-3xl font-extrabold text-blue-500">{roadmapExportsCount}</span>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Styles Tested</span>
                  <span className="text-3xl font-extrabold text-blue-500">{totalTemplatesCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboardPage;
