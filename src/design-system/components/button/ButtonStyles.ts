import { ButtonSize, ButtonVariant } from '../../types/button';

export const baseButtonClasses =
  'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none rounded-xl';

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98]',
  secondary:
    'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 shadow-sm active:scale-[0.98]',
  outline:
    'bg-transparent hover:bg-white/5 text-gray-200 border border-gray-700 hover:border-gray-500 active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-white/10 text-gray-300 hover:text-white active:scale-[0.98]',
  link:
    'bg-transparent text-blue-400 hover:text-blue-300 hover:underline p-0 h-auto font-semibold',
  danger:
    'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25 active:scale-[0.98]',
  success:
    'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 active:scale-[0.98]',
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-xs space-x-1',
  sm: 'px-3 py-1.5 text-xs space-x-1.5',
  md: 'px-4 py-2 text-sm space-x-2',
  lg: 'px-5 py-2.5 text-base space-x-2',
  xl: 'px-6 py-3 text-lg space-x-2.5',
  icon: 'p-2 text-sm',
};
