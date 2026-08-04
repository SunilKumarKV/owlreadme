import { BorderTokens } from '../types/colors';
import { palette } from './palette';

export const borders: BorderTokens = {
  default: palette.gray[800],
  glass: 'rgba(255, 255, 255, 0.08)',
  gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 100%)',
  glow: 'rgba(59, 130, 246, 0.3)',
  focus: palette.blue[500],
};
