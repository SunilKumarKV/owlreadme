import { useState, useCallback } from 'react';

export type PreviewMode = 'rendered' | 'raw' | 'split';

export function useReadmePreview(initialMode: PreviewMode = 'rendered') {
  const [mode, setMode] = useState<PreviewMode>(initialMode);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback((content: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  return {
    mode,
    setMode,
    isCopied,
    copyToClipboard,
  };
}

export default useReadmePreview;
