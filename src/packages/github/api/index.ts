/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { getAuthHeaders } from '../auth';
import { handleApiError } from '../utils';

const GITHUB_REST_API_URL = 'https://api.github.com';
const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql';

export async function callGithubApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_REST_API_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string>),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await handleApiError(response, `GitHub API call to ${endpoint} failed.`);
    }

    return response.json() as Promise<T>;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('GitHub API request timed out after 10 seconds. Please check your network connection and try again.');
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Failed to connect to GitHub. Please check your internet connection.');
    }
    throw error;
  }
}

export async function callGithubGraphQL<T>(query: string, variables: any = {}): Promise<T> {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'application/json',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(GITHUB_GRAPHQL_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await handleApiError(response, 'GitHub GraphQL API call failed.');
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(`GitHub GraphQL error: ${result.errors.map((e: any) => e.message).join(', ')}`);
    }

    return result.data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('GitHub API request timed out after 10 seconds. Please check your network connection and try again.');
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Failed to connect to GitHub. Please check your internet connection.');
    }
    throw error;
  }
}
