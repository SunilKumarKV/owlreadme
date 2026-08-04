import { SVGProps } from 'react';

export type IconName =
  | 'github'
  | 'sparkles'
  | 'rocket'
  | 'shield'
  | 'database'
  | 'zap'
  | 'sun'
  | 'moon'
  | 'star'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'external-link'
  | 'chevron-down'
  | 'chevron-right'
  | 'menu'
  | 'close'
  | 'check'
  | 'x'
  | 'search'
  | 'settings'
  | 'download'
  | 'copy'
  | 'code'
  | 'file'
  | 'folder'
  | 'eye'
  | 'eye-off'
  | 'clock'
  | 'user'
  | 'users'
  | 'book'
  | 'terminal'
  | 'package'
  | 'monitor'
  | 'laptop'
  | 'smartphone'
  | 'browser-controls';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'size'> {
  name: IconName;
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
  decorative?: boolean;
  ariaLabel?: string;
  title?: string;
  className?: string;
}

export interface IconContextValue {
  size?: IconSize;
  strokeWidth?: number;
  color?: string;
}
