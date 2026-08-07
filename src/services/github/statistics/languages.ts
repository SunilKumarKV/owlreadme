import { GitHubRepository } from '@/types/github';

export interface LanguageCalculationResult {
  primaryLanguage: string | null;
  languageDistribution: Record<string, number>;
}

/**
 * Calculates primary language and percentage distribution from real repository data.
 */
export function calculatePrimaryLanguage(repos: GitHubRepository[]): LanguageCalculationResult {
  if (!repos || repos.length === 0) {
    return {
      primaryLanguage: null,
      languageDistribution: {},
    };
  }

  const counts: Record<string, number> = {};
  let totalCount = 0;

  repos.forEach((repo) => {
    if (repo.language && repo.language.trim()) {
      const lang = repo.language.trim();
      // Give slightly higher weight to non-fork repos
      const weight = repo.isFork ? 1 : 2;
      counts[lang] = (counts[lang] || 0) + weight;
      totalCount += weight;
    }
  });

  if (totalCount === 0) {
    return {
      primaryLanguage: null,
      languageDistribution: {},
    };
  }

  let topLang: string | null = null;
  let maxWeight = -1;
  const distribution: Record<string, number> = {};

  Object.entries(counts).forEach(([lang, weight]) => {
    const pct = Math.round((weight / totalCount) * 100);
    distribution[lang] = pct;

    if (weight > maxWeight) {
      maxWeight = weight;
      topLang = lang;
    }
  });

  return {
    primaryLanguage: topLang,
    languageDistribution: distribution,
  };
}
