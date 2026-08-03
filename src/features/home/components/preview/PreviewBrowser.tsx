"use client";

import React from 'react';
import { PreviewBrowserProps } from '../../types/preview';
import PreviewContainer from './PreviewContainer';
import PreviewHeader from './PreviewHeader';

export const PreviewBrowser: React.FC<PreviewBrowserProps> = ({
  fileName,
  children,
  className = '',
}) => {
  return (
    <PreviewContainer className={className}>
      <PreviewHeader fileName={fileName} />
      {children}
    </PreviewContainer>
  );
};

export default PreviewBrowser;
