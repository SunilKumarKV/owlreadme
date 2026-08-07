import React from 'react';
import { Typography } from '@/design-system';
import { ExportState } from '@/types/export';

export interface ExportStatusProps {
  state: ExportState;
  className?: string;
}

export const ExportStatus: React.FC<ExportStatusProps> = ({ state, className = '' }) => {
  if (state.status === 'idle') return null;

  return (
    <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${getStatusStyles(state.status)} ${className}`}>
      <div className="flex items-center justify-between">
        <Typography variant="body-sm" className="font-bold">
          {getStatusLabel(state.status)}
        </Typography>
        {state.progressPct > 0 && state.progressPct < 100 && (
          <span className="font-mono text-[11px] font-extrabold">{state.progressPct}%</span>
        )}
      </div>

      {state.result && (
        <Typography variant="caption" className="block text-green-700 dark:text-green-400 font-semibold">
          Successfully saved {state.result.filename} ({Math.round(state.result.sizeBytes / 1024 * 10) / 10} KB)
        </Typography>
      )}

      {state.error && (
        <Typography variant="caption" className="block text-red-600 dark:text-red-400 font-semibold">
          {state.error}
        </Typography>
      )}
    </div>
  );
};

function getStatusStyles(status: string): string {
  switch (status) {
    case 'success':
      return 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200';
    case 'error':
      return 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200';
    case 'preparing':
    case 'generating':
    case 'downloading':
      return 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200';
    default:
      return 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'preparing':
      return 'Preparing document...';
    case 'generating':
      return 'Auditing document security...';
    case 'downloading':
      return 'Triggering download...';
    case 'success':
      return 'Export Complete!';
    case 'error':
      return 'Export Failed';
    case 'cancelled':
      return 'Export Cancelled';
    default:
      return 'Idle';
  }
}

export default ExportStatus;
