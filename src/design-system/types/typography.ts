import { ElementType, ReactNode } from 'react';

export type TypographyVariant =
  | 'display-xl'
  | 'display-lg'
  | 'heading-xl'
  | 'heading-lg'
  | 'heading-md'
  | 'title-lg'
  | 'title-md'
  | 'title-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption'
  | 'label'
  | 'button'
  | 'code'
  | 'mono';

export type TypographyWeight =
  | 'thin'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  color?: string;
  truncate?: boolean;
  italic?: boolean;
  underline?: boolean;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}
