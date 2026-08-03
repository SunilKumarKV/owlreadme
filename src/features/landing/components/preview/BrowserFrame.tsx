"use client";

import React from 'react';
import { BrowserFrameProps } from '../../types/preview';
import PreviewContainer from './PreviewContainer';
import PreviewHeader from './PreviewHeader';

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  fileName = 'owlreadme-output.md',
  children,
  variant = 'glow',
  className = '',
}) => {
  return (
    <PreviewContainer variant={variant} className={className}>
      <PreviewHeader fileName={fileName} />
      {children}
    </PreviewContainer>
  );
};

export default BrowserFrame;
