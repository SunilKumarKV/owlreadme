import React from 'react';
import { IconProps } from '../types/icon';
import { iconRegistry } from './iconRegistry';
import { resolveIconSize } from './iconSizes';
import { baseIconClasses } from './iconVariants';
import { useIconContext } from './IconProvider';

export const Icon: React.FC<IconProps> = ({
  name,
  size,
  color,
  strokeWidth,
  filled = false,
  decorative = true,
  ariaLabel,
  title,
  className = '',
  ...rest
}) => {
  const context = useIconContext();

  const IconComponent = iconRegistry[name];

  if (!IconComponent) {
    return null;
  }

  const effectiveSize = resolveIconSize(size ?? context.size ?? 'md');
  const effectiveStrokeWidth = strokeWidth ?? context.strokeWidth ?? 2;
  const effectiveColor = color ?? context.color;

  const accessibleProps: Record<string, unknown> = decorative
    ? { 'aria-hidden': true }
    : {
        role: 'img',
        'aria-label': ariaLabel || title || name,
      };

  return (
    <IconComponent
      size={effectiveSize}
      strokeWidth={effectiveStrokeWidth}
      color={effectiveColor}
      fill={filled ? 'currentColor' : 'none'}
      className={`${baseIconClasses} ${className}`}
      {...accessibleProps}
      {...(rest as Record<string, unknown>)}
    >
      {title ? <title>{title}</title> : null}
    </IconComponent>
  );
};

export default Icon;
