import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Typography from '../Typography';

describe('Typography Component Suite', () => {
  it('renders children with default paragraph element and body-md variant', () => {
    render(<Typography>Hello World</Typography>);
    const text = screen.getByText('Hello World');
    expect(text.tagName.toLowerCase()).toBe('p');
    expect(text).toHaveClass('text-base');
  });

  it('renders custom variant and element', () => {
    render(<Typography variant="display-xl" as="h1">Hero Title</Typography>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Hero Title');
    expect(heading).toHaveClass('font-black');
  });

  it('applies custom weight and alignment', () => {
    render(
      <Typography variant="body-lg" weight="extrabold" align="center">
        Centered Text
      </Typography>
    );
    const text = screen.getByText('Centered Text');
    expect(text).toHaveClass('font-extrabold');
    expect(text).toHaveClass('text-center');
  });
});
