import React from 'react';
import { GlassCard } from '@/design-system';

export interface ReadmeRendererProps {
  markdown: string;
  className?: string;
}

export const ReadmeRenderer: React.FC<ReadmeRendererProps> = ({
  markdown,
  className = '',
}) => {
  if (!markdown || !markdown.trim()) {
    return (
      <GlassCard className="p-8 text-center text-gray-400">
        No README content generated yet. Provide a GitHub username or select sections to build.
      </GlassCard>
    );
  }

  return (
    <GlassCard className={`p-6 sm:p-8 space-y-4 overflow-x-auto text-gray-900 dark:text-gray-100 font-sans leading-relaxed ${className}`}>
      <div className="prose dark:prose-invert max-w-none space-y-4 whitespace-pre-wrap font-mono text-sm border-l-2 border-blue-500/40 pl-4 bg-gray-50/50 dark:bg-gray-950/40 p-4 rounded-r-xl">
        {markdown}
      </div>
    </GlassCard>
  );
};

export default ReadmeRenderer;
