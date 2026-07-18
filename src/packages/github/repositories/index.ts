/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { validateGithubUsername, validateGithubRepoName } from '../validators';
import { getCachedValue, setCachedValue } from '../cache';
import { callGithubApi, callGithubGraphQL } from '../api';
import { getAuthHeaders } from '../auth';
import type { GitHubRepo } from '../types';
import { apiClient } from '../../api-client';


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
  } catch {
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

  // Step 1 — Verify the repository exists and fetch its default_branch.
  // This gives us a precise, actionable error message for each failure mode.
  const repoMetaResult = await apiClient.request<{ default_branch: string }>(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    headers: { ...getAuthHeaders(), Accept: 'application/vnd.github+json' },
    timeout: 10000,
  });

  if (!repoMetaResult.success) {
    const { status } = repoMetaResult.error;
    if (status === 404) {
      throw new Error(`Repository "${owner}/${repo}" not found. Check the owner and repository name and try again.`);
    }
    if (status === 403) {
      const rateLimitReset = repoMetaResult.error.data?.headers?.['x-ratelimit-reset'];
      if (repoMetaResult.error.data?.message?.toLowerCase().includes('rate limit') || rateLimitReset) {
        throw new Error('GitHub API rate limit reached. Please wait a few minutes and try again.');
      }
      throw new Error(`Access denied to "${owner}/${repo}". The repository may be private.`);
    }
    if (status === 429) {
      throw new Error('Too many requests to GitHub. Please wait a moment and try again.');
    }
    if (repoMetaResult.error.code === 'NETWORK_ERROR') {
      throw new Error('Network error: Failed to connect to GitHub. Please check your internet connection.');
    }
    if (repoMetaResult.error.code === 'TIMEOUT_ERROR') {
      throw new Error('GitHub API request timed out. Please check your network connection and try again.');
    }
    throw new Error(`Failed to access repository "${owner}/${repo}": ${repoMetaResult.error.message}`);
  }

  // Step 2 — Fetch the README using the canonical /readme endpoint.
  // GitHub resolves the default branch and all README filename variants automatically.
  // Accept: application/vnd.github.raw returns the raw file content directly.
  const readmeResult = await apiClient.request<string>(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, {
    headers: {
      ...getAuthHeaders(),
      Accept: 'application/vnd.github.raw',
    },
    timeout: 10000,
  });

  if (!readmeResult.success) {
    const { status } = readmeResult.error;
    if (status === 404) {
      throw new Error(`No README file found in "${owner}/${repo}" (default branch: "${repoMetaResult.data.default_branch}").`);
    }
    if (status === 403) {
      throw new Error(`Access denied when reading README from "${owner}/${repo}". The repository may be private.`);
    }
    if (status === 429) {
      throw new Error('Too many requests to GitHub. Please wait a moment and try again.');
    }
    if (readmeResult.error.code === 'NETWORK_ERROR') {
      throw new Error('Network error while downloading README. Please check your internet connection.');
    }
    if (readmeResult.error.code === 'TIMEOUT_ERROR') {
      throw new Error('Timed out while downloading README. Please try again.');
    }
    throw new Error(`Failed to fetch README from "${owner}/${repo}": ${readmeResult.error.message}`);
  }

  const content = readmeResult.data;
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error(`README in "${owner}/${repo}" appears to be empty.`);
  }

  setCachedValue(cacheKey, content);
  return content;
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

