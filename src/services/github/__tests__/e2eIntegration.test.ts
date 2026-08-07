import { describe, it, expect, vi, beforeEach } from 'vitest';
import { githubService } from '../githubService';
import { githubStatisticsService } from '../statistics/githubStatisticsService';
import { ReadmeGenerator } from '@/features/readme/generator/ReadmeGenerator';
import { exportService } from '@/services/export/exportService';
import * as exportUtils from '@/utils/export-utils';

describe('Phase 17 End-to-End Production Pipeline Verification Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('runs complete pipeline from Profile -> Repos -> Stats -> Generator -> Preview -> Export', async () => {
    // 1. Mock GitHub Profile API response
    vi.spyOn(githubService, 'getUserProfile').mockResolvedValue({
      success: true,
      data: {
        login: 'octocat',
        id: 583231,
        avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
        html_url: 'https://github.com/octocat',
        name: 'The Octocat',
        company: '@github',
        blog: 'https://github.blog',
        location: 'San Francisco',
        email: 'octocat@github.com',
        bio: 'GitHub mascot and open source maintainer',
        twitter_username: 'octocat',
        public_repos: 8,
        public_gists: 1,
        followers: 10000,
        following: 9,
        created_at: '2011-01-25T18:44:36Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    });

    // 2. Mock GitHub Repositories API response
    vi.spyOn(githubService, 'getUserRepositories').mockResolvedValue({
      success: true,
      data: [
        {
          id: 1296269,
          name: 'Hello-World',
          full_name: 'octocat/Hello-World',
          private: false,
          owner: { login: 'octocat', id: 583231, avatar_url: '', html_url: '', type: 'User' },
          html_url: 'https://github.com/octocat/Hello-World',
          url: 'https://api.github.com/repos/octocat/Hello-World',
          description: 'My first repository on GitHub!',
          fork: false,
          created_at: '2011-01-26T19:01:12Z',
          updated_at: '2024-01-01T00:00:00Z',
          pushed_at: '2024-01-01T00:00:00Z',
          homepage: '',
          size: 108,
          stargazers_count: 2200,
          watchers_count: 2200,
          language: 'TypeScript',
          forks_count: 1800,
          open_issues_count: 2,
          default_branch: 'master',
          topics: ['octocat', 'hello-world'],
        },
      ],
    });

    // 3. Execute statistics calculation
    const statsRes = await githubStatisticsService.getStatistics('octocat');
    expect(statsRes.success).toBe(true);
    expect(statsRes.data?.totalStars).toBe(2200);
    expect(statsRes.data?.primaryLanguage).toBe('TypeScript');
    expect(statsRes.data?.rank).toBe('S+');

    // 4. Generate README document payload with live repositories included in featured projects
    const { markdown, validation } = ReadmeGenerator.generate({
      profile: {
        login: 'octocat',
        id: 583231,
        avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
        profileUrl: 'https://github.com/octocat',
        name: 'The Octocat',
        company: '@github',
        blog: 'https://github.blog',
        location: 'San Francisco',
        email: 'octocat@github.com',
        bio: 'GitHub mascot and open source maintainer',
        twitterUsername: 'octocat',
        publicRepos: 8,
        publicGists: 1,
        followers: 10000,
        following: 9,
        createdAt: '2011-01-25T18:44:36Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      repositories: [
        {
          id: 1296269,
          name: 'Hello-World',
          fullName: 'octocat/Hello-World',
          description: 'My first repository on GitHub!',
          isPrivate: false,
          isFork: false,
          isArchived: false,
          isDisabled: false,
          isTemplate: false,
          htmlUrl: 'https://github.com/octocat/Hello-World',
          homepage: null,
          stars: 2200,
          forks: 1800,
          watchers: 2200,
          openIssues: 2,
          language: 'TypeScript',
          topics: ['octocat', 'hello-world'],
          license: null,
          defaultBranch: 'master',
          size: 108,
          owner: { login: 'octocat', id: 583231, avatarUrl: '', htmlUrl: '', type: 'User' },
          createdAt: '2011-01-26T19:01:12Z',
          updatedAt: '2024-01-01T00:00:00Z',
          pushedAt: '2024-01-01T00:00:00Z',
        },
      ],
      storeState: {
        featuredProjects: {
          enabled: true,
          cardStyle: 'modern',
          layout: '2-col',
          sortMode: 'stars',
          badgeStyle: 'flat',
          showStars: true,
          showForks: true,
          showLanguage: true,
          showTopics: true,
          projects: [
            {
              id: '1296269',
              source: 'github',
              repoName: 'Hello-World',
              title: 'Hello-World',
              description: 'My first repository on GitHub!',
              language: 'TypeScript',
              stars: 2200,
              forks: 1800,
              topics: ['octocat', 'hello-world'],
              repoUrl: 'https://github.com/octocat/Hello-World',
              updatedAt: '2024-01-01T00:00:00Z',
              pinned: false,
            },
          ],
        },
      },
    });

    expect(validation.isValid).toBe(true);
    expect(markdown).toContain('The Octocat');
    expect(markdown).toContain('Hello-World');

    // 5. Test Export process
    const downloadSpy = vi.spyOn(exportUtils, 'downloadTextFile').mockImplementation(() => {});

    const exportResult = await exportService.export(markdown, {
      format: 'markdown',
      filename: 'README.md',
    });

    expect(exportResult.success).toBe(true);
    expect(exportResult.filename).toBe('README.md');
    expect(downloadSpy).toHaveBeenCalledWith('README.md', markdown);
  });
});
