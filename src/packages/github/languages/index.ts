import type { GitHubRepo, LanguageSummary } from '../types';

/**
 * Computes language analytics (percentage distribution, repo counts) based on repos list.
 */
export function calculateLanguageAnalytics(repos: GitHubRepo[]): LanguageSummary[] {
  if (!repos || repos.length === 0) return [];

  const langMap = new Map<string, number>();
  let totalCount = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1);
      totalCount++;
    }
  });

  if (totalCount === 0) return [];

  const summaries: LanguageSummary[] = Array.from(langMap.entries()).map(([name, count]) => ({
    name,
    repoCount: count,
    percentage: Math.round((count / totalCount) * 10000) / 100, // round to 2 decimals
  }));

  return summaries.sort((a, b) => b.percentage - a.percentage);
}
