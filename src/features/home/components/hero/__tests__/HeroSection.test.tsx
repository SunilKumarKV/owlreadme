import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HeroSection from '../HeroSection';
import HeroLeft from '../HeroLeft';
import HeroBadge from '../HeroBadge';
import HeroHeading from '../HeroHeading';
import HeroDescription from '../HeroDescription';
import HeroInput from '../HeroInput';
import HeroCTA from '../HeroCTA';
import FeatureChips from '../FeatureChips';
import { HERO_CONFIG } from '../../../constants/hero';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('Hero Section Component Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    vi.restoreAllMocks();
  });

  describe('HeroBadge', () => {
    it('renders release badge pill', () => {
      render(<HeroBadge text="✨ Introducing OwlREADME v1.2.0" icon="sparkles" />);
      expect(screen.getByText('✨ Introducing OwlREADME v1.2.0')).toBeInTheDocument();
    });
  });

  describe('HeroHeading', () => {
    it('renders prefix, highlight, and suffix correctly inside h1', () => {
      render(<HeroHeading prefix="Your GitHub Profile Automated in " highlight="Seconds." suffix="" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Your GitHub Profile Automated in Seconds.');
    });
  });

  describe('HeroDescription', () => {
    it('renders description subtitle text', () => {
      render(<HeroDescription text="Professional GitHub README Builder for developers." />);
      expect(screen.getByText('Professional GitHub README Builder for developers.')).toBeInTheDocument();
    });
  });

  describe('HeroInput', () => {
    it('renders input field with clear button when text is entered', () => {
      const onChange = vi.fn();
      const onClear = vi.fn();
      render(<HeroInput value="octocat" onChange={onChange} onClear={onClear} placeholder="Enter GitHub username" />);

      const input = screen.getByPlaceholderText('Enter GitHub username');
      expect(input).toHaveValue('octocat');

      const clearBtn = screen.getByRole('button', { name: 'Clear username input' });
      expect(clearBtn).toBeInTheDocument();

      fireEvent.click(clearBtn);
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('renders error message when error prop is set', () => {
      render(<HeroInput value="" onChange={vi.fn()} error="Invalid GitHub username" />);
      expect(screen.getByText('Invalid GitHub username')).toBeInTheDocument();
    });
  });

  describe('HeroCTA', () => {
    it('renders CTA button with label', () => {
      render(<HeroCTA label="Get Started →" />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      expect(button).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
      render(<HeroCTA label="Get Started →" disabled />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      expect(button).toBeDisabled();
    });
  });

  describe('FeatureChips', () => {
    it('renders dynamic feature chips from configuration', () => {
      render(<FeatureChips chips={HERO_CONFIG.featureChips} />);
      expect(screen.getByText('Free & Open Source')).toBeInTheDocument();
      expect(screen.getByText('Local Browser Storage')).toBeInTheDocument();
      expect(screen.getByText('1-Click Export Pack')).toBeInTheDocument();
    });
  });

  describe('HeroLeft', () => {
    it('renders hero left column components correctly', () => {
      render(<HeroLeft />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your GitHub Profile Automated in Seconds.');
      expect(screen.getByPlaceholderText('Enter GitHub username')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    });
  });

  describe('HeroSection Container', () => {
    it('renders two-column hero layout with onboarding form and preview placeholder', () => {
      const onStartBuilding = vi.fn();
      render(<HeroSection onStartBuilding={onStartBuilding} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your GitHub Profile Automated in Seconds.');
      expect(screen.getByPlaceholderText('Enter GitHub username')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    });
  });
});
