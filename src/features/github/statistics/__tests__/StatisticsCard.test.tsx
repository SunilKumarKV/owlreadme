import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatisticsCard from '../StatisticsCard';
import StatisticsSkeleton from '../StatisticsSkeleton';
import StatisticsError from '../StatisticsError';
import { GitHubStatistics } from '@/types/github';

describe('Statistics Component Suite', () => {
  const mockStats: GitHubStatistics = {
    username: 'octocat',
    totalStars: 250,
    primaryLanguage: 'TypeScript',
    totalCommits: 450,
    contributions: 620,
    pullRequests: 30,
    issues: 12,
    repositoryCount: 15,
    followers: 1200,
    following: 10,
    rank: 'A+',
    score: 480,
    languageDistribution: { TypeScript: 70, Python: 30 },
    generatedAt: '2024-01-01T00:00:00Z',
  };

  it('renders StatisticsCard with calculated metrics and rank badge', () => {
    render(<StatisticsCard statistics={mockStats} />);
    expect(screen.getByText('GitHub Activity Stats')).toBeInTheDocument();
    expect(screen.getByText('Rank A+')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();
    expect(screen.getByText('620')).toBeInTheDocument();
  });

  it('renders StatisticsSkeleton with accessible aria-busy attribute', () => {
    render(<StatisticsSkeleton />);
    expect(screen.getByLabelText('Loading GitHub activity statistics')).toBeInTheDocument();
  });

  it('renders StatisticsError with error message and retry button', () => {
    render(
      <StatisticsError
        error={{
          code: 'RATE_LIMITED',
          message: 'Rate limit exceeded',
          userMessage: 'GitHub API rate limit exceeded.',
        }}
        onRetry={() => {}}
      />
    );
    expect(screen.getByText('Statistics Unavailable')).toBeInTheDocument();
    expect(screen.getByText('GitHub API rate limit exceeded.')).toBeInTheDocument();
    expect(screen.getByText('Retry Loading Statistics')).toBeInTheDocument();
  });
});
