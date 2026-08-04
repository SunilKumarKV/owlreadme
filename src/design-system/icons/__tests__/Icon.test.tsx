import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Icon from '../Icon';
import IconProvider from '../IconProvider';

describe('Icon Design System Suite', () => {
  it('renders SVG icon by registered name', () => {
    const { container } = render(<Icon name="rocket" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders accessible title and aria-label when not decorative', () => {
    render(<Icon name="github" decorative={false} ariaLabel="GitHub Repository" />);
    const img = screen.getByRole('img', { name: 'GitHub Repository' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label', 'GitHub Repository');
  });

  it('inherits global settings from IconProvider', () => {
    const { container } = render(
      <IconProvider size="lg" strokeWidth={3}>
        <Icon name="shield" />
      </IconProvider>
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('stroke-width', '3');
  });
});
