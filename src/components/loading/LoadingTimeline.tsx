import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export interface StepItem {
  id: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

export interface LoadingTimelineProps {
  steps?: StepItem[];
  className?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  { id: '1', label: 'Fetching GitHub Profile', completed: false, current: true },
  { id: '2', label: 'Loading Repositories', completed: false },
  { id: '3', label: 'Analyzing Languages', completed: false },
  { id: '4', label: 'Building README Sections', completed: false },
  { id: '5', label: 'Applying Theme', completed: false },
];

export const LoadingTimeline: React.FC<LoadingTimelineProps> = ({ steps = DEFAULT_STEPS, className = '' }) => {
  return (
    <div className={`w-full max-w-md mx-auto space-y-2 py-2 ${className}`} aria-label="Loading Progress Timeline">
      {steps.map((step, idx) => {
        const isCompleted = step.completed;
        const isCurrent = step.current || (!isCompleted && steps.findIndex((s) => !s.completed) === idx);

        return (
          <div
            key={step.id || idx}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-lg transition-all duration-300 ${
              isCurrent
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 shadow-xs'
                : isCompleted
                ? 'opacity-80'
                : 'opacity-40'
            }`}
          >
            {/* Step Icon Indicator */}
            <div className="shrink-0">
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 animate-fade-in-smooth" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-spin" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              )}
            </div>

            {/* Step Label */}
            <span
              className={`text-xs font-medium transition-colors duration-200 ${
                isCurrent
                  ? 'text-blue-900 dark:text-blue-200 font-bold'
                  : isCompleted
                  ? 'text-gray-700 dark:text-gray-300 line-through decoration-gray-400/40'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LoadingTimeline;
