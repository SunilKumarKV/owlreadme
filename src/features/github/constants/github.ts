import { GitHubErrorType } from '../types/github';

export const GITHUB_API_BASE_URL = 'https://api.github.com';

export const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export const MIN_USERNAME_LENGTH = 1;
export const MAX_USERNAME_LENGTH = 39;

export const DEFAULT_DEBOUNCE_MS = 300;
export const DEFAULT_TIMEOUT_MS = 10000;

export const GITHUB_ERROR_MESSAGES: Record<GitHubErrorType, string> = {
  INVALID_USERNAME: 'Please enter a valid GitHub username (1-39 characters, alphanumeric or single hyphens).',
  NOT_FOUND: 'GitHub profile not found. Please verify the username.',
  RATE_LIMITED: 'GitHub API rate limit exceeded. Please wait a moment or try again later.',
  UNAVAILABLE: 'GitHub API is temporarily unavailable. Please try again shortly.',
  TIMEOUT: 'Request timed out. Please check your internet connection.',
  OFFLINE: 'You appear to be offline. Please check your network connection.',
  UNKNOWN: 'Failed to load GitHub profile data. Please try again.',
};
