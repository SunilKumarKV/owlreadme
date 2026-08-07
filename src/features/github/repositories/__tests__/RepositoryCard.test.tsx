import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RepositoryCard from '../RepositoryCard';
import RepositorySkeleton from '../RepositorySkeleton';
import RepositoryError from '../RepositoryError';
import { GitHubRepository } from '@/types/github';

describe('Repositories Component Suite', () => {
  const mockRepo: GitHubRepository = {
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
    homepage: 'https://owlreadme.dev',
    stars: 1250,
    forks: 85,
    watchers: 1250,
    openIssues: 3,
    language: 'TypeScript',
    topics: ['nextjs', 'tailwind', 'typescript'],
    license: { key: 'mit', name: 'MIT License', spdxId: 'MIT', url: null },
    defaultBranch: 'main',
    size: 2048,
    owner: {
      login: 'octocat',
      id: 583231,
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
      htmlUrl: 'https://github.com/octocat',
      type: 'User',
    },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    pushedAt: '2024-02-01T00:00:00Z',
  };

  it('renders RepositoryCard with name, description, badges, and stats', () => {
    render(<RepositoryCard repository={mockRepo} />);
    expect(screen.getByText('owlreadme')).toBeInTheDocument();
    expect(screen.getByText('Automated README Generator')).toBeInTheDocument();
    expect(screen.getByText('Pinned')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
  });

  it('renders RepositorySkeleton with accessible aria-busy attribute', () => {
    render(<RepositorySkeleton />);
    expect(screen.getByLabelText('Loading repositories data')).toBeInTheDocument();
  });

  it('renders RepositoryError with error message and retry button', () => {
    render(
      <RepositoryError
        error={{
          code: 'NOT_FOUND',
          message: 'Repositories not found',
          userMessage: 'The requested GitHub repositories could not be loaded.',
        }}
        onRetry={() => {}}
      />
    );
    expect(screen.getByText('Repositories Unavailable')).toBeInTheDocument();
    expect(screen.getByText('The requested GitHub repositories could not be loaded.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
