"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import useReadmeStore, { READMEStyleTemplate, GitHubStatsConfig } from '@/stores/readme-store';
import { fetchGithubProfile, fetchGithubRepos } from '@/utils/github-api';

const READMEBuilderPage = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    name,
    role,
    about,
    skills,
    projects,
    socials,
    template,
    githubStats,
    setName,
    setRole,
    setAbout,
    setSkills,
    setProjects,
    setSocials,
    setAvatarUrl,
    setFollowers,
    setFollowing,
    setPublicRepos,
    setTemplate,
    setGithubStats,
    reset,
  } = useReadmeStore();

  useEffect(() => {
    if (!username) return;

    const fetchGitHubData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user profile info
        const profile = await fetchGithubProfile(username);

        // Fetch repositories
        const repos = await fetchGithubRepos(username);

        // Generate profile content
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

        // Populate avatar and GitHub statistics
        setAvatarUrl(profile.avatar_url);
        setFollowers(profile.followers);
        setFollowing(profile.following);
        setPublicRepos(profile.public_repos);

        // Autofill username for stats if empty
        const currentStats = useReadmeStore.getState().githubStats;
        if (!currentStats.username && username) {
          setGithubStats({ username });
        }

        // Identify top repositories sorted by stars
        const topRepos = repos
          .filter((repo) => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5);

        // Format repository list for projects
        const projectList = topRepos
          .map((repo) => `- [${repo.name}](${repo.html_url})${repo.description ? ` - ${repo.description}` : ''} (⭐ ${repo.stargazers_count})`)
          .join('\n');
        setProjects(projectList);

        // Generate social links
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
        setError(err.message || 'An error occurred while fetching GitHub data.');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [
    username,
    setName,
    setRole,
    setAbout,
    setProjects,
    setSocials,
    setAvatarUrl,
    setFollowers,
    setFollowing,
    setPublicRepos,
    setGithubStats,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-gray-100 dark:bg-[#1e1e1e]">
      <h1 className="text-4xl font-bold text-black dark:text-white mb-8">Create Your GitHub README</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Template Selector */}
      <div className="w-full max-w-lg mb-6">
        <label htmlFor="readme-template-select" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 font-semibold">README Style Template</label>
        <select
          id="readme-template-select"
          value={template}
          onChange={(e) => setTemplate(e.target.value as READMEStyleTemplate)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
        >
          <option value="minimal">Minimal</option>
          <option value="professional">Professional</option>
          <option value="developer">Developer</option>
          <option value="open-source">Open Source</option>
          <option value="portfolio">Portfolio</option>
        </select>
      </div>

      <form className="space-y-4 w-full max-w-lg">
        <div>
          <label htmlFor="readme-name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
          <Input
            id="readme-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-role" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role / Designation</label>
          <Input
            id="readme-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Your Role"
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-about" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">About Me / Bio</label>
          <Textarea
            id="readme-about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="About You"
            rows={4}
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-skills" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Skills</label>
          <Textarea
            id="readme-skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (comma-separated or list)"
            rows={3}
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-projects" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Projects / Repositories</label>
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
        <div>
          <label htmlFor="readme-socials" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Social Links</label>
          <Textarea
            id="readme-socials"
            value={socials}
            onChange={(e) => setSocials(e.target.value)}
            placeholder="Social Links (comma-separated or list)"
            rows={3}
            loading={loading}
            disabled={loading}
          />
        </div>

        {/* GitHub Stats Card Section */}
        <div className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
              📊 GitHub Stats Builder
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={githubStats.enabled}
                onChange={(e) => setGithubStats({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {githubStats.enabled && (
            <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stats-username" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">GitHub Username</label>
                  <Input
                    id="stats-username"
                    value={githubStats.username}
                    onChange={(e) => setGithubStats({ username: e.target.value })}
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label htmlFor="stats-theme-select" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Card Theme</label>
                  <select
                    id="stats-theme-select"
                    value={githubStats.theme}
                    onChange={(e) => setGithubStats({ theme: e.target.value })}
                    className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
                  >
                    <option value="default">Default</option>
                    <option value="radical">Radical</option>
                    <option value="tokyonight">Tokyo Night</option>
                    <option value="onedark">One Dark</option>
                    <option value="neon">Neon</option>
                    <option value="synthwave">Synthwave</option>
                    <option value="dracula">Dracula</option>
                    <option value="merko">Merko</option>
                  </select>
                </div>
              </div>

              {/* Formatting modifiers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={githubStats.showIcons}
                    onChange={(e) => setGithubStats({ showIcons: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <span>Show Icons</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={githubStats.hideBorder}
                    onChange={(e) => setGithubStats({ hideBorder: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <span>Hide Border</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={githubStats.compactMode}
                    onChange={(e) => setGithubStats({ compactMode: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <span>Compact Langs</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-700 dark:text-gray-300">Stats Layout:</span>
                  <select
                    value={githubStats.layout}
                    onChange={(e) => setGithubStats({ layout: e.target.value as any })}
                    className="text-xs px-2 py-1 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  >
                    <option value="default">Default</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>
              </div>

              {/* Cards Management */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-bold">Manage & Reorder Cards</span>
                {githubStats.cardOrder.map((cardId, index) => {
                  const cardConfig = githubStats.cardConfigs[cardId];
                  const label = cardId === 'stats' ? 'General Stats' : cardId === 'languages' ? 'Top Languages' : 'Streak Stats';
                  
                  // Construct preview link if username is set
                  const themeParam = githubStats.theme !== 'default' ? `&theme=${githubStats.theme}` : '';
                  const borderParam = githubStats.hideBorder ? '&hide_border=true' : '';
                  const iconsParam = githubStats.showIcons ? '&show_icons=true' : '';
                  
                  let previewUrl = '';
                  if (githubStats.username) {
                    if (cardId === 'stats') {
                      const layoutParam = githubStats.layout === 'compact' ? '&layout=compact' : '';
                      previewUrl = `https://github-readme-stats.vercel.app/api?username=${githubStats.username}${themeParam}${borderParam}${iconsParam}${layoutParam}`;
                    } else if (cardId === 'languages') {
                      const compactParam = githubStats.compactMode ? '&layout=compact' : '';
                      previewUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubStats.username}${themeParam}${borderParam}${compactParam}`;
                    } else if (cardId === 'streak') {
                      previewUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${githubStats.username}${themeParam}${borderParam}`;
                    }
                  }

                  const handleToggle = () => {
                    const newConfigs = { ...githubStats.cardConfigs };
                    newConfigs[cardId] = { ...newConfigs[cardId], enabled: !cardConfig.enabled };
                    setGithubStats({ cardConfigs: newConfigs });
                  };

                  const moveCard = (dir: 'up' | 'down') => {
                    const idx = githubStats.cardOrder.indexOf(cardId);
                    if (dir === 'up' && idx === 0) return;
                    if (dir === 'down' && idx === githubStats.cardOrder.length - 1) return;
                    const newOrder = [...githubStats.cardOrder];
                    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
                    const temp = newOrder[idx];
                    newOrder[idx] = newOrder[targetIdx];
                    newOrder[targetIdx] = temp;
                    setGithubStats({ cardOrder: newOrder });
                  };

                  return (
                    <div key={cardId} className="flex flex-col p-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`card-toggle-${cardId}`}
                            checked={cardConfig.enabled}
                            onChange={handleToggle}
                            className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                          />
                          <label htmlFor={`card-toggle-${cardId}`} className="text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">{label}</label>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveCard('up')}
                            disabled={index === 0}
                            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label={`Move ${label} up`}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCard('down')}
                            disabled={index === githubStats.cardOrder.length - 1}
                            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label={`Move ${label} down`}
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      {cardConfig.enabled && previewUrl && (
                        <div className="pt-2 flex justify-center bg-white dark:bg-black/30 p-2 rounded border border-gray-100 dark:border-gray-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewUrl}
                            alt={`${label} Preview`}
                            className="max-h-[140px] object-contain"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </form>
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <Button href="/theme" variant="secondary">Theme Studio</Button>
        <Button href="/roadmap-builder" variant="secondary">Create Roadmap</Button>
        <Button href="/preview" variant="primary">Preview Markdown</Button>
        <Button onClick={reset} variant="secondary">Clear</Button>
      </div>
    </div>
  );
};

export default READMEBuilderPage;
