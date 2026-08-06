import { GitHubRateLimitInfo } from './api';
import { GitHubErrorDetail } from './errors';

export interface GitHubRepositoryOwner {
  login: string;
  id: number;
  avatarUrl: string;
  htmlUrl: string;
  type: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  isFork: boolean;
  isArchived: boolean;
  isDisabled: boolean;
  isTemplate: boolean;
  isPinned?: boolean;
  htmlUrl: string;
  homepage: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  language: string | null;
  topics: string[];
  license: { key: string; name: string; spdxId: string | null; url: string | null } | null;
  defaultBranch: string;
  size: number;
  owner: GitHubRepositoryOwner;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
}

export type RepositoryTypeFilter = 'all' | 'public' | 'private' | 'forks' | 'archived' | 'templates';
export type RepositorySortBy = 'stars' | 'updated' | 'created' | 'name';
export type RepositorySortOrder = 'asc' | 'desc';

export interface RepositoryFilterOptions {
  type?: RepositoryTypeFilter;
  search?: string;
  language?: string;
  sortBy?: RepositorySortBy;
  sortOrder?: RepositorySortOrder;
  page?: number;
  perPage?: number;
}

export interface RepositoriesState {
  repositories: GitHubRepository[];
  filteredRepositories: GitHubRepository[];
  isLoading: boolean;
  error: GitHubErrorDetail | null;
  rateLimit: GitHubRateLimitInfo | null;
  fromCache: boolean;
  options: RepositoryFilterOptions;
  totalPages: number;
  totalCount: number;
}

export interface RepositoryState {
  repository: GitHubRepository | null;
  isLoading: boolean;
  error: GitHubErrorDetail | null;
  rateLimit: GitHubRateLimitInfo | null;
  fromCache: boolean;
}

export interface PinnedRepositoriesState {
  pinnedRepositories: GitHubRepository[];
  isLoading: boolean;
  error: GitHubErrorDetail | null;
  fromGraphQL: boolean;
  fromCache: boolean;
}

export interface RepositoryContextValue extends RepositoriesState {
  setOptions: (options: Partial<RepositoryFilterOptions>) => void;
  setSearch: (query: string) => void;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export interface RepositoryProviderProps {
  username?: string;
  initialOptions?: RepositoryFilterOptions;
  children: React.ReactNode;
}
