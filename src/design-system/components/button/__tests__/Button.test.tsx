import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';

describe('Button Design System Suite', () => {
  it('renders primary button by default', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('renders secondary, outline, ghost, and link variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-800');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-gray-700');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('handles loading state with spinner and disables interaction', () => {
    const handleClick = vi.fn();
    render(<Button loading loadingText="Saving..." onClick={handleClick}>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders link anchor when href is provided', () => {
    render(<Button href="https://owlreadme.com" target="_blank">External Link</Button>);
    const link = screen.getByRole('link', { name: 'External Link' });
    expect(link).toHaveAttribute('href', 'https://owlreadme.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders ButtonGroup container', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button variant="secondary">Second</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
