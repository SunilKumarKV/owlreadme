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

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw await handleApiError(response, `GitHub API call to ${endpoint} failed.`);
  }

  return response.json() as Promise<T>;
}

export async function callGithubGraphQL<T>(query: string, variables: any = {}): Promise<T> {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'application/json',
  };

  const response = await fetch(GITHUB_GRAPHQL_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw await handleApiError(response, 'GitHub GraphQL API call failed.');
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(`GitHub GraphQL error: ${result.errors.map((e: any) => e.message).join(', ')}`);
  }

  return result.data as T;
}
