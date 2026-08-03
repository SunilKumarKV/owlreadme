import React from 'react';

export type PreviewVariant = 'thin' | 'gradient' | 'glow';

export interface WindowControlsProps {
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
  actions?: React.ReactNode;
  className?: string;
}

export interface PreviewBodyProps {
  children?: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

export interface PreviewContainerProps {
  children?: React.ReactNode;
  variant?: PreviewVariant;
  className?: string;
}

export interface BrowserFrameProps {
  fileName?: string;
  children?: React.ReactNode;
  variant?: PreviewVariant;
  className?: string;
}

export interface ReadmePreviewProps {
  fileName?: string;
  children?: React.ReactNode;
  variant?: PreviewVariant;
  maxHeight?: string;
  className?: string;
}
