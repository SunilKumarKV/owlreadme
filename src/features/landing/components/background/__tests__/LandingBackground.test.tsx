import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LandingBackground from '../LandingBackground';
import BackgroundGradient from '../BackgroundGradient';
import BackgroundGlow from '../BackgroundGlow';
import BackgroundGrid from '../BackgroundGrid';
import BackgroundWave from '../BackgroundWave';
import BackgroundBlur from '../BackgroundBlur';
import BackgroundLights from '../BackgroundLights';
import BackgroundOverlay from '../BackgroundOverlay';
import BackgroundLayer from '../BackgroundLayer';

describe('7-Layer Background Effects System Suite', () => {
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

  describe('BackgroundGradient (Layer 1)', () => {
    it('renders base gradient layer with hero variant by default', () => {
      const { container } = render(<BackgroundGradient />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BackgroundGlow (Layer 2)', () => {
    it('renders radial glow blobs with hero position', () => {
      const { container } = render(<BackgroundGlow position="hero" color="dual" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BackgroundBlur (Layer 3)', () => {
    it('renders backdrop blur layer', () => {
      const { container } = render(<BackgroundBlur blurLevel="md" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BackgroundGrid (Layer 4)', () => {
    it('renders perspective grid SVG element', () => {
      const { container } = render(<BackgroundGrid perspective opacity={0.15} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('BackgroundWave (Layer 5)', () => {
    it('renders curved wave SVG element', () => {
      const { container } = render(<BackgroundWave />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('BackgroundLights (Layer 6)', () => {
    it('renders animated lights layer', () => {
      const { container } = render(<BackgroundLights />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('BackgroundOverlay (Layer 8)', () => {
    it('renders visual overlay layer', () => {
      const { container } = render(<BackgroundOverlay />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('LandingBackground Master 7-Layer Component', () => {
    it('renders children with composed 7 background layers', () => {
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
