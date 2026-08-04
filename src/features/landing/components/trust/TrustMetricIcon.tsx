import React from 'react';
import { TrustMetricIconProps, TrustMetricIconType } from '../../types/trust-metrics';
import { getTrustMetricIconColor } from '../../utils/trust-metrics';
import { Icon, IconName } from '@/design-system';

const iconNameMap: Record<TrustMetricIconType, IconName> = {
  rocket: 'rocket',
  database: 'database',
  lightning: 'zap',
  shield: 'shield',
};

export const TrustMetricIcon: React.FC<TrustMetricIconProps> = ({
  icon,
  colorTheme = 'blue',
  className = '',
}) => {
  const styles = getTrustMetricIconColor(colorTheme);
  const iconName = iconNameMap[icon] || 'rocket';

  return (
    <div
      className={`inline-flex items-center justify-center p-2.5 rounded-xl border ${styles.bg} ${styles.text} ${styles.border} shadow-2xs ${className}`}
      aria-hidden="true"
    >
      <Icon name={iconName} size="md" />
    </div>
  );
};

export default TrustMetricIcon;
