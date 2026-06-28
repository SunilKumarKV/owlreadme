"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Clock,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Upload,
  Check,
  Eye,
  ArrowLeftRight,
  Sparkles,
  Save,
  ChevronRight,
  Search
} from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import useReadmeStore, { READMEStyleTemplate, GitHubStatsConfig, TechStackConfig, SocialLinksConfig } from '@/stores/readme-store';
import { useHistoryStore, Snapshot, computeConfigDiff } from '@/stores/history-store';
import { generateReadmeMarkdown } from '@/utils/markdown';
import { TECHNOLOGY_REGISTRY, CATEGORIES, Technology } from '@/utils/tech-registry';
import { SOCIAL_PLATFORM_REGISTRY, SOCIAL_CATEGORIES, SocialPlatform } from '@/utils/social-registry';
import { fetchGithubProfile, fetchGithubRepos } from '@/utils/github-api';

const MDMarkdown = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
) as any;

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
    techStack,
    socialLinks,
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
    setTechStack,
    setSocialLinks,
    reset,
  } = useReadmeStore();

  // ── Version History & Snapshot system ───────────────────────────────────
  const {
    snapshots,
    past,
    future,
    createSnapshot,
    deleteSnapshot,
    clearHistory,
    importSnapshots,
    pushUndo,
    undo,
    redo,
  } = useHistoryStore();

  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [manualSnapshotForm, setManualSnapshotForm] = useState({ title: '', description: '' });
  
  // Modals / compare states
  const [comparingSnapshot, setComparingSnapshot] = useState<Snapshot | null>(null);
  const [restoringSnapshot, setRestoringSnapshot] = useState<Snapshot | null>(null);
  const [copiedDiffCode, setCopiedDiffCode] = useState(false);
  const [diffVisualTab, setDiffVisualTab] = useState<'visual' | 'code' | 'summary'>('visual');

  const [selectedRestoreFields, setSelectedRestoreFields] = useState<Record<string, boolean>>({
    name: true,
    role: true,
    about: true,
    skills: true,
    projects: true,
    socials: true,
    avatarUrl: true,
    githubStats: true,
    techStack: true,
    socialLinks: true,
  });

  const getCurrentConfig = () => {
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

  const triggerAutoSnapshot = (source: Snapshot['source'], customTitle?: string) => {
    createSnapshot(
      customTitle || `${source.toUpperCase()} Save point`,
      'Automatic version save point',
      source,
      getCurrentConfig()
    );
  };

  const handleUndo = () => {
    const prev = undo(getCurrentConfig());
    if (prev) {
      useReadmeStore.setState(prev);
    }
  };

  const handleRedo = () => {
    const next = redo(getCurrentConfig());
    if (next) {
      useReadmeStore.setState(next);
    }
  };

  const handleManualSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSnapshotForm.title.trim()) return;
    createSnapshot(
      manualSnapshotForm.title,
      manualSnapshotForm.description || 'Manual backup snapshot',
      'manual',
      getCurrentConfig()
    );
    setManualSnapshotForm({ title: '', description: '' });
  };

  const executeSectionRestore = () => {
    if (!restoringSnapshot) return;
    const restorePayload: any = {};
    const cfg = restoringSnapshot.config;
    
    if (selectedRestoreFields.name) restorePayload.name = cfg.name;
    if (selectedRestoreFields.role) restorePayload.role = cfg.role;
    if (selectedRestoreFields.about) restorePayload.about = cfg.about;
    if (selectedRestoreFields.skills) restorePayload.skills = cfg.skills;
    if (selectedRestoreFields.projects) restorePayload.projects = cfg.projects;
    if (selectedRestoreFields.socials) restorePayload.socials = cfg.socials;
    if (selectedRestoreFields.avatarUrl) restorePayload.avatarUrl = cfg.avatarUrl;
    if (selectedRestoreFields.githubStats) restorePayload.githubStats = cfg.githubStats;
    if (selectedRestoreFields.techStack) restorePayload.techStack = cfg.techStack;
    if (selectedRestoreFields.socialLinks) restorePayload.socialLinks = cfg.socialLinks;
    
    // Save to undo stack before loading
    pushUndo(getCurrentConfig());
    useReadmeStore.setState(restorePayload);
    setRestoringSnapshot(null);
  };

  const handleUndoCapture = () => {
    pushUndo(getCurrentConfig());
  };

  const [compareSnapshotMarkdown, setCompareSnapshotMarkdown] = useState('');
  const [compareCurrentMarkdown, setCompareCurrentMarkdown] = useState('');

  useEffect(() => {
    if (comparingSnapshot) {
      try {
        setCompareSnapshotMarkdown(generateReadmeMarkdown(comparingSnapshot.config));
        setCompareCurrentMarkdown(generateReadmeMarkdown(getCurrentConfig()));
      } catch (err) {
        console.error('Failed to compile compare markdown', err);
      }
    } else {
      setCompareSnapshotMarkdown('');
      setCompareCurrentMarkdown('');
    }
  }, [comparingSnapshot]);

  // Keyboard shortcut listener for Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (isMeta && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (isMeta && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future]);

  const [techSearch, setTechSearch] = useState('');
  const [activeTechCategory, setActiveTechCategory] = useState<'All' | 'Languages' | 'Frontend' | 'Backend' | 'Database' | 'DevOps & Cloud' | 'Tools'>('All');
  const [socialSearch, setSocialSearch] = useState('');

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
        triggerAutoSnapshot('import', 'GitHub Profile Import');
        pushUndo(getCurrentConfig());
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
    setTechStack,
    setSocialLinks,
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
          onChange={(e) => {
            triggerAutoSnapshot('template', 'Style Template Change');
            pushUndo(getCurrentConfig());
            setTemplate(e.target.value as READMEStyleTemplate);
          }}
          className="w-full px-4 py-2 rounded-md border border-gray-350 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
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
            onFocus={handleUndoCapture}
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
            onFocus={handleUndoCapture}
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
            onFocus={handleUndoCapture}
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
            onFocus={handleUndoCapture}
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
            onFocus={handleUndoCapture}
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
            onFocus={handleUndoCapture}
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

        {/* Tech Stack Builder Section */}
        <div className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
              🛠️ Tech Stack Builder
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={techStack.enabled}
                onChange={(e) => setTechStack({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {techStack.enabled && (
            <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-all duration-300">
              {/* Badge Styling Customizer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tech-style-select" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Badge Style</label>
                  <select
                    id="tech-style-select"
                    value={techStack.style}
                    onChange={(e) => setTechStack({ style: e.target.value as any })}
                    className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
                  >
                    <option value="flat">Flat</option>
                    <option value="flat-square">Flat Square</option>
                    <option value="plastic">Plastic</option>
                    <option value="for-the-badge">For the Badge</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={techStack.iconOnly}
                      onChange={(e) => setTechStack({ iconOnly: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    />
                    <span>Icon Only Mode</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={techStack.groupByCategory}
                      onChange={(e) => setTechStack({ groupByCategory: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    />
                    <span>Group by Category</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={techStack.hideEmptyCategories}
                      onChange={(e) => setTechStack({ hideEmptyCategories: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    />
                    <span>Hide Empty Categories</span>
                  </label>
                </div>
              </div>

              {/* Tabs Bar & Search */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                  <div className="flex flex-wrap gap-1 border-b border-gray-100 dark:border-gray-800/60 pb-1">
                    {(['All', ...CATEGORIES] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setActiveTechCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition duration-150 cursor-pointer ${
                          activeTechCategory === cat
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="w-full md:w-64">
                    <Input
                      id="tech-search-input"
                      value={techSearch}
                      onChange={(e) => setTechSearch(e.target.value)}
                      placeholder="Search technologies..."
                    />
                  </div>
                </div>

                {/* Badges Selection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[220px] overflow-auto p-2 bg-gray-50 dark:bg-gray-900/40 rounded-md border border-gray-100 dark:border-gray-900">
                  {(() => {
                    const filtered = TECHNOLOGY_REGISTRY.filter((tech) => {
                      const matchesCategory = activeTechCategory === 'All' || tech.category === activeTechCategory;
                      const matchesSearch = tech.name.toLowerCase().includes(techSearch.toLowerCase());
                      return matchesCategory && matchesSearch;
                    });

                    if (filtered.length === 0) {
                      return <span className="col-span-full text-center text-xs text-gray-400 py-4">No technologies match your filters</span>;
                    }

                    return filtered.map((tech) => {
                      const isSelected = techStack.selectedIds.includes(tech.id);
                      return (
                        <button
                          type="button"
                          key={tech.id}
                          onClick={() => {
                            const selectedIds = isSelected
                              ? techStack.selectedIds.filter((id) => id !== tech.id)
                              : [...techStack.selectedIds, tech.id];
                            setTechStack({ selectedIds });
                          }}
                          className={`flex items-center justify-between p-2 rounded border text-xs transition duration-150 cursor-pointer ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {/* Visual small dot representing tech color */}
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: `#${tech.color}` }}
                            />
                            {tech.name}
                          </span>
                          {isSelected && <span>✓</span>}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Reordering & Previews List */}
              {techStack.selectedIds.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 font-bold">Manage & Order Selected Technologies</span>
                  <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
                    {techStack.selectedIds.map((techId, index) => {
                      const tech = TECHNOLOGY_REGISTRY.find((t) => t.id === techId);
                      if (!tech) return null;

                      const label = techStack.iconOnly ? '' : encodeURIComponent(tech.name);
                      const badgeUrl = `https://img.shields.io/badge/${label}-${tech.color}?style=${techStack.style}&logo=${tech.logo}&logoColor=${tech.logoColor}`;

                      const moveTech = (dir: 'up' | 'down') => {
                        const idx = techStack.selectedIds.indexOf(techId);
                        if (dir === 'up' && idx === 0) return;
                        if (dir === 'down' && idx === techStack.selectedIds.length - 1) return;
                        const newOrder = [...techStack.selectedIds];
                        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
                        const temp = newOrder[idx];
                        newOrder[idx] = newOrder[swapIdx];
                        newOrder[swapIdx] = temp;
                        setTechStack({ selectedIds: newOrder });
                      };

                      return (
                        <div
                          key={techId}
                          className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-semibold text-gray-400 w-4">#{index + 1}</span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={badgeUrl}
                              alt={tech.name}
                              className="max-h-[28px] object-contain"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => moveTech('up')}
                              disabled={index === 0}
                              className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                              aria-label={`Move ${tech.name} up`}
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => moveTech('down')}
                              disabled={index === techStack.selectedIds.length - 1}
                              className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                              aria-label={`Move ${tech.name} down`}
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTechStack({
                                  selectedIds: techStack.selectedIds.filter((id) => id !== techId),
                                });
                              }}
                              className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer ml-1"
                              aria-label={`Remove ${tech.name}`}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social Links Builder Section */}
        <div className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
              🔗 Social Links & Contact Builder
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={socialLinks.enabled}
                onChange={(e) => setSocialLinks({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {socialLinks.enabled && (
            <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-all duration-300">
              {/* Badge Styling & Modifiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="social-style-select" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Badge Style</label>
                  <select
                    id="social-style-select"
                    value={socialLinks.style}
                    onChange={(e) => setSocialLinks({ style: e.target.value as any })}
                    className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
                  >
                    <option value="flat">Flat</option>
                    <option value="flat-square">Flat Square</option>
                    <option value="plastic">Plastic</option>
                    <option value="for-the-badge">For the Badge</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={socialLinks.iconOnly}
                      onChange={(e) => setSocialLinks({ iconOnly: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    />
                    <span>Icon Only Mode</span>
                  </label>
                </div>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-64">
                <Input
                  id="social-search-input"
                  value={socialSearch}
                  onChange={(e) => setSocialSearch(e.target.value)}
                  placeholder="Search platforms..."
                />
              </div>

              {/* Platform Groups List */}
              <div className="space-y-6">
                {SOCIAL_CATEGORIES.map((category) => {
                  const categoryPlatforms = SOCIAL_PLATFORM_REGISTRY.filter(
                    (p) => p.category === category && p.name.toLowerCase().includes(socialSearch.toLowerCase())
                  );

                  if (categoryPlatforms.length === 0) return null;

                  return (
                    <div key={category} className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryPlatforms.map((platform) => {
                          const config = socialLinks.platforms[platform.id] || { enabled: false, value: '' };
                          const label = socialLinks.iconOnly ? '' : encodeURIComponent(platform.name);
                          const badgeUrl = `https://img.shields.io/badge/${label}-${platform.color}?style=${socialLinks.style}&logo=${platform.logo}&logoColor=${platform.logoColor}`;

                          const handleToggle = () => {
                            const newPlatforms = {
                              ...socialLinks.platforms,
                              [platform.id]: {
                                ...config,
                                enabled: !config.enabled,
                              },
                            };
                            setSocialLinks({ platforms: newPlatforms });
                          };

                          const handleChange = (val: string) => {
                            const newPlatforms = {
                              ...socialLinks.platforms,
                              [platform.id]: {
                                ...config,
                                value: val,
                              },
                            };
                            setSocialLinks({ platforms: newPlatforms });
                          };

                          const moveSocial = (dir: 'up' | 'down') => {
                            const idx = socialLinks.order.indexOf(platform.id);
                            if (dir === 'up' && idx === 0) return;
                            if (dir === 'down' && idx === socialLinks.order.length - 1) return;
                            const newOrder = [...socialLinks.order];
                            const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
                            const temp = newOrder[idx];
                            newOrder[idx] = newOrder[swapIdx];
                            newOrder[swapIdx] = temp;
                            setSocialLinks({ order: newOrder });
                          };

                          const orderIndex = socialLinks.order.indexOf(platform.id);

                          return (
                            <div
                              key={platform.id}
                              className={`flex flex-col p-3 rounded-md border transition duration-150 ${
                                config.enabled
                                  ? 'border-blue-200 dark:border-blue-900 bg-blue-50/10 dark:bg-blue-950/5'
                                  : 'border-gray-200 dark:border-gray-800'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={config.enabled}
                                    onChange={handleToggle}
                                    className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                  />
                                  <span>{platform.name}</span>
                                </label>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => moveSocial('up')}
                                    disabled={orderIndex <= 0}
                                    className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                    aria-label={`Move ${platform.name} up`}
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveSocial('down')}
                                    disabled={orderIndex === -1 || orderIndex >= socialLinks.order.length - 1}
                                    className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                    aria-label={`Move ${platform.name} down`}
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <div className="flex-1">
                                  <Input
                                    id={`social-input-${platform.id}`}
                                    value={config.value}
                                    onChange={(e) => handleChange(e.target.value)}
                                    placeholder={platform.placeholder}
                                    disabled={!config.enabled}
                                  />
                                </div>
                                {config.enabled && config.value.trim() && (
                                  <div className="flex justify-center bg-white dark:bg-black/35 p-1 rounded border border-gray-100 dark:border-gray-800/80 max-h-[36px] items-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={badgeUrl}
                                      alt={`${platform.name} Badge`}
                                      className="max-h-[22px] object-contain"
                                      loading="lazy"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
      {/* ── Version History Floating Trigger ── */}
      <div className="fixed right-6 bottom-24 z-40 select-none">
        <button
          onClick={() => setIsHistorySidebarOpen(true)}
          className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer text-xs"
        >
          🕒 Version History
        </button>
      </div>

      {/* ── History Sidebar Overlay ── */}
      {isHistorySidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div onClick={() => setIsHistorySidebarOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-3xs transition-opacity" />

          {/* Sidebar Body */}
          <div className="relative w-full max-w-sm bg-white dark:bg-[#121215] border-l border-gray-200 dark:border-gray-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200 text-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-850 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Version Timeline</h3>
              </div>
              <button
                onClick={() => setIsHistorySidebarOpen(false)}
                className="text-gray-400 hover:text-gray-650 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Undo/Redo & Manual Snapshot Controls */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0 space-y-4 select-none">
              {/* Undo/Redo stack buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={past.length === 0}
                  className="flex-1 px-3 py-2 text-2xs font-bold rounded-lg border border-gray-250 dark:border-gray-700 bg-white dark:bg-[#18181c] text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Undo last change (Ctrl+Z)"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Undo ({past.length})
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={future.length === 0}
                  className="flex-1 px-3 py-2 text-2xs font-bold rounded-lg border border-gray-250 dark:border-gray-700 bg-white dark:bg-[#18181c] text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Redo last change (Ctrl+Y)"
                >
                  <RotateCw className="h-3.5 w-3.5" /> Redo ({future.length})
                </button>
              </div>

              {/* Create Manual Snapshot form */}
              <form onSubmit={handleManualSnapshot} className="space-y-2">
                <div className="space-y-1">
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400">Save Current State</label>
                  <Input
                    value={manualSnapshotForm.title}
                    onChange={(e) => setManualSnapshotForm({ ...manualSnapshotForm, title: e.target.value })}
                    placeholder="e.g. Added tech badges"
                    className="text-xs py-1 px-2.5 rounded border-gray-300 bg-white"
                    required
                  />
                  <input
                    type="text"
                    value={manualSnapshotForm.description}
                    onChange={(e) => setManualSnapshotForm({ ...manualSnapshotForm, description: e.target.value })}
                    placeholder="Optional description (e.g. finished basic bio)"
                    className="w-full px-2.5 py-1 text-4xs rounded border border-gray-200 dark:bg-[#18181c] dark:border-gray-750 text-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-2xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Save className="h-3 w-3" /> Save Snapshot
                </button>
              </form>
            </div>

            {/* List Header Search */}
            <div className="px-4 py-2 flex-shrink-0 select-none">
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search version snapshots..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="pl-7 pr-3 py-1.5 w-full text-4xs rounded border border-gray-200 dark:bg-[#18181c] dark:border-gray-700 focus:outline-none focus:border-blue-500 text-gray-700 dark:text-gray-300 transition"
                />
              </div>
            </div>

            {/* Snapshots Scrollable timeline */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-editor-scrollbar">
              {snapshots.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                  No snapshot versions saved yet. Auto-snapshots are generated on templates and import changes.
                </div>
              ) : (
                snapshots
                  .filter((snap) =>
                    snap.title.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                    snap.description.toLowerCase().includes(historySearchQuery.toLowerCase())
                  )
                  .map((snap) => {
                    const sourceBadgeColors = {
                      ai: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
                      import: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
                      template: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
                      manual: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                      auto: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20',
                    };

                    return (
                      <div
                        key={snap.id}
                        className="group p-3 bg-gray-50/50 dark:bg-[#16161a] hover:bg-gray-50/80 dark:hover:bg-[#1c1c22] border border-gray-200 dark:border-gray-800 rounded-xl transition duration-150 relative text-left"
                      >
                        <div className="flex items-center justify-between mb-1.5 select-none">
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${sourceBadgeColors[snap.source] || sourceBadgeColors.auto}`}>
                            {snap.source}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-gray-850 dark:text-gray-200 mb-0.5">{snap.title}</h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal mb-2">{snap.description}</p>

                        {/* List of detected changes */}
                        {snap.changes && snap.changes.length > 0 && (
                          <div className="space-y-0.5 mb-3 border-l border-gray-200 dark:border-gray-800 pl-2 select-none">
                            {snap.changes.map((change, cIdx) => (
                              <div key={cIdx} className="text-4xs text-gray-450 dark:text-gray-500 flex items-center gap-1 font-medium">
                                <span className="text-blue-500">•</span> {change}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Card actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-150/40 dark:border-gray-850/60 select-none">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setRestoringSnapshot(snap)}
                              className="px-2 py-0.8 text-3xs font-extrabold rounded bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => setComparingSnapshot(snap)}
                              className="px-1.5 py-0.8 text-3xs font-bold rounded bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition cursor-pointer flex items-center gap-0.5"
                            >
                              <ArrowLeftRight className="h-2.5 w-2.5" /> Compare
                            </button>
                          </div>

                          <button
                            onClick={() => deleteSnapshot(snap.id)}
                            className="p-1 text-gray-450 hover:text-red-500 transition cursor-pointer"
                            title="Delete this snapshot version"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Sidebar actions footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0 select-none">
              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshots, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', 'readme-version-history.json');
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                disabled={snapshots.length === 0}
                className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181c] text-3xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-650 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3 w-3" /> Export JSON
              </button>

              <button
                onClick={() => {
                  if (confirm('Clear entire snapshot history? This cannot be undone.')) {
                    clearHistory();
                  }
                }}
                disabled={snapshots.length === 0}
                className="px-3 py-1.5 text-3xs font-bold text-red-500 hover:bg-red-500/10 rounded transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Version Comparison Dialog Overlay ── */}
      {comparingSnapshot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <ArrowLeftRight className="h-4.5 w-4.5 text-blue-500" /> Compare: {comparingSnapshot.title} vs Current Editor
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">Snapshot save time: {new Date(comparingSnapshot.timestamp).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setComparingSnapshot(null)}
                className="text-gray-400 hover:text-gray-600 transition font-bold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex border-b border-gray-105 dark:border-gray-850 px-6 bg-gray-50/30 dark:bg-[#15151b]/40 flex-shrink-0 select-none">
              {[
                { id: 'visual', label: '👁️ Visual Rendering Compare' },
                { id: 'code', label: '📄 Markdown Code Diff' },
                { id: 'summary', label: '⚙️ Changed Fields Summary' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDiffVisualTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-bold border-b-2 cursor-pointer transition ${
                    diffVisualTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-450 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Frame Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-editor-scrollbar text-xs">
              {diffVisualTab === 'visual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-stretch">
                  <div className="flex flex-col border border-red-500/10 rounded-xl overflow-hidden bg-red-500/[0.01]">
                    <h4 className="text-[10px] font-extrabold uppercase px-4 py-2 border-b border-red-500/10 text-red-500 bg-red-500/5 select-none">Snapshot Version</h4>
                    <div className="p-4 overflow-y-auto flex-1 custom-editor-scrollbar bg-white dark:bg-[#101012]">
                      <div data-color-mode={comparingSnapshot.config.template === 'minimal' ? 'light' : 'dark'} className="theme-preview-container">
                        <MDMarkdown source={compareSnapshotMarkdown} style={{ background: 'transparent', color: 'inherit' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col border border-green-500/10 rounded-xl overflow-hidden bg-green-500/[0.01]">
                    <h4 className="text-[10px] font-extrabold uppercase px-4 py-2 border-b border-green-500/10 text-green-600 dark:text-green-400 bg-green-500/5 select-none">Current Editor State</h4>
                    <div className="p-4 overflow-y-auto flex-1 custom-editor-scrollbar bg-white dark:bg-[#101012]">
                      <div data-color-mode={template === 'minimal' ? 'light' : 'dark'} className="theme-preview-container">
                        <MDMarkdown source={compareCurrentMarkdown} style={{ background: 'transparent', color: 'inherit' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {diffVisualTab === 'code' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-stretch font-mono text-[11px]">
                  <div className="flex flex-col border border-red-500/10 rounded-xl overflow-hidden">
                    <h4 className="text-[10px] font-extrabold uppercase px-4 py-2 border-b border-red-500/10 text-red-500 bg-red-500/5 select-none">Snapshot Raw MD</h4>
                    <textarea
                      readOnly
                      value={compareSnapshotMarkdown}
                      className="w-full flex-1 p-4 bg-gray-900 text-red-400 font-mono text-xs focus:outline-none resize-none leading-relaxed custom-editor-scrollbar"
                    />
                  </div>

                  <div className="flex flex-col border border-green-500/10 rounded-xl overflow-hidden">
                    <h4 className="text-[10px] font-extrabold uppercase px-4 py-2 border-b border-green-500/10 text-green-600 dark:text-green-400 bg-green-500/5 select-none">Active Workspace MD</h4>
                    <textarea
                      readOnly
                      value={compareCurrentMarkdown}
                      className="w-full flex-1 p-4 bg-gray-900 text-green-400 font-mono text-xs focus:outline-none resize-none leading-relaxed custom-editor-scrollbar"
                    />
                  </div>
                </div>
              )}

              {diffVisualTab === 'summary' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-3">Field level modifications list</h4>
                    <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-250 dark:border-gray-800 space-y-2 select-none">
                      {computeConfigDiff(comparingSnapshot.config, getCurrentConfig()).map((diff, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                          <span className="text-amber-550">⚠</span> {diff}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-105 dark:border-gray-850 pt-4 space-y-3">
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs select-none">Snapshot Metadata properties</h4>
                    <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-gray-500">
                      <div>
                        <span>Snapshot Source:</span>
                        <span className="font-bold text-blue-500 uppercase ml-1.5">{comparingSnapshot.source}</span>
                      </div>
                      <div>
                        <span>Snapshot ID:</span>
                        <span className="font-bold ml-1.5">{comparingSnapshot.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 flex-shrink-0 select-none">
              <button
                onClick={() => setComparingSnapshot(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Close Comparison
              </button>
              <button
                onClick={() => {
                  setRestoringSnapshot(comparingSnapshot);
                  setComparingSnapshot(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Restore Specific Sections
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Section-Level Restore Selection dialog ── */}
      {restoringSnapshot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 select-none">Confirm Restore</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1">Select sections to load:</h3>
              </div>
              <button
                onClick={() => setRestoringSnapshot(null)}
                className="text-gray-400 hover:text-gray-650 transition font-bold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed mb-2 select-none">
                Select which profile configurations you wish to restore from <b>{restoringSnapshot.title}</b> snapshot. Unchecked fields will remain untouched in your active editor workspace.
              </p>

              <div className="space-y-2.5 max-h-[40vh] overflow-y-auto custom-editor-scrollbar bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-250 dark:border-gray-800 select-none">
                {[
                  { id: 'name', label: '👤 Developer Name' },
                  { id: 'role', label: '💼 Professional Title/Role' },
                  { id: 'about', label: '🎯 About Me/Bio text' },
                  { id: 'skills', label: '🛠️ Skills checklist text' },
                  { id: 'projects', label: '📂 Projects Showcase text' },
                  { id: 'socials', label: '🌐 Social Contact links' },
                  { id: 'avatarUrl', label: '🖼️ Profile Avatar Image' },
                  { id: 'githubStats', label: '📊 GitHub Stats Cards' },
                  { id: 'techStack', label: '⚙️ Tech Badges List' },
                  { id: 'socialLinks', label: '🛡️ Social shields Badges' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2.5 cursor-pointer text-gray-700 dark:text-gray-300 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedRestoreFields[item.id]}
                      onChange={(e) =>
                        setSelectedRestoreFields({
                          ...selectedRestoreFields,
                          [item.id]: e.target.checked,
                        })
                      }
                      className="rounded text-blue-650 focus:ring-blue-500 dark:bg-gray-850 dark:border-gray-700"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 select-none">
              <button
                onClick={() => setRestoringSnapshot(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeSectionRestore}
                disabled={!Object.values(selectedRestoreFields).some(Boolean)}
                className="px-4 py-2 rounded-lg text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50"
              >
                Confirm Restore
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default READMEBuilderPage;
