import React, { Suspense } from 'react';
import READMEBuilderPage from '@/features/readme-builder/READMEBuilderPage';
import { LoadingScreen } from '@/components/loading';

const READMEBuilder: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen status="Loading Profile README Builder Workspace..." />}>
      <READMEBuilderPage />
    </Suspense>
  );
};

export default READMEBuilder;