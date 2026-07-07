import {
  validateGithubUsername as newValidateGithubUsername,
  parseGithubRepositoryUrl as newParseGithubRepositoryUrl,
  fetchGithubProfile as newFetchGithubProfile,
  fetchGithubRepos as newFetchGithubRepos,
  fetchGithubReadme as newFetchGithubReadme,
} from '../packages/github';
import { apiClient } from '../packages/api-client';

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count?: number;
  fork: boolean;
  language?: string | null;
  topics?: string[];
  updated_at?: string;
  pushed_at?: string;
}

export function validateGithubUsername(username: string): void {
  newValidateGithubUsername(username);
}

export function parseGithubRepositoryUrl(url: string): { owner: string; repo: string } {
  return newParseGithubRepositoryUrl(url);
}

export async function fetchGithubReadmeByRepo(owner: string, repo: string): Promise<string> {
  return newFetchGithubReadme(owner, repo);
}

/**
 * Allowlisted hostnames that may be used for raw README import.
 * Restricts fetches to GitHub-owned raw content domains only,
 * preventing Server-Side Request Forgery (SSRF) to internal or
 * cloud-metadata endpoints (e.g. 169.254.169.254).
 */
const ALLOWED_RAW_HOSTNAMES = new Set([
  'raw.githubusercontent.com',
  'gist.githubusercontent.com',
]);

export async function fetchGithubReadmeFromRawUrl(rawUrl: string): Promise<string> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Please enter a valid raw URL.');
  }

  const trimmed = rawUrl.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Please enter a valid raw URL starting with https://.');
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Only HTTPS URLs are supported for raw README import.');
  }

  if (!ALLOWED_RAW_HOSTNAMES.has(parsed.hostname)) {
    throw new Error(
      'Only raw GitHub content URLs (raw.githubusercontent.com or gist.githubusercontent.com) are supported.'
    );
  }

  const res = await apiClient.get<string>(trimmed);
  if (!res.success) {
    throw new Error('Failed to fetch content from the specified URL. Please check the URL and try again.');
  }

  return res.data;
}

export async function fetchGithubProfile(username: string): Promise<GitHubProfile> {
  const profile = await newFetchGithubProfile(username);
  return {
    login: profile.login,
    name: profile.name,
    bio: profile.bio,
    avatar_url: profile.avatarUrl,
    html_url: profile.profileUrl,
    followers: profile.followers,
    following: profile.following,
    public_repos: profile.publicRepos,
    company: profile.company,
    location: profile.location,
    blog: profile.blog,
    twitter_username: null, // deprecated or empty
  };
}

export async function fetchGithubRepos(username: string): Promise<GitHubRepo[]> {
  const list = await newFetchGithubRepos(username);
  return list.map((repo) => ({
    name: repo.name,
    html_url: repo.htmlUrl,
    description: repo.description,
    stargazers_count: repo.stargazersCount,
    forks_count: repo.forksCount,
    open_issues_count: 0,
    fork: false,
    language: repo.language,
    topics: repo.topics,
    updated_at: repo.updatedAt,
    pushed_at: repo.updatedAt,
  }));
}
