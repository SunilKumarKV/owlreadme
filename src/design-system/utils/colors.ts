import { ColorThemeMode, ThemeTokens } from '../types/colors';
import { darkTheme } from '../themes/dark';
import { lightTheme } from '../themes/light';

export function getThemeTokens(mode: ColorThemeMode = 'dark'): ThemeTokens {
  return mode === 'light' ? lightTheme : darkTheme;
}

export function getColorToken(
  tokenKey: keyof ThemeTokens['semantic'],
  mode: ColorThemeMode = 'dark'
): string {
  const theme = getThemeTokens(mode);
  return theme.semantic[tokenKey];
}

export function getGradientToken(
  gradientKey: keyof ThemeTokens['gradients'],
  mode: ColorThemeMode = 'dark'
): string {
  const theme = getThemeTokens(mode);
  return theme.gradients[gradientKey];
}

export function resolveThemeColor(
  colorKey: string,
  mode: ColorThemeMode = 'dark'
): string {
  const theme = getThemeTokens(mode);
  if (colorKey in theme.semantic) {
    return theme.semantic[colorKey as keyof ThemeTokens['semantic']];
  }
  return colorKey;
}
