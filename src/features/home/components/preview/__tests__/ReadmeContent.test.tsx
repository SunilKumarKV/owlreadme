import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReadmeContent from '../ReadmeContent';
import ReadmeHeading from '../ReadmeHeading';
import ReadmeComment from '../ReadmeComment';
import TechStackSection from '../TechStackSection';
import ActivityStatsCard from '../ActivityStatsCard';
import RepositorySection from '../RepositorySection';
import { DEFAULT_README_CONTENT_CONFIG } from '../../../constants/preview-content';

describe('ReadmeContent Layout Component Suite', () => {
  describe('ReadmeHeading', () => {
    it('renders heading with username', () => {
      render(<ReadmeHeading username="octocat" />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm octocat 👋");
    });
  });

  describe('ReadmeComment', () => {
    it('renders HTML comment formatting', () => {
      render(<ReadmeComment comment="Full-Stack Engineer" />);
      expect(screen.getByText('<!-- Full-Stack Engineer -->')).toBeInTheDocument();
    });
  });

  describe('TechStackSection', () => {
    it('renders tech stack title and badges', () => {
      render(<TechStackSection badges={DEFAULT_README_CONTENT_CONFIG.techStack} />);
      expect(screen.getByText('Tech Stack')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });
  });

  describe('ActivityStatsCard', () => {
    it('renders activity stats card with title, rank, and metrics', () => {
      render(<ActivityStatsCard config={DEFAULT_README_CONTENT_CONFIG.activityStats} />);
      expect(screen.getByText('GitHub Activity Stats')).toBeInTheDocument();
      expect(screen.getByText('Rank A+')).toBeInTheDocument();
      expect(screen.getByText('Total Stars')).toBeInTheDocument();
      expect(screen.getByText('1,240')).toBeInTheDocument();
    });
  });

  describe('RepositorySection', () => {
    it('renders repository cards with name, description, stars, and language', () => {
      render(<RepositorySection repositories={DEFAULT_README_CONTENT_CONFIG.repositories} />);
      expect(screen.getByText('Featured Repositories')).toBeInTheDocument();
      expect(screen.getByText('owlreadme')).toBeInTheDocument();
      expect(screen.getByText('next-starter-kit')).toBeInTheDocument();
    });
  });

  describe('ReadmeContent Layout', () => {
    it('renders complete README content layout', () => {
      render(<ReadmeContent />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm sunilkumarkv 👋");
      expect(screen.getByText('<!-- Full-Stack Engineer -->')).toBeInTheDocument();
      expect(screen.getByText('Tech Stack')).toBeInTheDocument();
      expect(screen.getByText('GitHub Activity Stats')).toBeInTheDocument();
      expect(screen.getByText('Featured Repositories')).toBeInTheDocument();
    });
  });
});
