import { GitHubRepository } from '@/types/github';

/**
 * Calculates the total number of stargazers across all non-duplicate owned repositories.
 */
export function calculateTotalStars(repos: GitHubRepository[]): number {
  if (!repos || repos.length === 0) return 0;

  const uniqueRepos = new Map<number, GitHubRepository>();

  repos.forEach((repo) => {
    // Only count non-fork repositories or owned original repositories to avoid double counting
    if (!repo.isFork) {
      uniqueRepos.set(repo.id, repo);
    }
  });

  let totalStars = 0;
  uniqueRepos.forEach((repo) => {
    totalStars += Math.max(0, repo.stars || 0);
  });

  return totalStars;
}
