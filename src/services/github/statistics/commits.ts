import { githubClient } from '../githubClient';
import { githubEndpoints } from '../githubEndpoints';

/**
 * Attempts to fetch total commits count via GitHub Search or GraphQL API.
 * Returns null if commit statistics cannot be determined reliably.
 */
export async function fetchTotalCommits(username: string): Promise<number | null> {
  if (!username || !username.trim()) return null;

  try {
    const searchUrl = `${githubEndpoints.graphql().replace('/graphql', '')}/search/commits?q=author:${encodeURIComponent(username)}`;
    const res = await githubClient.get<{ total_count?: number }>(searchUrl, { useCache: true });

    if (res.success && res.data && typeof res.data.total_count === 'number') {
      return res.data.total_count;
    }
  } catch {
    // Fallback to null
  }

  return null;
}
