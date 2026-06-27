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
  
  // Mock document.createElement a element click & download triggers
  // HTMLAnchorElement click method does nothing in jsdom, but we can spy/stub it.
}
