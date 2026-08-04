import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProductHuntSection from '../ProductHuntSection';
import ProductHuntCard from '../ProductHuntCard';
import ProductHuntLogo from '../ProductHuntLogo';
import ProductHuntBadge from '../ProductHuntBadge';
import ProductHuntVote from '../ProductHuntVote';
import ProductHuntButton from '../ProductHuntButton';
import * as productHuntService from '../../../services/productHunt.service';

const mockPost = {
  id: 'ph-101',
  name: 'OwlREADME',
  tagline: 'Automated GitHub README Builder for Developers',
  votesCount: 450,
  url: 'https://www.producthunt.com/posts/owlreadme',
  slug: 'owlreadme',
};

describe('Product Hunt Section System Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Subcomponents', () => {
    it('renders ProductHuntLogo SVG', () => {
      const { container } = render(<ProductHuntLogo />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders ProductHuntBadge label', () => {
      render(<ProductHuntBadge label="FEATURED ON PRODUCT HUNT" />);
      expect(screen.getByText('FEATURED ON PRODUCT HUNT')).toBeInTheDocument();
    });

    it('renders ProductHuntVote count', () => {
      render(<ProductHuntVote votesCount={450} />);
      expect(screen.getByText('450')).toBeInTheDocument();
      expect(screen.getByText('UPVOTES')).toBeInTheDocument();
    });

    it('renders ProductHuntButton anchor link', () => {
      render(<ProductHuntButton url="https://www.producthunt.com/posts/owlreadme" />);
      const link = screen.getByRole('link', { name: /Visit on Product Hunt/i });
      expect(link).toHaveAttribute('href', 'https://www.producthunt.com/posts/owlreadme');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('renders ProductHuntCard layout', () => {
      render(<ProductHuntCard post={mockPost} />);
      expect(screen.getByText('OwlREADME')).toBeInTheDocument();
      expect(screen.getByText('Automated GitHub README Builder for Developers')).toBeInTheDocument();
      expect(screen.getByText('450')).toBeInTheDocument();
    });
  });

  describe('ProductHuntSection Visibility & Error Handling', () => {
    it('returns null when API is unavailable or returns no product data', async () => {
      vi.spyOn(productHuntService, 'fetchProductHuntData').mockResolvedValue({
        post: null,
        isAvailable: false,
        error: 'API unavailable',
      });

      const { container } = render(<ProductHuntSection />);
      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });

    it('renders section card when real Product Hunt data is returned', async () => {
      vi.spyOn(productHuntService, 'fetchProductHuntData').mockResolvedValue({
        post: mockPost,
        isAvailable: true,
      });

      render(<ProductHuntSection />);
      await waitFor(() => {
        expect(screen.getByText('OwlREADME')).toBeInTheDocument();
        expect(screen.getByText('Automated GitHub README Builder for Developers')).toBeInTheDocument();
      });
    });
  });
});
