import { SemanticColors } from '../types/colors';
import { palette } from './palette';

export const semanticColors: SemanticColors = {
  primary: palette.blue[600],
  primaryHover: palette.blue[500],
  secondary: palette.purple[600],
  secondaryHover: palette.purple[500],
  background: palette.navy.base,
  surface: palette.navy.dark,
  surfaceGlass: 'rgba(11, 15, 23, 0.75)',
  textPrimary: '#ffffff',
  textSecondary: palette.gray[300],
  textMuted: palette.gray[500],
  accentBlue: palette.cyan[400],
  accentPurple: palette.purple[400],
  success: palette.emerald[500],
  warning: palette.amber[500],
  error: palette.red[500],
  info: palette.blue[400],
};
