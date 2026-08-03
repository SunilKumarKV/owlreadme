import React from 'react';

export type PreviewBorderVariant = 'thin' | 'gradient' | 'glow';

export interface PreviewWindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}

export interface PreviewFileNameProps {
  fileName?: string;
  className?: string;
}

export interface PreviewHeaderProps {
  fileName?: string;
  className?: string;
  controls?: boolean;
}

export interface PreviewScrollAreaProps {
  children?: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

export interface PreviewBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export interface PreviewContainerProps {
  variant?: PreviewBorderVariant;
  children?: React.ReactNode;
  className?: string;
}

export interface PreviewBrowserProps {
  variant?: PreviewBorderVariant;
  fileName?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface ReadmePreviewProps {
  variant?: PreviewBorderVariant;
  fileName?: string;
  children?: React.ReactNode;
  className?: string;
  maxHeight?: string;
}
