import { validateGithubUsername, validateGithubRepoName } from '../validators';
import { getCachedValue, setCachedValue } from '../cache';
import { callGithubApi, callGithubGraphQL } from '../api';
import type { GitHubRepo } from '../types';

export async function fetchGithubRepos(username: string): Promise<GitHubRepo[]> {
  validateGithubUsername(username);
  const cacheKey = `repos:${username.toLowerCase()}`;
  const cached = getCachedValue<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  const rawList = await callGithubApi<any[]>(
    `/users/${encodeURIComponent(username.trim())}/repos?sort=updated&per_page=100`
  );

  const repos: GitHubRepo[] = rawList.map((raw) => ({
    name: raw.name,
    htmlUrl: raw.html_url,
    description: raw.description,
    stargazersCount: raw.stargazers_count || 0,
    forksCount: raw.forks_count || 0,
    watchersCount: raw.watchers_count || 0,
    language: raw.language || null,
    license: raw.license?.name || null,
    topics: raw.topics || [],
    archived: raw.archived || false,
    updatedAt: raw.updated_at || '',
    defaultBranch: raw.default_branch || 'main',
  }));

  setCachedValue(cacheKey, repos);
  return repos;
}

export async function fetchPinnedRepos(username: string): Promise<GitHubRepo[]> {
  validateGithubUsername(username);
  const cacheKey = `pinned:${username.toLowerCase()}`;
  const cached = getCachedValue<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  try {
    // Attempt with GraphQL API (if token has scope/access)
    const query = `
      query($username: String!) {
        user(login: $username) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                url
                description
                stargazers {
                  totalCount
                }
                forkCount
                watchers {
                  totalCount
                }
                primaryLanguage {
                  name
                }
                licenseInfo {
                  name
                }
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
                isArchived
                updatedAt
                defaultBranchRef {
                  name
                }
              }
            }
          }
        }
      }
    `;

    const data = await callGithubGraphQL<any>(query, { username });
    const nodes = data?.user?.pinnedItems?.nodes || [];
    const repos: GitHubRepo[] = nodes.map((node: any) => ({
      name: node.name,
      htmlUrl: node.url,
      description: node.description,
      stargazersCount: node.stargazers?.totalCount || 0,
      forksCount: node.forkCount || 0,
      watchersCount: node.watchers?.totalCount || 0,
      language: node.primaryLanguage?.name || null,
      license: node.licenseInfo?.name || null,
      topics: node.repositoryTopics?.nodes?.map((t: any) => t.topic.name) || [],
      archived: node.isArchived || false,
      updatedAt: node.updatedAt || '',
      defaultBranch: node.defaultBranchRef?.name || 'main',
    }));

    setCachedValue(cacheKey, repos);
    return repos;
  } catch (e) {
    // Fallback to top-starred repos if GraphQL fails
    const repos = await fetchGithubRepos(username);
    const pinned = repos
      .filter((r) => !r.archived)
      .sort((a, b) => b.stargazersCount - a.stargazersCount)
      .slice(0, 6);
    setCachedValue(cacheKey, pinned);
    return pinned;
  }
}

export async function fetchGithubReadme(owner: string, repo: string): Promise<string> {
  validateGithubUsername(owner);
  validateGithubRepoName(repo);

  const cacheKey = `readme:${owner.toLowerCase()}/${repo.toLowerCase()}`;
  const cached = getCachedValue<string>(cacheKey);
  if (cached) return cached;

  const tryRawUrl = async (branch: 'main' | 'master') => {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.text();
    }
    return null;
  };

  const mainReadme = await tryRawUrl('main');
  if (mainReadme !== null) {
    setCachedValue(cacheKey, mainReadme);
    return mainReadme;
  }

  const masterReadme = await tryRawUrl('master');
  if (masterReadme !== null) {
    setCachedValue(cacheKey, masterReadme);
    return masterReadme;
  }

  // Fallback to REST API contents fetch
  const rawData = await callGithubApi<any>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/README.md`,
    { headers: { Accept: 'application/vnd.github.v3.raw' } }
  );

  const text = typeof rawData === 'string' ? rawData : '';
  setCachedValue(cacheKey, text);
  return text;
}

export async function searchGithubRepos(
  query: string,
  options: { owner?: string; language?: string; topic?: string } = {}
): Promise<GitHubRepo[]> {
  let searchQ = query;
  if (options.owner) searchQ += ` user:${options.owner}`;
  if (options.language) searchQ += ` language:${options.language}`;
  if (options.topic) searchQ += ` topic:${options.topic}`;

  const res = await callGithubApi<any>(`/search/repositories?q=${encodeURIComponent(searchQ.trim())}`);
  const items = res.items || [];
  return items.map((raw: any) => ({
    name: raw.name,
    htmlUrl: raw.html_url,
    description: raw.description,
    stargazersCount: raw.stargazers_count || 0,
    forksCount: raw.forks_count || 0,
    watchersCount: raw.watchers_count || 0,
    language: raw.language || null,
    license: raw.license?.name || null,
    topics: raw.topics || [],
    archived: raw.archived || false,
    updatedAt: raw.updated_at || '',
    defaultBranch: raw.default_branch || 'main',
  }));
}

