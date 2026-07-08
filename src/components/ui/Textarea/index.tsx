import type { ComponentPropsWithoutRef, FC } from 'react';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  loading?: boolean;
  error?: string;
  label?: string;
}

export const Textarea: FC<TextareaProps> = ({ className = '', disabled, loading, error, label, id, rows = 4, ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <textarea
          id={id}
          rows={rows}
          className={`w-full px-4 py-2 rounded-md border text-sm transition-all duration-200 bg-white dark:bg-[#1e1e1e] dark:text-white ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          } ${disabled || loading ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-850' : ''} ${className}`}
          disabled={disabled || loading}
          {...props}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-md z-10">
            <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>
      {error && <span className="text-[10px] font-medium text-red-500">{error}</span>}
    </div>
  );
};

export default Textarea;
