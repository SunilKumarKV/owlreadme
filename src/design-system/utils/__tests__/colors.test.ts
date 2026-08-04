import { describe, it, expect } from 'vitest';
import { getThemeTokens, getColorToken, getGradientToken, resolveThemeColor } from '../colors';
import { palette } from '../../colors/palette';

describe('Design System Color Tokens Suite', () => {
  it('provides dark theme tokens by default', () => {
    const theme = getThemeTokens();
    expect(theme.mode).toBe('dark');
    expect(theme.semantic.primary).toBe(palette.blue[600]);
    expect(theme.semantic.secondary).toBe(palette.purple[600]);
  });

  it('provides light theme tokens when specified', () => {
    const theme = getThemeTokens('light');
    expect(theme.mode).toBe('light');
    expect(theme.semantic.background).toBe('#ffffff');
  });

  it('retrieves semantic color token value', () => {
    const primaryDark = getColorToken('primary', 'dark');
    expect(primaryDark).toBe(palette.blue[600]);
  });

  it('retrieves gradient token value', () => {
    const primaryGradient = getGradientToken('primary', 'dark');
    expect(primaryGradient).toContain(palette.blue[600]);
    expect(primaryGradient).toContain(palette.purple[600]);
  });

  it('resolves semantic color or returns fallback string', () => {
    expect(resolveThemeColor('primary', 'dark')).toBe(palette.blue[600]);
    expect(resolveThemeColor('#ffffff', 'dark')).toBe('#ffffff');
  });
});
