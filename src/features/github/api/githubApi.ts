import { GITHUB_API_BASE_URL, GITHUB_ERROR_MESSAGES, DEFAULT_TIMEOUT_MS } from '../constants/github';
import { GitHubUserProfile, GitHubRepository, GitHubApiError } from '../types/github';
import { normalizeUsername } from '../utils/github';

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const signal = options.signal
    ? (AbortSignal as unknown as { any?: (signals: AbortSignal[]) => AbortSignal }).any
      ? (AbortSignal as unknown as { any: (signals: AbortSignal[]) => AbortSignal }).any([options.signal, controller.signal])
      : options.signal
    : controller.signal;

  try {
    const response = await fetch(url, {
      ...options,
      signal,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function handleResponseError(status: number, customMessage?: string): GitHubApiError {
  if (status === 404) {
    return {
      type: 'NOT_FOUND',
      status: 404,
      message: customMessage || GITHUB_ERROR_MESSAGES.NOT_FOUND,
    };
  }
  if (status === 403 || status === 429) {
    return {
      type: 'RATE_LIMITED',
      status,
      message: GITHUB_ERROR_MESSAGES.RATE_LIMITED,
    };
  }
  if (status >= 500) {
    return {
      type: 'UNAVAILABLE',
      status,
      message: GITHUB_ERROR_MESSAGES.UNAVAILABLE,
    };
  }
  return {
    type: 'UNKNOWN',
    status,
    message: customMessage || GITHUB_ERROR_MESSAGES.UNKNOWN,
  };
}

export async function fetchGitHubUserProfile(
  username: string,
  signal?: AbortSignal
): Promise<GitHubUserProfile> {
  const cleanUsername = normalizeUsername(username);
  const url = `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(cleanUsername)}`;

  try {
    const response = await fetchWithTimeout(url, { signal });
    if (!response.ok) {
      throw handleResponseError(response.status);
    }
    return (await response.json()) as GitHubUserProfile;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'type' in error) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw {
        type: 'TIMEOUT',
        status: null,
        message: GITHUB_ERROR_MESSAGES.TIMEOUT,
        rawError: error,
      } as GitHubApiError;
    }
    throw {
      type: 'UNKNOWN',
      status: null,
      message: error instanceof Error ? error.message : GITHUB_ERROR_MESSAGES.UNKNOWN,
      rawError: error,
    } as GitHubApiError;
  }
}

export async function fetchGitHubUserRepositories(
  username: string,
  signal?: AbortSignal
): Promise<GitHubRepository[]> {
  const cleanUsername = normalizeUsername(username);
  const url = `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`;

  try {
    const response = await fetchWithTimeout(url, { signal });
    if (!response.ok) {
      throw handleResponseError(response.status);
    }
    return (await response.json()) as GitHubRepository[];
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'type' in error) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw {
        type: 'TIMEOUT',
        status: null,
        message: GITHUB_ERROR_MESSAGES.TIMEOUT,
        rawError: error,
      } as GitHubApiError;
    }
    throw {
      type: 'UNKNOWN',
      status: null,
      message: error instanceof Error ? error.message : GITHUB_ERROR_MESSAGES.UNKNOWN,
      rawError: error,
    } as GitHubApiError;
  }
}
