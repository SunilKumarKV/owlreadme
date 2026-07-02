import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useWorkspaceStore from '@/stores/workspace-store';
import useReadmeStore from '@/stores/readme-store';
import { useHistoryStore } from '@/stores/history-store';
import { fetchGithubProfile, fetchGithubRepos } from '@/utils/github-api';
import { getCurrentConfig } from '../utils/builder-helpers';

export const useBuilderWorkspace = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    workspaces,
    activeWorkspaceId,
    createWorkspace,
    setActiveWorkspaceId,
  } = useWorkspaceStore();

  const {
    setName,
    setRole,
    setAbout,
    setAvatarUrl,
    setFollowers,
    setFollowing,
    setPublicRepos,
    setGithubStats,
    setProjects,
    setSocials,
    setAchievements,
    setHeader,
  } = useReadmeStore();

  const { createSnapshot, pushUndo } = useHistoryStore();

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
        createSnapshot(
          'IMPORT Save point',
          'Automatic version save point',
          'import',
          getCurrentConfig()
        );
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
        setAchievements({ username });
        setHeader({ name: profile.name || profile.login });

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
    setAvatarUrl,
    setFollowers,
    setFollowing,
    setPublicRepos,
    setGithubStats,
    setProjects,
    setSocials,
    setAchievements,
    setHeader,
    createSnapshot,
    pushUndo,
  ]);

  return {
    loading,
    error,
    setError,
    workspaces,
    activeWorkspaceId,
    createWorkspace,
    setActiveWorkspaceId,
  };
};
