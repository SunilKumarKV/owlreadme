import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export const useDashboardNavigation = (isReadmeType: boolean, isRoadmapType: boolean) => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [aiTab, setAiTab] = useState<'readme' | 'roadmap' | 'profile'>('readme');

  // Sync AI tabs depending on active workspace type during render
  if (!isReadmeType && aiTab !== 'roadmap') {
    setAiTab('roadmap');
  } else if (!isRoadmapType && aiTab === 'roadmap') {
    setAiTab('readme');
  }

  return {
    username,
    aiTab,
    setAiTab,
  };
};
