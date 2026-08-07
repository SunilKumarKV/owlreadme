import { describe, it, expect } from 'vitest';
import { ReadmeGenerator } from '../ReadmeGenerator';
import { ReadmeBuilder } from '../ReadmeBuilder';
import { validateGeneratedReadme } from '../ReadmeValidation';
import { GitHubUserProfile, GitHubRepository } from '@/types/github';

describe('README Generator Integration Suite', () => {
  const mockProfile: GitHubUserProfile = {
    login: 'octocat',
    id: 583231,
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    profileUrl: 'https://github.com/octocat',
    name: 'The Octocat',
    company: '@github',
    blog: 'https://github.blog',
    location: 'San Francisco',
    email: 'octocat@github.com',
    bio: 'Monalisa Octocat',
    twitterUsername: 'octocat',
    publicRepos: 8,
    publicGists: 0,
    followers: 10000,
    following: 9,
    createdAt: '2011-01-25T18:44:36Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockRepos: GitHubRepository[] = [
    {
      id: 101,
      name: 'owlreadme',
      fullName: 'octocat/owlreadme',
      description: 'Automated README Generator',
      isPrivate: false,
      isFork: false,
      isArchived: false,
      isDisabled: false,
      isTemplate: false,
      isPinned: true,
      htmlUrl: 'https://github.com/octocat/owlreadme',
      homepage: null,
      stars: 120,
      forks: 15,
      watchers: 120,
      openIssues: 0,
      language: 'TypeScript',
      topics: ['nextjs'],
      license: null,
      defaultBranch: 'main',
      size: 100,
      owner: {
        login: 'octocat',
        id: 583231,
        avatarUrl: '',
        htmlUrl: '',
        type: 'User',
      },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
    },
  ];

  it('generates valid markdown from GitHub profile and repository data', () => {
    const { markdown, validation } = ReadmeGenerator.generate({
      profile: mockProfile,
      repositories: mockRepos,
    });

    expect(markdown).toBeDefined();
    expect(markdown).toContain('The Octocat');
    expect(validation.isValid).toBe(true);
  });

  it('validates markdown hierarchy and reports clean results', () => {
    const markdown = '# Main Heading\n\n## Section 1\n\n### Sub-section';
    const validation = validateGeneratedReadme(markdown);

    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('builds custom markdown using ReadmeBuilder', () => {
    const builder = new ReadmeBuilder();
    const result = builder
      .addHeader('Jane Doe', 'Senior Engineer', 'https://avatar.com/jane.jpg')
      .addSection('Projects', 'Awesome Project 1')
      .build();

    expect(result).toContain('# Jane Doe');
    expect(result).toContain('## Senior Engineer');
    expect(result).toContain('### Projects');
  });
});
