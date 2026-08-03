import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AnnouncementBar from '../AnnouncementBar';
import AnnouncementBadge from '../AnnouncementBadge';
import AnnouncementContent from '../AnnouncementContent';
import AnnouncementCTA from '../AnnouncementCTA';
import AnnouncementCloseButton from '../AnnouncementCloseButton';
import { DEFAULT_ANNOUNCEMENT_CONFIG } from '../../../constants/announcement';
import { AnnouncementConfig } from '../../../types/announcement';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('AnnouncementBar Component Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  describe('AnnouncementBadge', () => {
    it('renders badge pill text', () => {
      render(<AnnouncementBadge text="v1.2.0" type="release" />);
      expect(screen.getByText('v1.2.0')).toBeInTheDocument();
    });
  });

  describe('AnnouncementContent', () => {
    it('renders title, badge, and subtitle correctly', () => {
      render(<AnnouncementContent config={DEFAULT_ANNOUNCEMENT_CONFIG} />);
      expect(screen.getByText('OwlREADME v1.2.0')).toBeInTheDocument();
      expect(screen.getByText('v1.2.0')).toBeInTheDocument();
      expect(screen.getByText(/Smarter. Faster. More Powerful./i)).toBeInTheDocument();
    });

    it('handles missing optional fields gracefully', () => {
      const minimalConfig: AnnouncementConfig = {
        id: 'test-1',
        type: 'feature',
        title: 'New Feature Unlocked',
        visible: true,
      };
      render(<AnnouncementContent config={minimalConfig} />);
      expect(screen.getByText('New Feature Unlocked')).toBeInTheDocument();
    });
  });

  describe('AnnouncementCTA', () => {
    it('renders anchor element for link CTA', () => {
      render(<AnnouncementCTA label="View Changelog →" href="#changelog" />);
      const link = screen.getByRole('link', { name: /View Changelog/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#changelog');
    });

    it('renders external link with target _blank', () => {
      render(<AnnouncementCTA label="Docs" href="https://owlreadme.com/docs" />);
      const link = screen.getByRole('link', { name: /Docs/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('AnnouncementCloseButton', () => {
    it('calls onDismiss when close button is clicked', () => {
      const onDismiss = vi.fn();
      render(<AnnouncementCloseButton onDismiss={onDismiss} />);
      const button = screen.getByRole('button', { name: 'Dismiss announcement' });
      fireEvent.click(button);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('AnnouncementBar Container', () => {
    it('renders visible announcement bar with aria-label', () => {
      render(<AnnouncementBar config={DEFAULT_ANNOUNCEMENT_CONFIG} />);
      const region = screen.getByRole('region', { name: 'Announcement' });
      expect(region).toBeInTheDocument();
    });

    it('dismisses announcement when dismiss button is clicked', () => {
      const onDismiss = vi.fn();
      render(<AnnouncementBar config={DEFAULT_ANNOUNCEMENT_CONFIG} onDismiss={onDismiss} />);

      const dismissBtn = screen.getByRole('button', { name: 'Dismiss announcement' });
      expect(dismissBtn).toBeInTheDocument();

      fireEvent.click(dismissBtn);

      expect(screen.queryByRole('region', { name: 'Announcement' })).not.toBeInTheDocument();
      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem(DEFAULT_ANNOUNCEMENT_CONFIG.dismissKey!)).toBe('true');
    });

    it('does not render if config visible is false', () => {
      const hiddenConfig: AnnouncementConfig = {
        ...DEFAULT_ANNOUNCEMENT_CONFIG,
        visible: false,
      };
      render(<AnnouncementBar config={hiddenConfig} />);
      expect(screen.queryByRole('region', { name: 'Announcement' })).not.toBeInTheDocument();
    });
  });
});
