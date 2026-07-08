import type { FC } from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ variant = 'rect', width, height, className = '' }) => {
  const shape = {
    text: 'h-4 w-3/4 rounded-md',
    rect: 'rounded-md',
    circle: 'rounded-full',
  }[variant];

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 ${shape} ${className}`}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
