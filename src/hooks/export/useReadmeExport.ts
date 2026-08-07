import { useState, useCallback } from 'react';
import { exportService } from '@/services/export/exportService';
import { ExportOptions, ExportState } from '@/types/export';

export function useReadmeExport(normalizedMarkdown: string) {
  const [state, setState] = useState<ExportState>({
    status: 'idle',
    progressPct: 0,
    error: null,
    result: null,
  });

  const exportDocument = useCallback(
    async (options: ExportOptions) => {
      if (!normalizedMarkdown || !normalizedMarkdown.trim()) {
        setState({
          status: 'error',
          progressPct: 0,
          error: 'Cannot export an empty README document.',
          result: null,
        });
        return;
      }

      setState({ status: 'preparing', progressPct: 20, error: null, result: null });

      try {
        setState((prev) => ({ ...prev, status: 'generating', progressPct: 60 }));

        const result = await exportService.export(normalizedMarkdown, options);

        setState({
          status: 'success',
          progressPct: 100,
          error: null,
          result,
        });
      } catch (err: unknown) {
        setState({
          status: 'error',
          progressPct: 0,
          error: (err as Error)?.message || 'Export failed.',
          result: null,
        });
      }
    },
    [normalizedMarkdown]
  );

  const cancelExport = useCallback(() => {
    setState({
      status: 'cancelled',
      progressPct: 0,
      error: 'Export was cancelled.',
      result: null,
    });
  }, []);

  const resetState = useCallback(() => {
    setState({
      status: 'idle',
      progressPct: 0,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    exportDocument,
    cancelExport,
    resetState,
  };
}

export default useReadmeExport;
