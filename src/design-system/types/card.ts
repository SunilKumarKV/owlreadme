import { HTMLAttributes, ReactNode } from 'react';

export type CardVariant =
  | 'default'
  | 'glass'
  | 'outlined'
  | 'filled'
  | 'feature'
  | 'metric'
  | 'repository'
  | 'stats';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  border?: boolean;
  shadow?: boolean;
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  children: ReactNode;
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: ReactNode;
}

export interface CardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children: ReactNode;
}

export interface CardDividerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface GlassCardProps extends CardProps {
  blurLevel?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
}

export interface MetricCardProps extends CardProps {
  icon?: ReactNode;
  value: string | number;
  title: string;
  description?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export interface RepositoryCardProps extends CardProps {
  name: string;
  description: string;
  stars?: number;
  forks?: number;
  language?: string;
  languageColor?: string;
  isPrivate?: boolean;
}

export interface StatsCardProps extends CardProps {
  title?: string;
  children: ReactNode;
}

export interface FeatureCardProps extends CardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
}
