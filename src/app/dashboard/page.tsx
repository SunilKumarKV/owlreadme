import React, { Suspense } from 'react';
import DeveloperDashboardPage from '@/features/dashboard/DeveloperDashboardPage';
import { LoadingScreen } from '@/components/loading';

const Dashboard: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen status="Initializing Developer Workspace..." />}>
      <DeveloperDashboardPage />
    </Suspense>
  );
};

export default Dashboard;
