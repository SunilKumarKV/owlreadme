import { describe, it, expect } from 'vitest';
import useThemeStore from '../theme-store';

describe('useThemeStore', () => {
  it('should initialize with default values', () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBe('minimal');
    expect(state.templatesUsedCount).toBe(0);
  });

  it('should update theme and increment templatesUsedCount', () => {
    const store = useThemeStore.getState();
    store.setTheme('dark');

    const updated = useThemeStore.getState();
    expect(updated.theme).toBe('dark');
    expect(updated.templatesUsedCount).toBe(1);

    store.setTheme('gradient');
    const updated2 = useThemeStore.getState();
    expect(updated2.theme).toBe('gradient');
    expect(updated2.templatesUsedCount).toBe(2);
  });
});
