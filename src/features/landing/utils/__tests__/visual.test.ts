import { describe, it, expect } from 'vitest';
import { getGlassStyle, getShadowStyle, getBorderStyle } from '../visual';
import { GLASS_STYLES } from '../../styles/glass';
import { SHADOW_STYLES } from '../../styles/shadows';
import { BORDER_STYLES } from '../../styles/borders';

describe('Visual Polish Design System Utilities', () => {
  describe('getGlassStyle', () => {
    it('returns requested glass style token', () => {
      expect(getGlassStyle('card')).toBe(GLASS_STYLES.card);
      expect(getGlassStyle('panel')).toBe(GLASS_STYLES.panel);
    });
  });

  describe('getShadowStyle', () => {
    it('returns requested shadow style token', () => {
      expect(getShadowStyle('glow')).toBe(SHADOW_STYLES.glow);
      expect(getShadowStyle('hover')).toBe(SHADOW_STYLES.hover);
    });
  });

  describe('getBorderStyle', () => {
    it('returns requested border style token', () => {
      expect(getBorderStyle('glow')).toBe(BORDER_STYLES.glow);
      expect(getBorderStyle('thin')).toBe(BORDER_STYLES.thin);
    });
  });
});
