export type ColorThemeMode = 'dark' | 'light';

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ColorPalette {
  blue: ColorScale;
  purple: ColorScale;
  indigo: ColorScale;
  gray: ColorScale;
  emerald: ColorScale;
  amber: ColorScale;
  red: ColorScale;
  cyan: ColorScale;
  navy: {
    base: string;
    dark: string;
    darker: string;
  };
}

export interface SemanticColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  background: string;
  surface: string;
  surfaceGlass: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentBlue: string;
  accentPurple: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface GradientTokens {
  primary: string;
  hero: string;
  button: string;
  background: string;
  glow: string;
  glass: string;
  wave: string;
  border: string;
}

export interface BorderTokens {
  default: string;
  glass: string;
  gradient: string;
  glow: string;
  focus: string;
}

export interface BackgroundTokens {
  primary: string;
  secondary: string;
  darkNavy: string;
  surfaceGlass: string;
  overlay: string;
  card: string;
}

export interface ThemeTokens {
  mode: ColorThemeMode;
  semantic: SemanticColors;
  gradients: GradientTokens;
  borders: BorderTokens;
  backgrounds: BackgroundTokens;
}
