import { githubClient } from '../githubClient';
import { githubEndpoints } from '../githubEndpoints';

export interface GraphQLContributionsResult {
  contributions: number | null;
  pullRequests: number | null;
  issues: number | null;
}

export async function fetchContributions(username: string): Promise<GraphQLContributionsResult> {
  if (!username || !username.trim()) {
    return { contributions: null, pullRequests: null, issues: null };
  }

  const query = `
    query GetContributions($username: String!) {
      user(login: $username) {
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
        }
      }
    }
  `;

  try {
    const res = await githubClient.post<{
      data?: {
        user?: {
          contributionsCollection?: {
            totalCommitContributions: number;
            totalIssueContributions: number;
            totalPullRequestContributions: number;
            totalPullRequestReviewContributions: number;
          };
        };
      };
    }>(githubEndpoints.graphql(), { query, variables: { username } });

    if (res.success && res.data?.data?.user?.contributionsCollection) {
      const c = res.data.data.user.contributionsCollection;
      const total =
        c.totalCommitContributions +
        c.totalIssueContributions +
        c.totalPullRequestContributions +
        c.totalPullRequestReviewContributions;

      return {
        contributions: total,
        pullRequests: c.totalPullRequestContributions,
        issues: c.totalIssueContributions,
      };
    }
  } catch {
    // Fallback to null
  }

  return { contributions: null, pullRequests: null, issues: null };
}
