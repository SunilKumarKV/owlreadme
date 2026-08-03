import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReadmePreview from '../ReadmePreview';
import BrowserFrame from '../BrowserFrame';
import WindowControls from '../WindowControls';
import PreviewFileName from '../PreviewFileName';

describe('Preview Window System Suite', () => {
  describe('WindowControls', () => {
    it('renders window dots with appropriate aria-labels', () => {
      render(<WindowControls />);
      expect(screen.getByRole('button', { name: 'Close window' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Minimize window' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Maximize window' })).toBeInTheDocument();
    });
  });

  describe('PreviewFileName', () => {
    it('renders file name text', () => {
      render(<PreviewFileName fileName="my-readme.md" />);
      expect(screen.getByText('my-readme.md')).toBeInTheDocument();
    });
  });

  describe('BrowserFrame', () => {
    it('renders header bar and children', () => {
      render(
        <BrowserFrame fileName="owlreadme-output.md">
          <div data-testid="frame-content">Content</div>
        </BrowserFrame>
      );
      expect(screen.getByText('owlreadme-output.md')).toBeInTheDocument();
      expect(screen.getByTestId('frame-content')).toBeInTheDocument();
    });
  });

  describe('ReadmePreview Master Component', () => {
    it('renders master preview shell without markdown or GitHub logic dependencies', () => {
      render(
        <ReadmePreview fileName="owlreadme-output.md">
          <div data-testid="preview-body-content">README Body Placeholder</div>
        </ReadmePreview>
      );
      expect(screen.getByText('owlreadme-output.md')).toBeInTheDocument();
      expect(screen.getByTestId('preview-body-content')).toBeInTheDocument();
      expect(screen.getByText('README Body Placeholder')).toBeInTheDocument();
    });
  });
});
