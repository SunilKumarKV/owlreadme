export function getTrustMetricIconColor(colorTheme: string = 'blue'): {
  bg: string;
  text: string;
  border: string;
} {
  switch (colorTheme) {
    case 'purple':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200/60 dark:border-purple-800/40',
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200/60 dark:border-emerald-800/40',
      };
    case 'amber':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200/60 dark:border-amber-800/40',
      };
    case 'indigo':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200/60 dark:border-indigo-800/40',
      };
    case 'blue':
    default:
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200/60 dark:border-blue-800/40',
      };
  }
}
