import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRepositories } from '../useRepositories';
import { usePinnedRepositories } from '../usePinnedRepositories';
import { githubService } from '../../../services/github/githubService';

describe('useRepositories & usePinnedRepositories Hooks Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockRawRepos = [
    {
      id: 1,
      node_id: 'n1',
      name: 'owlreadme',
      full_name: 'octocat/owlreadme',
      private: false,
      owner: {
        login: 'octocat',
        id: 1,
        node_id: '',
        avatar_url: '',
        gravatar_id: '',
        url: '',
        html_url: '',
        followers_url: '',
        following_url: '',
        gists_url: '',
        starred_url: '',
        subscriptions_url: '',
        organizations_url: '',
        repos_url: '',
        events_url: '',
        received_events_url: '',
        type: 'User',
        site_admin: false,
      },
      html_url: 'https://github.com/octocat/owlreadme',
      description: 'Awesome README generator',
      fork: false,
      url: '',
      forks_url: '',
      keys_url: '',
      collaborators_url: '',
      teams_url: '',
      hooks_url: '',
      issue_events_url: '',
      events_url: '',
      assignees_url: '',
      branches_url: '',
      tags_url: '',
      blobs_url: '',
      git_tags_url: '',
      git_refs_url: '',
      trees_url: '',
      statuses_url: '',
      languages_url: '',
      stargazers_url: '',
      contributors_url: '',
      subscribers_url: '',
      subscription_url: '',
      commits_url: '',
      git_commits_url: '',
      comments_url: '',
      issue_comment_url: '',
      contents_url: '',
      compare_url: '',
      merges_url: '',
      archive_url: '',
      downloads_url: '',
      issues_url: '',
      pulls_url: '',
      milestones_url: '',
      notifications_url: '',
      labels_url: '',
      releases_url: '',
      deployments_url: '',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      pushed_at: '2024-01-01T00:00:00Z',
      git_url: '',
      ssh_url: '',
      clone_url: '',
      svn_url: '',
      homepage: null,
      size: 100,
      stargazers_count: 50,
      watchers_count: 50,
      language: 'TypeScript',
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      has_discussions: false,
      forks_count: 10,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 2,
      license: null,
      allow_forking: true,
      is_template: false,
      web_commit_signoff_required: false,
      topics: ['nextjs', 'typescript'],
      visibility: 'public',
      forks: 10,
      open_issues: 2,
      watchers: 50,
      default_branch: 'main',
    },
    {
      id: 2,
      node_id: 'n2',
      name: 'hello-world',
      full_name: 'octocat/hello-world',
      private: false,
      owner: {
        login: 'octocat',
        id: 1,
        node_id: '',
        avatar_url: '',
        gravatar_id: '',
        url: '',
        html_url: '',
        followers_url: '',
        following_url: '',
        gists_url: '',
        starred_url: '',
        subscriptions_url: '',
        organizations_url: '',
        repos_url: '',
        events_url: '',
        received_events_url: '',
        type: 'User',
        site_admin: false,
      },
      html_url: 'https://github.com/octocat/hello-world',
      description: 'First repository',
      fork: true,
      url: '',
      forks_url: '',
      keys_url: '',
      collaborators_url: '',
      teams_url: '',
      hooks_url: '',
      issue_events_url: '',
      events_url: '',
      assignees_url: '',
      branches_url: '',
      tags_url: '',
      blobs_url: '',
      git_tags_url: '',
      git_refs_url: '',
      trees_url: '',
      statuses_url: '',
      languages_url: '',
      stargazers_url: '',
      contributors_url: '',
      subscribers_url: '',
      subscription_url: '',
      commits_url: '',
      git_commits_url: '',
      comments_url: '',
      issue_comment_url: '',
      contents_url: '',
      compare_url: '',
      merges_url: '',
      archive_url: '',
      downloads_url: '',
      issues_url: '',
      pulls_url: '',
      milestones_url: '',
      notifications_url: '',
      labels_url: '',
      releases_url: '',
      deployments_url: '',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      pushed_at: '2023-01-01T00:00:00Z',
      git_url: '',
      ssh_url: '',
      clone_url: '',
      svn_url: '',
      homepage: null,
      size: 50,
      stargazers_count: 10,
      watchers_count: 10,
      language: 'JavaScript',
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      has_discussions: false,
      forks_count: 2,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 0,
      license: null,
      allow_forking: true,
      is_template: false,
      web_commit_signoff_required: false,
      topics: ['javascript'],
      visibility: 'public',
      forks: 2,
      open_issues: 0,
      watchers: 10,
      default_branch: 'main',
    },
  ];

  it('fetches repositories and supports filtering by search and type', async () => {
    vi.spyOn(githubService, 'getUserRepositories').mockResolvedValue({
      success: true,
      data: mockRawRepos,
      fromCache: false,
    });

    const { result } = renderHook(() => useRepositories('octocat'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allRepositories.length).toBe(2);

    act(() => {
      result.current.setSearch('owlreadme');
    });

    expect(result.current.filteredRepositories.length).toBe(1);
    expect(result.current.filteredRepositories[0].name).toBe('owlreadme');
  });

  it('fetches pinned repositories using GraphQL fallback', async () => {
    vi.spyOn(githubService, 'getPinnedRepositories').mockResolvedValue({
      success: true,
      data: [mockRawRepos[0]],
      fromGraphQL: false,
    });

    const { result } = renderHook(() => usePinnedRepositories('octocat'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pinnedRepositories.length).toBe(1);
    expect(result.current.pinnedRepositories[0].isPinned).toBe(true);
  });
});
