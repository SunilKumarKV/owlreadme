export type TrustMetricIconType = 'rocket' | 'database' | 'lightning' | 'shield';

export interface TrustMetricItemConfig {
  id: string;
  icon: TrustMetricIconType;
  value: string;
  title: string;
  description: string;
  colorTheme?: 'blue' | 'purple' | 'emerald' | 'indigo' | 'amber';
  url?: string;
  badge?: string;
  ctaLabel?: string;
}

export interface TrustMetricsSectionConfig {
  sectionId?: string;
  title?: string;
  subtitle?: string;
  metrics: TrustMetricItemConfig[];
}

export interface TrustMetricIconProps {
  icon: TrustMetricIconType;
  colorTheme?: string;
  className?: string;
}

export interface TrustMetricValueProps {
  value: string;
  className?: string;
}

export interface TrustMetricTitleProps {
  title: string;
  className?: string;
}

export interface TrustMetricDescriptionProps {
  description: string;
  className?: string;
}

export interface TrustMetricCardProps {
  metric: TrustMetricItemConfig;
  className?: string;
}

export interface TrustMetricsGridProps {
  metrics: TrustMetricItemConfig[];
  className?: string;
}

export interface TrustMetricsProps {
  config?: TrustMetricsSectionConfig;
  className?: string;
}
