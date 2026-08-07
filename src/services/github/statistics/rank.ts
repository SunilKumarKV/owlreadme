export interface RankMetrics {
  stars: number;
  contributions: number | null;
  commits: number | null;
  repos: number;
  followers: number;
}

export interface RankResult {
  rank: string;
  score: number;
}

/**
 * Deterministic, explainable OwlREADME score and rank calculation based strictly on real metrics.
 */
export function calculateOwlRank(metrics: RankMetrics): RankResult {
  const starsScore = (metrics.stars || 0) * 4;
  const activityScore = Math.max(metrics.contributions || 0, metrics.commits || 0) * 1.5;
  const repoScore = (metrics.repos || 0) * 2;
  const followerScore = (metrics.followers || 0) * 3;

  const totalScore = Math.round(starsScore + activityScore + repoScore + followerScore);

  let rank = 'C';
  if (totalScore >= 1000) rank = 'S+';
  else if (totalScore >= 500) rank = 'S';
  else if (totalScore >= 250) rank = 'A+';
  else if (totalScore >= 100) rank = 'A';
  else if (totalScore >= 50) rank = 'B+';
  else if (totalScore >= 25) rank = 'B';

  return {
    rank,
    score: totalScore,
  };
}
