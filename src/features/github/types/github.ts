export interface GitHubUserProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  topics?: string[];
  pushed_at: string;
  created_at: string;
  updated_at: string;
}

export type GitHubErrorType =
  | 'INVALID_USERNAME'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UNAVAILABLE'
  | 'TIMEOUT'
  | 'OFFLINE'
  | 'UNKNOWN';

export interface GitHubApiError {
  type: GitHubErrorType;
  status: number | null;
  message: string;
  rawError?: unknown;
}

export type GitHubFetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface GitHubValidationResult {
  valid: boolean;
  message: string | null;
  normalizedUsername: string;
}

export interface CombinedGitHubData {
  profile: GitHubUserProfile;
  repos: GitHubRepository[];
}

export interface UseGithubProfileOptions {
  username?: string | null;
  autoFetch?: boolean;
  debounceMs?: number;
  onSuccess?: (data: CombinedGitHubData) => void;
  onError?: (error: GitHubApiError) => void;
}
