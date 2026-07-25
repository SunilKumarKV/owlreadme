import React, { useId, type ComponentPropsWithoutRef, FC } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select: FC<SelectProps> = ({ options, label, error, helperText, id, className = '', disabled, ...props }) => {
  const fallbackId = useId();
  const selectId = id || fallbackId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const ariaDescribedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
    props['aria-describedby'],
  ]
    .filter(Boolean)
    .join(' ');

  const accessibleName = props['aria-label'] || props['aria-labelledby'] ? undefined : (label || props.name || 'Select option');

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        disabled={disabled}
        aria-label={accessibleName}
        aria-describedby={ariaDescribedBy || undefined}
        className={`w-full px-3 py-2 text-sm bg-white dark:bg-[#1e1e1e] dark:text-white border rounded-md transition-all duration-200 outline-none ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-850' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && !error && (
        <span id={helperId} className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
          {helperText}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-[10px] font-medium text-red-700 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
