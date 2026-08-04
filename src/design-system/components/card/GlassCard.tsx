import React from 'react';
import { GlassCardProps } from '../../types/card';
import Card from './Card';
import { CARD_CONFIG } from '../../constants/card';

export const GlassCard: React.FC<GlassCardProps> = ({
  blurLevel = 'xl',
  glow = false,
  className = '',
  children,
  ...rest
}) => {
  const blurClass = CARD_CONFIG.blurLevels[blurLevel];
  const glowClass = glow ? 'ring-1 ring-blue-500/30 shadow-2xl shadow-blue-500/10' : '';

  return (
    <Card
      variant="glass"
      className={`${blurClass} ${glowClass} ${className}`}
      {...rest}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
