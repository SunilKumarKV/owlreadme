"use client";

import React from 'react';
import { PreviewBrowserProps } from '../../types/preview';
import PreviewContainer from './PreviewContainer';
import PreviewHeader from './PreviewHeader';

export const PreviewBrowser: React.FC<PreviewBrowserProps> = ({
  variant = 'glow',
  fileName,
  children,
  className = '',
}) => {
  return (
    <PreviewContainer variant={variant} className={className}>
      <PreviewHeader fileName={fileName} />
      {children}
    </PreviewContainer>
  );
};

export default PreviewBrowser;
