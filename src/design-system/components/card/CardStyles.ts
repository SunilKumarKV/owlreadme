import { CardPadding, CardVariant } from '../../types/card';

export const baseCardClasses =
  'relative rounded-2xl transition-all duration-300 overflow-hidden';

export const cardVariantClasses: Record<CardVariant, string> = {
  default:
    'bg-gray-900/90 dark:bg-[#0B0F17]/90 text-white border border-gray-800/80 shadow-lg',
  glass:
    'bg-white/5 dark:bg-[#0B0F17]/75 backdrop-blur-xl border border-white/10 text-white shadow-2xl shadow-blue-500/5',
  outlined:
    'bg-transparent border border-gray-700/80 dark:border-gray-800 text-white',
  filled:
    'bg-gray-800/90 dark:bg-[#111827] border border-transparent text-white',
  feature:
    'bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 text-white shadow-xl hover:border-blue-500/40',
  metric:
    'bg-white/5 dark:bg-[#0d1117]/80 backdrop-blur-xl border border-gray-800/80 text-white shadow-md hover:border-purple-500/30',
  repository:
    'bg-gray-900/80 dark:bg-[#0B0F17]/80 border border-gray-800 text-white shadow-sm hover:border-gray-700',
  stats:
    'bg-gray-900/90 dark:bg-[#0d1117]/90 border border-gray-800 text-white shadow-lg',
};

export const cardPaddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export const cardHoverClasses =
  'hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer active:translate-y-0';
