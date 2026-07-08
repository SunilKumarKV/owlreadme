import type { ComponentPropsWithoutRef, FC } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

export const Select: FC<SelectProps> = ({ options, label, error, id, className = '', disabled, ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}
      <select
        id={id}
        disabled={disabled}
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
      {error && <span className="text-[10px] font-medium text-red-500">{error}</span>}
    </div>
  );
};

export default Select;
