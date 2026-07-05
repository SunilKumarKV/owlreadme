/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import Link from 'next/link';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  icon?: ReactNode;
  loading?: boolean;
  href?: string;
}

const Spinner: FC = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  icon,
  disabled,
  href,
  loading,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center px-4 py-2 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0c0c0e] disabled:opacity-50 disabled:pointer-events-none rounded-md select-none';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500 border border-transparent dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary: 'bg-gray-150 hover:bg-gray-200 text-gray-800 focus-visible:ring-gray-400 border border-transparent dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 border border-transparent',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus-visible:ring-gray-500 border border-transparent',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 focus-visible:ring-blue-500',
  };

  const classes = `${baseStyle} ${variants[variant]} ${icon ? 'gap-2' : ''} ${className}`;

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={classes} onClick={onClick as any} {...(props as any)}>
        {loading && <Spinner />}
        {icon && !loading && <span>{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
