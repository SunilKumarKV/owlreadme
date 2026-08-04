import { TRUST_METRICS_CONFIG } from '../constants/trust-metrics';
import { TrustMetricsSectionConfig } from '../types/trust-metrics';

export function useTrustMetrics(overrideConfig?: Partial<TrustMetricsSectionConfig>): TrustMetricsSectionConfig {
  return {
    ...TRUST_METRICS_CONFIG,
    ...overrideConfig,
    metrics: overrideConfig?.metrics || TRUST_METRICS_CONFIG.metrics,
  };
}

export default useTrustMetrics;
