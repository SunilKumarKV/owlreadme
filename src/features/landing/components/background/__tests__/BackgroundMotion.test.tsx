import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import BackgroundMotion from '../BackgroundMotion';
import BackgroundParticles from '../BackgroundParticles';
import BackgroundParticle from '../BackgroundParticle';
import BackgroundLight from '../BackgroundLight';
import BackgroundLightStreak from '../BackgroundLightStreak';
import { DEFAULT_PARTICLES } from '../../../constants/background-animation';

describe('Background Animation System Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('BackgroundParticle', () => {
    it('renders single particle with inline styles', () => {
      const particle = DEFAULT_PARTICLES[0];
      const { container } = render(<BackgroundParticle particle={particle} />);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveStyle(`left: ${particle.x}%`);
      expect(element).toHaveStyle(`top: ${particle.y}%`);
    });
  });

  describe('BackgroundParticles', () => {
    it('renders exact count of particles', () => {
      const { container } = render(<BackgroundParticles count={6} />);
      const particles = container.querySelectorAll('.rounded-full');
      expect(particles.length).toBe(6);
    });
  });

  describe('BackgroundLight', () => {
    it('renders radial light blob', () => {
      const { container } = render(<BackgroundLight color="blue" speed={8} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BackgroundLightStreak', () => {
    it('renders light streak top line', () => {
      const { container } = render(<BackgroundLightStreak speed={12} opacity={0.15} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BackgroundMotion Master Component', () => {
    it('renders children with animation layers', () => {
      render(
        <BackgroundMotion>
          <div data-testid="motion-content">Animated Content</div>
        </BackgroundMotion>
      );
      expect(screen.getByTestId('motion-content')).toBeInTheDocument();
      expect(screen.getByText('Animated Content')).toBeInTheDocument();
    });
  });
});
