import { TrustMetricsSectionConfig } from '../types/trust-metrics';

export const TRUST_METRICS_CONFIG: TrustMetricsSectionConfig = {
  sectionId: 'trust-metrics',
  title: 'Why Developers Choose OwlREADME',
  subtitle: 'Built with privacy, speed, and open-source principles at core.',
  metrics: [
    {
      id: 'metric-client-side',
      icon: 'rocket',
      value: '100%',
      title: 'CLIENT-SIDE LOGIC',
      description: 'Your data stays in your browser.',
      colorTheme: 'blue',
    },
    {
      id: 'metric-databases',
      icon: 'database',
      value: '0',
      title: 'DATABASES NEEDED',
      description: 'No backend.\nNo tracking.',
      colorTheme: 'purple',
    },
    {
      id: 'metric-package-export',
      icon: 'lightning',
      value: '1-Click',
      title: 'PACKAGE EXPORT',
      description: 'Download your README instantly.',
      colorTheme: 'amber',
    },
    {
      id: 'metric-license',
      icon: 'shield',
      value: 'MIT',
      title: 'LICENSE',
      description: 'Open source.\nCommercial friendly.',
      colorTheme: 'emerald',
    },
  ],
};
