import { useEffect } from 'react';
import useReadmeStore, { RepoAnalysisResult } from '@/stores/readme-store';
import useWorkspaceStore from '@/stores/workspace-store';
import { fetchGithubProfile, fetchGithubRepos } from '@/utils/github-api';
import { analyzeRepositories } from '@/utils/repo-analyzer';

interface GithubProfileOptions {
  username: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGithubProfile = (options: GithubProfileOptions) => {
  const { username, setLoading, setError } = options;
  const readmeState = useReadmeStore();
  const {
    name: readmeName,
    role: readmeRole,
    about: readmeAbout,
    avatarUrl,
    followers,
    following,
    publicRepos,
    repoAnalysis,
    setName,
    setRole,
    setAbout,
    setProjects,
    setSocials,
    setAvatarUrl,
    setFollowers,
    setFollowing,
    setPublicRepos,
    setRepoAnalysis,
  } = readmeState;

  useEffect(() => {
    if (!username) return;

    const importGitHubData = async () => {
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
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to import GitHub data.');
      } finally {
        setLoading(false);
      }
    };

    importGitHubData();
  }, [username, setName, setRole, setAbout, setProjects, setSocials, setAvatarUrl, setFollowers, setFollowing, setPublicRepos, setRepoAnalysis, setLoading, setError]);

  return {
    readmeName,
    readmeRole,
    readmeAbout,
    avatarUrl,
    followers,
    following,
    publicRepos,
    repoAnalysis: repoAnalysis as RepoAnalysisResult | null,
    readmeState,
  };
};
