"use client";

import React from 'react';
import { ReadmePreviewProps } from '../../types/preview';
import { DEFAULT_PREVIEW_CONFIG } from '../../constants/preview';
import BrowserFrame from './BrowserFrame';
import PreviewBody from './PreviewBody';

export const ReadmePreview: React.FC<ReadmePreviewProps> = ({
  fileName = DEFAULT_PREVIEW_CONFIG.fileName,
  children,
  variant = DEFAULT_PREVIEW_CONFIG.variant,
  maxHeight = DEFAULT_PREVIEW_CONFIG.maxHeight,
  className = '',
}) => {
  return (
    <BrowserFrame fileName={fileName} variant={variant} className={className}>
      <PreviewBody maxHeight={maxHeight}>{children}</PreviewBody>
    </BrowserFrame>
  );
};

export default ReadmePreview;
