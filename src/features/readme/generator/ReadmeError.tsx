import React from 'react';
import { GlassCard, Typography, Button } from '@/design-system';

export interface ReadmeErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ReadmeError: React.FC<ReadmeErrorProps> = ({
  message,
  onRetry,
  className = '',
}) => {
  return (
    <GlassCard
      className={`p-6 text-center space-y-4 border border-red-200/60 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10 ${className}`}
      role="alert"
    >
      <div className="space-y-1">
        <Typography variant="heading-md" className="font-extrabold text-red-600 dark:text-red-400">
          README Generation Failed
        </Typography>
        <Typography variant="body-sm" className="text-gray-600 dark:text-gray-300">
          {message}
        </Typography>
      </div>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mx-auto mt-2">
          Retry Generation
        </Button>
      )}
    </GlassCard>
  );
};

export default ReadmeError;
