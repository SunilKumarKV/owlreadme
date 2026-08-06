import { useState, useEffect, useCallback, useMemo } from 'react';
import { githubService } from '../../services/github/githubService';
import { isValidGitHubUsername } from '../../lib/github/validators';
import { GitHubRepository, RepositoryFilterOptions, RepositoriesState } from '../../types/github/repository';
import { GitHubRawRepoResponse } from '../../types/github/responses';

export function mapRawRepoToRepository(raw: GitHubRawRepoResponse): GitHubRepository {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description,
    isPrivate: raw.private,
    isFork: raw.fork,
    isArchived: raw.archived || false,
    isDisabled: raw.disabled || false,
    isTemplate: raw.is_template || false,
    htmlUrl: raw.html_url,
    homepage: raw.homepage,
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    watchers: raw.watchers_count,
    openIssues: raw.open_issues_count,
    language: raw.language,
    topics: raw.topics || [],
    license: raw.license
      ? {
          key: raw.license.key,
          name: raw.license.name,
          spdxId: raw.license.spdx_id,
          url: raw.license.url,
        }
      : null,
    defaultBranch: raw.default_branch,
    size: raw.size,
    owner: raw.owner
      ? {
          login: raw.owner.login,
          id: raw.owner.id,
          avatarUrl: raw.owner.avatar_url,
          htmlUrl: raw.owner.html_url,
          type: raw.owner.type,
        }
      : {
          login: raw.full_name.split('/')[0] || 'user',
          id: 0,
          avatarUrl: '',
          htmlUrl: `https://github.com/${raw.full_name.split('/')[0] || 'user'}`,
          type: 'User',
        },
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at,
  };
}

export function useRepositories(username?: string, initialOptions: RepositoryFilterOptions = {}) {
  const [options, setOptionsState] = useState<RepositoryFilterOptions>({
    type: 'all',
    search: '',
    language: 'all',
    sortBy: 'updated',
    sortOrder: 'desc',
    page: 1,
    perPage: 12,
    ...initialOptions,
  });

  const [state, setState] = useState<Omit<RepositoriesState, 'options' | 'filteredRepositories' | 'totalPages' | 'totalCount'>>({
    repositories: [],
    isLoading: false,
    error: null,
    rateLimit: null,
    fromCache: false,
  });

  const fetchRepositories = useCallback(async () => {
    if (!username || !username.trim()) {
      setState({
        repositories: [],
        isLoading: false,
        error: null,
        rateLimit: null,
        fromCache: false,
      });
      return;
    }

    const trimmed = username.trim();
    if (!isValidGitHubUsername(trimmed)) {
      setState({
        repositories: [],
        isLoading: false,
        error: {
          code: 'INVALID_USERNAME',
          message: `Invalid GitHub username format: "${username}"`,
          userMessage: 'Please enter a valid GitHub username.',
        },
        rateLimit: null,
        fromCache: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await githubService.getUserRepositories(trimmed, {
        sort: 'updated',
        per_page: 100,
      });

      if (res.success && res.data) {
        const mappedRepos = res.data.map(mapRawRepoToRepository);
        setState({
          repositories: mappedRepos,
          isLoading: false,
          error: null,
          rateLimit: res.rateLimit || null,
          fromCache: Boolean(res.fromCache),
        });
      } else {
        setState({
          repositories: [],
          isLoading: false,
          error: res.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Failed to fetch repositories.',
            userMessage: 'Unable to load GitHub repositories. Please try again.',
          },
          rateLimit: res.rateLimit || null,
          fromCache: false,
        });
      }
    } catch (err: unknown) {
      setState({
        repositories: [],
        isLoading: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: (err as Error)?.message || 'An unexpected error occurred.',
          userMessage: 'An unexpected error occurred while loading repositories.',
        },
        rateLimit: null,
        fromCache: false,
      });
    }
  }, [username]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRepositories();
  }, [fetchRepositories]);

  const setOptions = useCallback((newOptions: Partial<RepositoryFilterOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions, page: newOptions.page ?? 1 }));
  }, []);

  const setSearch = useCallback((query: string) => {
    setOptionsState((prev) => ({ ...prev, search: query, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setOptionsState((prev) => ({ ...prev, page }));
  }, []);

  // Filter, search, and sort memoization
  const filteredRepositories = useMemo(() => {
    let result = [...state.repositories];

    // Filter by type
    if (options.type && options.type !== 'all') {
      if (options.type === 'public') result = result.filter((r) => !r.isPrivate);
      if (options.type === 'private') result = result.filter((r) => r.isPrivate);
      if (options.type === 'forks') result = result.filter((r) => r.isFork);
      if (options.type === 'archived') result = result.filter((r) => r.isArchived);
      if (options.type === 'templates') result = result.filter((r) => r.isTemplate);
    }

    // Filter by language
    if (options.language && options.language !== 'all') {
      result = result.filter(
        (r) => r.language?.toLowerCase() === options.language?.toLowerCase()
      );
    }

    // Search query
    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    const sortBy = options.sortBy || 'updated';
    const sortOrder = options.sortOrder || 'desc';
    const mult = sortOrder === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      if (sortBy === 'stars') return (a.stars - b.stars) * mult;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * mult;
      if (sortBy === 'created') return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * mult;
      return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * mult;
    });

    return result;
  }, [state.repositories, options.type, options.language, options.search, options.sortBy, options.sortOrder]);

  const perPage = options.perPage || 12;
  const page = options.page || 1;
  const totalCount = filteredRepositories.length;
  const totalPages = Math.ceil(totalCount / perPage) || 1;

  const paginatedRepositories = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRepositories.slice(start, start + perPage);
  }, [filteredRepositories, page, perPage]);

  return {
    ...state,
    options,
    repositories: paginatedRepositories,
    allRepositories: state.repositories,
    filteredRepositories,
    totalCount,
    totalPages,
    setOptions,
    setSearch,
    setPage,
    refetch: fetchRepositories,
  };
}

export default useRepositories;
