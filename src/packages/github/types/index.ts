export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  company: string | null;
  location: string | null;
  blog: string | null;
  email: string | null;
  hireable: boolean | null;
}

export interface GitHubRepo {
  name: string;
  htmlUrl: string;
  description: string | null;
  stargazersCount: number;
  forksCount: number;
  watchersCount: number;
  language: string | null;
  license: string | null;
  topics: string[];
  archived: boolean;
  updatedAt: string;
  defaultBranch: string;
}

export interface LanguageSummary {
  name: string;
  repoCount: number;
  percentage: number;
}

export interface ContributionActivity {
  commitsCount: number;
  starsCount: number;
  streakDays: number;
  yearlyActivity: { [year: string]: number };
  commitFrequency: { [dayOfWeek: string]: number };
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}
