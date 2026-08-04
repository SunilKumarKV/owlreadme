import { darkTheme } from '../themes/dark';
import { lightTheme } from '../themes/light';

export const COLOR_SYSTEM_CONFIG = {
  defaultTheme: 'dark',
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
} as const;
