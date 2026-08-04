import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Card,
  GlassCard,
  MetricCard,
  RepositoryCard,
  StatsCard,
  FeatureCard,
} from '../';

describe('Card Design System Suite', () => {
  it('renders default Card container', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders GlassCard with backdrop blur', () => {
    render(<GlassCard blurLevel="lg">Glass Content</GlassCard>);
    expect(screen.getByText('Glass Content')).toBeInTheDocument();
  });

  it('renders MetricCard with quantitative value and title', () => {
    render(<MetricCard value="100%" title="Uptime" trend="+2.5%" trendDirection="up" />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
    expect(screen.getByText('+2.5%')).toBeInTheDocument();
  });

  it('renders RepositoryCard with GitHub repo details', () => {
    render(<RepositoryCard name="owlreadme" description="Awesome builder" stars={120} language="TypeScript" />);
    expect(screen.getByText('owlreadme')).toBeInTheDocument();
    expect(screen.getByText('Awesome builder')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('★ 120')).toBeInTheDocument();
  });

  it('renders FeatureCard with CTA button', () => {
    const handleCta = vi.fn();
    render(<FeatureCard title="Fast Build" description="Generates in seconds" ctaText="Learn More" onCtaClick={handleCta} />);
    expect(screen.getByText('Fast Build')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /Learn More/i });
    fireEvent.click(btn);
    expect(handleCta).toHaveBeenCalledTimes(1);
  });

  it('renders StatsCard container', () => {
    render(
      <StatsCard title="Activity Stats">
        <div>Stat 1</div>
        <div>Stat 2</div>
      </StatsCard>
    );
    expect(screen.getByText('Activity Stats')).toBeInTheDocument();
    expect(screen.getByText('Stat 1')).toBeInTheDocument();
    expect(screen.getByText('Stat 2')).toBeInTheDocument();
  });
});
