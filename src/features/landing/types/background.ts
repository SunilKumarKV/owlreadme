import React from 'react';

export type BackgroundVariant = 'default' | 'hero' | 'dark' | 'glass';
export type GlowColor = 'blue' | 'purple' | 'indigo' | 'dual';
export type GlowBlurSize = 'sm' | 'md' | 'lg' | 'xl';
export type GridPattern = 'grid' | 'dots' | 'perspective';
export type BlurLevel = 'sm' | 'md' | 'lg' | 'xl';

export interface BackgroundLayerProps {
  children?: React.ReactNode;
  className?: string;
  zIndex?: number;
  ariaHidden?: boolean;
  style?: React.CSSProperties;
}

export interface BackgroundGradientProps {
  className?: string;
  variant?: BackgroundVariant;
}

export interface BackgroundGlowProps {
  className?: string;
  color?: GlowColor;
  blurSize?: GlowBlurSize;
  position?: 'top' | 'center' | 'hero' | 'bottom';
}

export interface BackgroundGridProps {
  className?: string;
  pattern?: GridPattern;
  opacity?: number;
  perspective?: boolean;
}

export interface BackgroundWaveProps {
  className?: string;
  color?: string;
  height?: number;
}

export interface BackgroundBlurProps {
  className?: string;
  blurLevel?: BlurLevel;
}

export interface BackgroundLightsProps {
  className?: string;
  speed?: number;
  opacity?: number;
}

export interface BackgroundOverlayProps {
  className?: string;
  opacity?: number;
}

export interface LandingBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  variant?: BackgroundVariant;
  showGradient?: boolean;
  showGlow?: boolean;
  showBlur?: boolean;
  showGrid?: boolean;
  showWave?: boolean;
  showLights?: boolean;
  showParticles?: boolean;
  showOverlay?: boolean;
}
