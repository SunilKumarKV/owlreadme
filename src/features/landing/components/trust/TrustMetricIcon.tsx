import React from 'react';
import { Rocket, Database, Zap, Shield } from 'lucide-react';
import { TrustMetricIconProps, TrustMetricIconType } from '../../types/trust-metrics';
import { getTrustMetricIconColor } from '../../utils/trust-metrics';

const renderIcon = (type: TrustMetricIconType) => {
  switch (type) {
    case 'rocket':
      return <Rocket className="w-5 h-5" />;
    case 'database':
      return <Database className="w-5 h-5" />;
    case 'lightning':
      return <Zap className="w-5 h-5" />;
    case 'shield':
      return <Shield className="w-5 h-5" />;
    default:
      return <Rocket className="w-5 h-5" />;
  }
};

export const TrustMetricIcon: React.FC<TrustMetricIconProps> = ({
  icon,
  colorTheme = 'blue',
  className = '',
}) => {
  const styles = getTrustMetricIconColor(colorTheme);

  return (
    <div
      className={`inline-flex items-center justify-center p-2.5 rounded-xl border ${styles.bg} ${styles.text} ${styles.border} shadow-2xs ${className}`}
      aria-hidden="true"
    >
      {renderIcon(icon)}
    </div>
  );
};

export default TrustMetricIcon;
