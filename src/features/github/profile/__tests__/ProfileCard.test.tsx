import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProfileCard from '../ProfileCard';
import ProfileSkeleton from '../ProfileSkeleton';
import ProfileError from '../ProfileError';
import { GitHubUserProfile } from '@/types/github';

describe('Profile Components Suite', () => {
  const mockProfile: GitHubUserProfile = {
    login: 'octocat',
    id: 583231,
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    profileUrl: 'https://github.com/octocat',
    name: 'The Octocat',
    company: '@github',
    blog: 'https://github.blog',
    location: 'San Francisco',
    email: null,
    bio: 'Monalisa Octocat',
    twitterUsername: 'octocat_twitter',
    publicRepos: 12,
    publicGists: 4,
    followers: 5000,
    following: 10,
    createdAt: '2011-01-25T18:44:36Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  it('renders ProfileCard with user details, stats, and links', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByText('The Octocat')).toBeInTheDocument();
    expect(screen.getByText('@octocat')).toBeInTheDocument();
    expect(screen.getByText('Monalisa Octocat')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
    expect(screen.getByText('@github')).toBeInTheDocument();
    expect(screen.getByText('San Francisco')).toBeInTheDocument();
  });

  it('renders ProfileSkeleton with accessible aria-busy attribute', () => {
    render(<ProfileSkeleton />);
    expect(screen.getByLabelText('Loading profile data')).toBeInTheDocument();
  });

  it('renders ProfileError with error message and retry button', () => {
    render(
      <ProfileError
        error={{
          code: 'NOT_FOUND',
          message: 'User not found',
          userMessage: 'The requested GitHub user could not be found.',
        }}
        onRetry={() => {}}
      />
    );
    expect(screen.getByText('User Not Found')).toBeInTheDocument();
    expect(screen.getByText('The requested GitHub user could not be found.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
