import { GITHUB_CONFIG } from '../../lib/github/constants';
import { buildQueryString } from '../../lib/github/helpers';

export const githubEndpoints = {
  userProfile: (username: string) => `${GITHUB_CONFIG.apiBaseUrl}/users/${encodeURIComponent(username)}`,
  userRepos: (username: string, params?: Record<string, string | number | boolean | undefined>) =>
    `${GITHUB_CONFIG.apiBaseUrl}/users/${encodeURIComponent(username)}/repos${buildQueryString(params)}`,
  repository: (owner: string, repo: string) =>
    `${GITHUB_CONFIG.apiBaseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
  repositoryReadme: (owner: string, repo: string) =>
    `${GITHUB_CONFIG.apiBaseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
  rawContent: (owner: string, repo: string, branch = 'main', path = 'README.md') =>
    `${GITHUB_CONFIG.rawBaseUrl}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${encodeURIComponent(path)}`,
  rateLimit: () => `${GITHUB_CONFIG.apiBaseUrl}/rate_limit`,
  graphql: () => `${GITHUB_CONFIG.apiBaseUrl}/graphql`,
} as const;
