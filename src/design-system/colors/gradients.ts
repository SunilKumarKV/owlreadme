import { GradientTokens } from '../types/colors';
import { palette } from './palette';

export const gradients: GradientTokens = {
  primary: `linear-gradient(135deg, ${palette.blue[600]} 0%, ${palette.purple[600]} 100%)`,
  hero: `linear-gradient(180deg, ${palette.blue[500]} 0%, ${palette.purple[500]} 50%, ${palette.indigo[400]} 100%)`,
  button: `linear-gradient(90deg, ${palette.blue[600]} 0%, ${palette.indigo[600]} 50%, ${palette.purple[600]} 100%)`,
  background: `radial-gradient(ellipse at 50% 0%, ${palette.navy.base} 0%, ${palette.navy.dark} 70%, ${palette.navy.darker} 100%)`,
  glow: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.05) 50%, transparent 100%)`,
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
  wave: `linear-gradient(90deg, transparent 0%, ${palette.cyan[400]} 30%, ${palette.purple[400]} 70%, transparent 100%)`,
  border: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%)',
};
