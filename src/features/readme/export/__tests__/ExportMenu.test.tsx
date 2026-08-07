import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExportMenu from '../ExportMenu';
import ExportButton from '../ExportButton';

describe('Export UI Component Suite', () => {
  it('renders ExportButton with correct label and handles click', () => {
    const handleClick = vi.fn();
    render(<ExportButton label="Download README" onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'Download README' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders ExportMenu dropdown and triggers selection callback', () => {
    const handleSelect = vi.fn();
    render(<ExportMenu onSelectFormat={handleSelect} />);

    const trigger = screen.getByRole('button', { name: /export document/i });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    const markdownOption = screen.getByText('README.md');
    expect(markdownOption).toBeInTheDocument();

    fireEvent.click(markdownOption);
    expect(handleSelect).toHaveBeenCalledWith('markdown');
  });
});
