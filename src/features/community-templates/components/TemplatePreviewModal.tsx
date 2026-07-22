'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { X, Laptop, Smartphone, Code, Copy, Check, Heart } from 'lucide-react';
import { CommunityTemplate } from '@/stores/template-store';
import { generateREADME } from '@/utils/markdown';

const MDEditorMarkdown = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
) as React.ComponentType<{ source: string }>;

interface TemplatePreviewModalProps {
  isOpen: boolean;
  template: CommunityTemplate | null;
  onClose: () => void;
  onUse: (template: CommunityTemplate) => void;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  template,
  onClose,
  onUse,
  onFavorite,
  isFavorited = false,
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile' | 'markdown'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);

  const previewMarkdownContent = useMemo(() => {
    if (!template) return '';
    return generateREADME(template.config);
  }, [template]);

  if (!isOpen || !template) return null;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(previewMarkdownContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 select-none flex-shrink-0">
          <div className="flex items-center gap-3 truncate">
            <h2 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
              {template.name}
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
              {template.category}
            </span>
          </div>

          {/* Viewport Switcher Tabs */}
          <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                viewportMode === 'desktop' ? 'bg-white dark:bg-gray-900 text-blue-500 shadow-xs' : 'text-gray-400'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                viewportMode === 'mobile' ? 'bg-white dark:bg-gray-900 text-blue-500 shadow-xs' : 'text-gray-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
            <button
              onClick={() => setViewportMode('markdown')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                viewportMode === 'markdown' ? 'bg-white dark:bg-gray-900 text-blue-500 shadow-xs' : 'text-gray-400'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Raw MD
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Preview Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-6 custom-editor-scrollbar flex justify-center">
          <div
            className={`transition-all duration-300 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-md h-fit ${
              viewportMode === 'desktop' ? 'w-full max-w-4xl' : ''
            } ${viewportMode === 'mobile' ? 'w-[375px]' : ''} ${
              viewportMode === 'markdown' ? 'w-full max-w-4xl font-mono text-xs' : ''
            }`}
          >
            {viewportMode === 'markdown' ? (
              <div className="relative">
                <button
                  onClick={handleCopyMarkdown}
                  className="absolute top-2 right-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-2xs font-bold rounded-lg flex items-center gap-1 transition"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCode ? 'Copied!' : 'Copy Markdown'}
                </button>
                <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed font-mono p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl overflow-x-auto">
                  {previewMarkdownContent}
                </pre>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <MDEditorMarkdown source={previewMarkdownContent} />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0 select-none">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>By <strong>{template.author}</strong></span>
            <span>•</span>
            <span>Difficulty: <strong>{template.difficulty}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {onFavorite && (
              <button
                type="button"
                onClick={() => onFavorite(template.id)}
                className={`p-2 border rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  isFavorited
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onUse(template);
                onClose();
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              🚀 Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TemplatePreviewModal;
