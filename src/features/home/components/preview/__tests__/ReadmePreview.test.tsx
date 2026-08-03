import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReadmePreview from '../ReadmePreview';
import PreviewWindowControls from '../PreviewWindowControls';
import PreviewFileName from '../PreviewFileName';
import PreviewHeader from '../PreviewHeader';
import PreviewContainer from '../PreviewContainer';

describe('ReadmePreview Component Suite', () => {
  describe('PreviewWindowControls', () => {
    it('renders control buttons and triggers callbacks', () => {
      const onClose = vi.fn();
      const onMinimize = vi.fn();
      const onMaximize = vi.fn();

      render(<PreviewWindowControls onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />);

      const closeBtn = screen.getByRole('button', { name: 'Close window' });
      const minBtn = screen.getByRole('button', { name: 'Minimize window' });
      const maxBtn = screen.getByRole('button', { name: 'Maximize window' });

      fireEvent.click(closeBtn);
      fireEvent.click(minBtn);
      fireEvent.click(maxBtn);

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onMinimize).toHaveBeenCalledTimes(1);
      expect(onMaximize).toHaveBeenCalledTimes(1);
    });
  });

  describe('PreviewFileName', () => {
    it('renders formatted file name pill', () => {
      render(<PreviewFileName fileName="owlreadme-output.md" />);
      expect(screen.getByText('owlreadme-output.md')).toBeInTheDocument();
    });

    it('formats un-suffixed file names automatically', () => {
      render(<PreviewFileName fileName="custom-readme" />);
      expect(screen.getByText('custom-readme.md')).toBeInTheDocument();
    });
  });

  describe('PreviewHeader', () => {
    it('renders header bar with window controls and file name', () => {
      render(<PreviewHeader fileName="owlreadme-output.md" />);
      expect(screen.getByText('owlreadme-output.md')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close window' })).toBeInTheDocument();
    });
  });

  describe('PreviewContainer', () => {
    it('renders container children inside glass frame', () => {
      render(<PreviewContainer><div data-testid="test-child">Child Content</div></PreviewContainer>);
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  describe('ReadmePreview', () => {
    it('renders complete browser preview window', () => {
      render(
        <ReadmePreview fileName="owlreadme-output.md">
          <div data-testid="preview-body">Sample Markdown Render</div>
        </ReadmePreview>
      );

      expect(screen.getByText('owlreadme-output.md')).toBeInTheDocument();
      expect(screen.getByTestId('preview-body')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Markdown Preview Content' })).toBeInTheDocument();
    });
  });
});
