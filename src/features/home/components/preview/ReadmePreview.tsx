"use client";

import React from 'react';
import { ReadmePreviewProps } from '../../types/preview';
import { DEFAULT_PREVIEW_CONFIG } from '../../constants/preview';
import PreviewBrowser from './PreviewBrowser';
import PreviewScrollArea from './PreviewScrollArea';
import PreviewBody from './PreviewBody';

export const ReadmePreview: React.FC<ReadmePreviewProps> = ({
  fileName = DEFAULT_PREVIEW_CONFIG.fileName,
  children,
  className = '',
  maxHeight = DEFAULT_PREVIEW_CONFIG.maxHeight,
}) => {
  return (
    <PreviewBrowser fileName={fileName} className={className}>
      <PreviewScrollArea maxHeight={maxHeight}>
        <PreviewBody>{children}</PreviewBody>
      </PreviewScrollArea>
    </PreviewBrowser>
  );
};

export default ReadmePreview;
