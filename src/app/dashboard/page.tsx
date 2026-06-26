import React, { Suspense } from 'react';
import DeveloperDashboardPage from '@/features/dashboard/DeveloperDashboardPage';

const Dashboard: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-[#1e1e1e] text-black dark:text-white font-semibold">Loading Dashboard...</div>}>
      <DeveloperDashboardPage />
    </Suspense>
  );
};

export default Dashboard;
