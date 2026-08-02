import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  loading?: boolean;
  error?: string;
  label?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  isValid?: boolean;
}

export const Input: FC<InputProps> = ({
  className = '',
  disabled,
  loading,
  error,
  label,
  id,
  icon,
  rightElement,
  isValid,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative w-full flex items-center">
        {icon && (
          <div className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full py-2.5 text-sm rounded-xl border transition-all duration-200 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${
            icon ? 'pl-10' : 'pl-4'
          } ${rightElement || loading || isValid !== undefined ? 'pr-10' : 'pr-4'} ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : isValid
              ? 'border-green-500/80 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
              : 'border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]'
          } ${disabled || loading ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-850' : ''} ${className}`}
          disabled={disabled || loading}
          {...props}
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
        {!loading && rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
