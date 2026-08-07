import React from 'react';
import { GlassCard, Typography, Button } from '@/design-system';

export interface ExportErrorProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ExportError: React.FC<ExportErrorProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  return (
    <GlassCard
      className={`p-4 text-center space-y-3 border border-red-200/60 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10 ${className}`}
      role="alert"
    >
      <div className="space-y-1">
        <Typography variant="heading-md" className="font-extrabold text-red-600 dark:text-red-400">
          Export Error
        </Typography>
        <Typography variant="body-sm" className="text-gray-700 dark:text-gray-300">
          {error}
        </Typography>
      </div>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mx-auto">
          Try Again
        </Button>
      )}
    </GlassCard>
  );
};

export default ExportError;
