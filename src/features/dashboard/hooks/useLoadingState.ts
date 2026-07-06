import { useState } from 'react';

export const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  return {
    loading,
    setLoading,
    error,
    setError,
    aiLoading,
    setAiLoading,
  };
};
