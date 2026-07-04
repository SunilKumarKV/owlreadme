import { validateGithubUsername } from '../validators';
import { getCachedValue, setCachedValue } from '../cache';
import { callGithubApi } from '../api';
import type { GitHubProfile } from '../types';

export async function fetchGithubProfile(username: string): Promise<GitHubProfile> {
  validateGithubUsername(username);
  const cacheKey = `profile:${username.toLowerCase()}`;
  const cached = getCachedValue<GitHubProfile>(cacheKey);
  if (cached) return cached;

  const raw = await callGithubApi<any>(`/users/${encodeURIComponent(username.trim())}`);
  
  const profile: GitHubProfile = {
    login: raw.login,
    name: raw.name,
    bio: raw.bio,
    avatarUrl: raw.avatar_url,
    profileUrl: raw.html_url,
    followers: raw.followers || 0,
    following: raw.following || 0,
    publicRepos: raw.public_repos || 0,
    company: raw.company,
    location: raw.location,
    blog: raw.blog,
    email: raw.email || null,
    hireable: raw.hireable || null,
  };

  setCachedValue(cacheKey, profile);
  return profile;
}
