import React, { useState } from 'react';
import { GlassCard, Button, Typography } from '@/design-system';
import ReadmeRenderer from './ReadmeRenderer';

export interface ReadmePreviewProps {
  markdown: string;
  onCopy?: () => void;
  className?: string;
}

export const ReadmePreview: React.FC<ReadmePreviewProps> = ({
  markdown,
  onCopy,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    if (onCopy) onCopy();
  };

  return (
    <GlassCard className={`p-0 overflow-hidden border border-gray-200/80 dark:border-gray-800/80 ${className}`}>
      {/* Browser Bar Frame */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <Typography variant="caption" className="ml-2 font-mono text-gray-500 text-xs">
            README.md
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-gray-200/70 dark:bg-gray-800/70 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-gray-950 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'raw'
                  ? 'bg-white dark:bg-gray-950 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? 'Copied! ✓' : 'Copy Markdown'}
          </Button>
        </div>
      </div>

      {/* Content View */}
      <div className="p-6">
        {viewMode === 'preview' ? (
          <ReadmeRenderer markdown={markdown} />
        ) : (
          <textarea
            readOnly
            value={markdown}
            className="w-full h-96 p-4 font-mono text-xs bg-gray-950 text-emerald-400 rounded-xl focus:outline-none resize-y"
          />
        )}
      </div>
    </GlassCard>
  );
};

export default ReadmePreview;
