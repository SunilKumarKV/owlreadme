import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window APIs in jsdom environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock URL.createObjectURL and revokeObjectURL
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  window.URL.revokeObjectURL = vi.fn();

  // Mock ResizeObserver — required by components using layout APIs
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

  // Mock IntersectionObserver — required by components using visibility APIs
  class MockIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
