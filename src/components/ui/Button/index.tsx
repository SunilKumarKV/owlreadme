import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import Link from 'next/link';

export interface BaseButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'gradient' | 'glow';
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
  title?: string;
  disabled?: boolean;
}

export type ButtonAsButtonProps = BaseButtonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof BaseButtonProps> & {
    href?: never;
  };

export type ButtonAsLinkProps = BaseButtonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof BaseButtonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const Spinner: FC = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button: FC<ButtonProps> = (props) => {
  const {
    children,
    variant = 'primary',
    icon,
    loading,
    className = '',
  } = props;

  const baseStyle =
    'inline-flex items-center justify-center px-4 py-2 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0c0c0e] disabled:opacity-50 disabled:pointer-events-none rounded-xl select-none cursor-pointer';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500 border border-transparent active:scale-[0.98]',
    gradient:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20 border border-transparent active:scale-[0.98]',
    glow:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] border border-blue-400/30 active:scale-[0.98]',
    secondary:
      'bg-gray-150 hover:bg-gray-200 text-gray-800 focus-visible:ring-gray-400 border border-transparent dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 active:scale-[0.98]',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 border border-transparent active:scale-[0.98]',
    ghost:
      'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus-visible:ring-gray-500 border border-transparent active:scale-[0.98]',
    outline:
      'border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 focus-visible:ring-blue-500 active:scale-[0.98]',
  };

  const classes = `${baseStyle} ${variants[variant]} ${icon ? 'gap-2' : ''} ${className}`;

  if (props.href !== undefined) {
    const { href, disabled, variant: _variant, icon: _icon, loading: _loading, className: _className, ...linkProps } = props;
    void _variant; void _icon; void _loading; void _className;
    const isDisabled = disabled || loading;
    const linkClasses = `${classes} ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`;

    return (
      <Link
        href={isDisabled ? '#' : href}
        className={linkClasses}
        aria-disabled={isDisabled}
        {...linkProps}
      >
        {loading && <Spinner />}
        {icon && !loading && <span>{icon}</span>}
        {children}
      </Link>
    );
  }

  const { type = 'button', disabled, variant: _variant, icon: _icon, loading: _loading, className: _className, ...buttonProps } = props;
  void _variant; void _icon; void _loading; void _className;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {loading && <Spinner />}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
