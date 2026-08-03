import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReadmeContent from '../ReadmeContent';
import ReadmeHeading from '../ReadmeHeading';
import DeveloperComment from '../DeveloperComment';
import TechStackSection from '../TechStackSection';
import GithubStatsCard from '../GithubStatsCard';
import FeaturedRepositories from '../FeaturedRepositories';
import { DEFAULT_README_CONTENT_CONFIG } from '../../../constants/preview-content';

describe('ReadmeContent Presentation Layout System Suite', () => {
  describe('ReadmeHeading', () => {
    it('renders heading with username prop', () => {
      render(<ReadmeHeading username="octocat" />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm octocat 👋");
    });
  });

  describe('DeveloperComment', () => {
    it('renders developer HTML comment block', () => {
      render(<DeveloperComment comment="Full-Stack Engineer" />);
      expect(screen.getByText('<!-- Full-Stack Engineer -->')).toBeInTheDocument();
    });
  });

  describe('TechStackSection', () => {
    it('renders tech stack title and badges dynamically', () => {
      render(<TechStackSection badges={DEFAULT_README_CONTENT_CONFIG.techStack} />);
      expect(screen.getByText('Tech Stack')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });
  });

  describe('GithubStatsCard', () => {
    it('renders activity stats card with rank and metrics', () => {
      render(<GithubStatsCard config={DEFAULT_README_CONTENT_CONFIG.githubStats} />);
      expect(screen.getByText('GitHub Activity Stats')).toBeInTheDocument();
      expect(screen.getByText('Rank A+')).toBeInTheDocument();
      expect(screen.getByText('Total Stars')).toBeInTheDocument();
      expect(screen.getByText('1,240')).toBeInTheDocument();
    });
  });

  describe('FeaturedRepositories', () => {
    it('renders featured repository cards grid', () => {
      render(<FeaturedRepositories repositories={DEFAULT_README_CONTENT_CONFIG.repositories} />);
      expect(screen.getByText('Featured Repositories')).toBeInTheDocument();
      expect(screen.getByText('owlreadme')).toBeInTheDocument();
      expect(screen.getByText('next-starter-kit')).toBeInTheDocument();
    });
  });

  describe('ReadmeContent Layout', () => {
    it('renders complete README presentation layout from props without API fetching', () => {
      render(<ReadmeContent />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm sunilkumarkv 👋");
      expect(screen.getByText('<!-- Full-Stack Engineer -->')).toBeInTheDocument();
      expect(screen.getByText('Tech Stack')).toBeInTheDocument();
      expect(screen.getByText('GitHub Activity Stats')).toBeInTheDocument();
      expect(screen.getByText('Featured Repositories')).toBeInTheDocument();
    });
  });
});
