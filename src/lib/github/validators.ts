import { GITHUB_CONFIG } from './constants';

const USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
const REPO_NAME_REGEX = /^[a-zA-Z0-9_.-]{1,100}$/;

export function isValidGitHubUsername(username: unknown): username is string {
  if (typeof username !== 'string') return false;
  const trimmed = username.trim();
  if (!trimmed || trimmed.length > 39) return false;
  return USERNAME_REGEX.test(trimmed);
}

export function isValidGitHubRepository(repoName: unknown): repoName is string {
  if (typeof repoName !== 'string') return false;
  const trimmed = repoName.trim();
  if (!trimmed || trimmed.length > 100) return false;
  return REPO_NAME_REGEX.test(trimmed);
}

export function isValidRawGitHubUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== 'https:') return false;
    return (GITHUB_CONFIG.allowedRawHostnames as readonly string[]).includes(parsed.hostname);
  } catch {
    return false;
  }
}
