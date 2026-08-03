"use client";

import React from 'react';
import ReadmePreview from '../preview/ReadmePreview';
import ReadmeContent from '../preview/ReadmeContent';

export const HeroPreviewWindow: React.FC = () => {
  return (
    <div className="flex-1 w-full max-w-lg lg:max-w-none" data-reveal="true">
      <ReadmePreview fileName="owlreadme-output.md">
        <ReadmeContent />
      </ReadmePreview>
    </div>
  );
};

export default HeroPreviewWindow;
