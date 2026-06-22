import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  disabled?: boolean; // added disabled prop
  href?: string; // added href prop
  loading?: boolean; // added loading prop
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', icon, disabled, href, loading }) => {
  if (href) {
    return (
      <Link href={href} passHref>
        <a className={clsx(
        'px-4 py-2 rounded-md font-semibold text-white transition duration-300',
        variant === 'primary' && 'bg-blue-500 hover:bg-blue-600 focus:ring-2 ring-offset-2 ring-blue-500',
        variant === 'secondary' && 'bg-gray-300 hover:bg-gray-400 focus:ring-2 ring-offset-2 ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-2 dark:ring-offset-2 dark:ring-gray-700',
        icon && 'flex items-center space-x-2',
        disabled && 'opacity-50 cursor-not-allowed', // added Tailwind disabled styles
        loading && 'bg-blue-300 hover:bg-blue-400 focus:ring-2 ring-offset-2 ring-blue-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-2 dark:ring-offset-2 dark:ring-gray-700' // added loading styles
        )}>
      {icon && <span>{icon}</span>}
      {loading ? 'Loading...' : children}
        </a>
      </Link>
  );
  } else {
    return (
      <button
        className={clsx(
          'px-4 py-2 rounded-md font-semibold text-white transition duration-300',
          variant === 'primary' && 'bg-blue-500 hover:bg-blue-600 focus:ring-2 ring-offset-2 ring-blue-500',
          variant === 'secondary' && 'bg-gray-300 hover:bg-gray-400 focus:ring-2 ring-offset-2 ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-2 dark:ring-offset-2 dark:ring-gray-700',
          icon && 'flex items-center space-x-2',
          disabled && 'opacity-50 cursor-not-allowed', // added Tailwind disabled styles
          loading && 'bg-blue-300 hover:bg-blue-400 focus:ring-2 ring-offset-2 ring-blue-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-2 dark:ring-offset-2 dark:ring-gray-700' // added loading styles
        )}
        onClick={disabled || loading ? undefined : onClick} // disable the button when disabled or loading is true
      >
        {icon && <span>{icon}</span>}
        {loading ? 'Loading...' : children}
      </button>
  );
  }
};

export default Button;