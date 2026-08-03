import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LandingBackground from '../LandingBackground';
import BackgroundGradient from '../BackgroundGradient';
import BackgroundGlow from '../BackgroundGlow';
import BackgroundGrid from '../BackgroundGrid';
import BackgroundWave from '../BackgroundWave';
import BackgroundBlur from '../BackgroundBlur';
import BackgroundLayer from '../BackgroundLayer';

describe('Landing Background System Suite', () => {
  describe('BackgroundLayer', () => {
    it('renders layer wrapper with pointer-events-none and aria-hidden', () => {
      const { container } = render(
        <BackgroundLayer zIndex={2}>
          <div>Layer Content</div>
        </BackgroundLayer>
      );
      const layer = container.firstChild as HTMLElement;
      expect(layer).toHaveAttribute('aria-hidden', 'true');
      expect(layer).toHaveClass('pointer-events-none');
    });
  });

  describe('BackgroundGradient', () => {
    it('renders base gradient layer with hero variant by default', () => {
      const { container } = render(<BackgroundGradient />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BackgroundGlow', () => {
    it('renders radial glow blobs with hero position', () => {
      const { container } = render(<BackgroundGlow position="hero" color="dual" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BackgroundGrid', () => {
    it('renders perspective grid SVG element', () => {
      const { container } = render(<BackgroundGrid perspective opacity={0.15} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('BackgroundWave', () => {
    it('renders curved wave SVG element', () => {
      const { container } = render(<BackgroundWave />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('BackgroundBlur', () => {
    it('renders backdrop blur layer', () => {
      const { container } = render(<BackgroundBlur blurLevel="md" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('LandingBackground Master Component', () => {
    it('renders children with composed background layers', () => {
      render(
        <LandingBackground>
          <div data-testid="landing-content">Hero Content</div>
        </LandingBackground>
      );
      expect(screen.getByTestId('landing-content')).toBeInTheDocument();
      expect(screen.getByText('Hero Content')).toBeInTheDocument();
    });
  });
});
