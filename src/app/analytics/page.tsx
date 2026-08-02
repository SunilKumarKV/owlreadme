import React, { Suspense } from 'react';
import DeveloperAnalyticsPage from '@/features/analytics/DeveloperAnalyticsPage';
import { LoadingScreen } from '@/components/loading';

const Analytics: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen status="Calculating Repository Analytics & Language Metrics..." />}>
      <DeveloperAnalyticsPage />
    </Suspense>
  );
};

export default Analytics;
