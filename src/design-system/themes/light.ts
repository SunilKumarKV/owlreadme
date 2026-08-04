import { ThemeTokens } from '../types/colors';
import { palette } from '../colors/palette';

export const lightTheme: ThemeTokens = {
  mode: 'light',
  semantic: {
    primary: palette.blue[600],
    primaryHover: palette.blue[700],
    secondary: palette.purple[600],
    secondaryHover: palette.purple[700],
    background: '#ffffff',
    surface: palette.gray[50],
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',
    textPrimary: palette.gray[900],
    textSecondary: palette.gray[700],
    textMuted: palette.gray[500],
    accentBlue: palette.blue[500],
    accentPurple: palette.purple[500],
    success: palette.emerald[600],
    warning: palette.amber[600],
    error: palette.red[600],
    info: palette.blue[500],
  },
  gradients: {
    primary: `linear-gradient(135deg, ${palette.blue[600]} 0%, ${palette.purple[600]} 100%)`,
    hero: `linear-gradient(180deg, ${palette.blue[600]} 0%, ${palette.purple[600]} 50%, ${palette.indigo[600]} 100%)`,
    button: `linear-gradient(90deg, ${palette.blue[600]} 0%, ${palette.indigo[600]} 50%, ${palette.purple[600]} 100%)`,
    background: `radial-gradient(ellipse at 50% 0%, #ffffff 0%, ${palette.gray[50]} 70%, ${palette.gray[100]} 100%)`,
    glow: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.03) 50%, transparent 100%)`,
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    wave: `linear-gradient(90deg, transparent 0%, ${palette.blue[400]} 30%, ${palette.purple[400]} 70%, transparent 100%)`,
    border: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.03) 100%)',
  },
  borders: {
    default: palette.gray[200],
    glass: 'rgba(0, 0, 0, 0.08)',
    gradient: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.02) 100%)',
    glow: 'rgba(59, 130, 246, 0.2)',
    focus: palette.blue[600],
  },
  backgrounds: {
    primary: '#ffffff',
    secondary: palette.gray[50],
    darkNavy: palette.gray[100],
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',
    overlay: 'rgba(255, 255, 255, 0.9)',
    card: 'rgba(255, 255, 255, 0.8)',
  },
};
