import {
  validateGithubUsername as newValidateGithubUsername,
  parseGithubRepositoryUrl as newParseGithubRepositoryUrl,
  fetchGithubProfile as newFetchGithubProfile,
  fetchGithubRepos as newFetchGithubRepos,
  fetchGithubReadme as newFetchGithubReadme,
} from '../packages/github';

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

export async function fetchGithubReadmeFromRawUrl(rawUrl: string): Promise<string> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Please enter a valid raw URL.');
  }

  const trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error('Please enter a valid raw URL starting with https:// or http://.');
  }

  const res = await fetch(trimmed);
  if (!res.ok) {
    throw new Error('Failed to fetch content from the specified URL. Please check the URL and try again.');
  }

  return res.text();
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
