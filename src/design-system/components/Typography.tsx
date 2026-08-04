import React, { ElementType } from 'react';
import { TypographyProps, TypographyVariant } from '../types/typography';
import { typographyTokens } from '../typography/typography';
import { fontWeightClasses } from '../typography/font-weights';

const defaultElements: Record<TypographyVariant, ElementType> = {
  'display-xl': 'h1',
  'display-lg': 'h1',
  'heading-xl': 'h2',
  'heading-lg': 'h2',
  'heading-md': 'h3',
  'title-lg': 'h4',
  'title-md': 'h5',
  'title-sm': 'h6',
  'body-lg': 'p',
  'body-md': 'p',
  'body-sm': 'p',
  caption: 'span',
  label: 'span',
  button: 'span',
  code: 'code',
  mono: 'span',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body-md',
  weight,
  align,
  color,
  truncate = false,
  italic = false,
  underline = false,
  as,
  className = '',
  children,
}) => {
  const Component = as || defaultElements[variant] || 'p';

  const baseClasses = typographyTokens[variant] || typographyTokens['body-md'];
  const weightClass = weight ? fontWeightClasses[weight] : '';
  const alignClass = align ? `text-${align}` : '';
  const truncateClass = truncate ? 'truncate' : '';
  const italicClass = italic ? 'italic' : '';
  const underlineClass = underline ? 'underline' : '';

  const combinedClasses = [
    baseClasses,
    weightClass,
    alignClass,
    truncateClass,
    italicClass,
    underlineClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={combinedClasses} style={color ? { color } : undefined}>
      {children}
    </Component>
  );
};

export default Typography;
