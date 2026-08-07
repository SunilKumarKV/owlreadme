import { GitHubRateLimitInfo } from './api';
import { GitHubErrorDetail } from './errors';

export interface GitHubStatistics {
  username: string;
  totalStars: number;
  primaryLanguage: string | null;
  totalCommits: number | null;
  contributions: number | null;
  pullRequests: number | null;
  issues: number | null;
  repositoryCount: number;
  followers: number;
  following: number;
  rank: string;
  score: number;
  languageDistribution: Record<string, number>;
  generatedAt: string;
}

export interface StatisticsState {
  statistics: GitHubStatistics | null;
  isLoading: boolean;
  error: GitHubErrorDetail | null;
  rateLimit: GitHubRateLimitInfo | null;
  fromCache: boolean;
}

export interface StatisticsContextValue extends StatisticsState {
  refetch: () => Promise<void>;
}

export interface StatisticsProviderProps {
  username?: string;
  children: React.ReactNode;
}
