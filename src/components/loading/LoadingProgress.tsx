import React from 'react';

export interface LoadingProgressProps {
  status?: string;
  progress?: number; // 0 - 100
  className?: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  status = 'Preparing workspace...',
  progress,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-md mx-auto space-y-2 text-center ${className}`}>
      {/* Status Label */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
        <span className="truncate pr-2">{status}</span>
        {progress !== undefined && (
          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold shrink-0">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Progress Track */}
      <div className="relative h-2 w-full bg-gray-200/80 dark:bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
        {progress !== undefined ? (
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        ) : (
          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-shimmer-slide" />
        )}
      </div>
    </div>
  );
};

export default LoadingProgress;
