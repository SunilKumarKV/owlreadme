import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MotionWrapper from '../MotionWrapper';
import MotionProvider from '../MotionProvider';

describe('Motion Design System Suite', () => {
  it('renders MotionWrapper with children content', () => {
    render(<MotionWrapper preset="heroReveal">Animated Content</MotionWrapper>);
    expect(screen.getByText('Animated Content')).toBeInTheDocument();
  });

  it('respects MotionProvider reduced motion setting', () => {
    render(
      <MotionProvider reducedMotion={true}>
        <MotionWrapper type="zoom">Accessible Content</MotionWrapper>
      </MotionProvider>
    );
    expect(screen.getByText('Accessible Content')).toBeInTheDocument();
  });
});
