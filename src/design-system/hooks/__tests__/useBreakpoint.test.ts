import { renderHook } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import useBreakpoint from '../useBreakpoint';

describe('useBreakpoint Responsive System Suite', () => {
  const originalWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth,
    });
  });

  function setWindowWidth(width: number) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  }

  it('correctly detects mobile viewports (<768px)', () => {
    setWindowWidth(375);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('correctly detects tablet viewports (768px - 1023px)', () => {
    setWindowWidth(800);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('correctly detects desktop viewports (>=1024px)', () => {
    setWindowWidth(1280);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('evaluates isAtLeast and isAtMost correctly', () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isAtLeast('lg')).toBe(true);
    expect(result.current.isAtMost('sm')).toBe(false);
  });
});
