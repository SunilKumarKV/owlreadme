import { GitHubErrorDetail } from './errors';
import { GitHubRateLimitInfo } from './api';

export interface GitHubUserProfile {
  login: string;
  id: number;
  avatarUrl: string;
  profileUrl: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitterUsername: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
  hireable?: boolean | null;
}

export interface ProfileState {
  profile: GitHubUserProfile | null;
  isLoading: boolean;
  error: GitHubErrorDetail | null;
  rateLimit: GitHubRateLimitInfo | null;
  fromCache: boolean;
}

export interface ProfileContextValue extends ProfileState {
  refetch: () => Promise<void>;
}

export interface ProfileProviderProps {
  username?: string;
  children: React.ReactNode;
}
