import React from 'react';
import dynamic from 'next/dynamic';
import { Eye, Minimize2, Maximize2, PanelLeftClose, PanelRightClose, Code, Copy, Download } from 'lucide-react';

const MDMarkdown = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
);

export interface BuilderPreviewProps {
  localMarkdown: string;
  setLocalMarkdown: (md: string) => void;
  theme: string;
  copied: boolean;
  handleCopy: () => void;
  handleDownload: () => void;
  previewScrollRef?: React.RefObject<HTMLDivElement | null>;
  editorScrollRef?: React.RefObject<HTMLTextAreaElement | null>;
  handlePreviewScroll?: () => void;
  handleEditorScroll?: () => void;
  
  // Layout states
  previewCollapsed?: boolean;
  setPreviewCollapsed?: (collapsed: boolean) => void;
  markdownCollapsed?: boolean;
  setMarkdownCollapsed?: (collapsed: boolean) => void;
  fullscreenPanel?: 'builder' | 'preview' | 'markdown' | null;
  setFullscreenPanel?: (panel: 'builder' | 'preview' | 'markdown' | null) => void;
  panelWidth?: string;
  
  mode: 'desktop-preview' | 'desktop-markdown' | 'mobile-preview' | 'mobile-markdown';
}

export const BuilderPreview: React.FC<BuilderPreviewProps> = ({
  localMarkdown,
  setLocalMarkdown,
  theme,
  copied,
  handleCopy,
  handleDownload,
  previewScrollRef,
  editorScrollRef,
  handlePreviewScroll,
  handleEditorScroll,
  
  previewCollapsed = false,
  setPreviewCollapsed,
  markdownCollapsed = false,
  setMarkdownCollapsed,
  fullscreenPanel = null,
  setFullscreenPanel,
  panelWidth = '30%',
  mode,
}) => {
  // ── Mobile Preview Tab ──
  if (mode === 'mobile-preview') {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#101012] custom-editor-scrollbar">
        <div data-color-mode={theme === 'minimal' ? 'light' : 'dark'} className="theme-preview-container">
          <MDMarkdown source={localMarkdown} style={{ background: 'transparent', color: 'inherit' }} />
        </div>
      </div>
    );
  }

  // ── Mobile Markdown Tab ──
  if (mode === 'mobile-markdown') {
    return (
      <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden relative">
        <div className="flex items-center justify-end gap-2 p-2 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-xs font-bold rounded bg-gray-850 hover:bg-gray-800 text-gray-300 cursor-pointer"
          >
            Download
          </button>
        </div>
        <div className="flex-1 p-4 overflow-hidden relative h-full">
          <textarea
            value={localMarkdown}
            onChange={(e) => setLocalMarkdown(e.target.value)}
            className="w-full h-full font-mono text-xs text-slate-300 bg-transparent resize-none border-none outline-none focus:ring-0 leading-relaxed custom-editor-scrollbar overflow-y-auto raw-markdown-editor"
          />
        </div>
      </div>
    );
  }

  // ── Desktop Live Preview Panel ──
  if (mode === 'desktop-preview') {
    if (previewCollapsed && !fullscreenPanel) {
      return (
        <div
          onClick={() => setPreviewCollapsed?.(false)}
          className="w-9 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/40 flex flex-col items-center py-4 cursor-pointer select-none gap-2 flex-shrink-0 transition"
          title="Expand Live Preview"
        >
          <Eye className="h-4 w-4 text-gray-400" />
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-4 [writing-mode:vertical-lr] rotate-180 select-none">
            Live Preview
          </span>
        </div>
      );
    }

    if (fullscreenPanel !== null && fullscreenPanel !== 'preview') {
      return null;
    }

    return (
      <div
        style={{ width: panelWidth }}
        className="flex flex-col h-full bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 overflow-hidden flex-shrink-0"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0 select-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5 select-none">
            👁️ Live Preview
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFullscreenPanel?.(fullscreenPanel === 'preview' ? null : 'preview')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-855 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              title={fullscreenPanel === 'preview' ? 'Minimize Panel' : 'Maximize Panel'}
            >
              {fullscreenPanel === 'preview' ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={() => setPreviewCollapsed?.(true)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-855 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              title="Collapse Panel"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Markdown preview renderer */}
        <div
          ref={previewScrollRef}
          onScroll={handlePreviewScroll}
          className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#101012] custom-editor-scrollbar"
        >
          <div data-color-mode={theme === 'minimal' ? 'light' : 'dark'} className="theme-preview-container">
            <MDMarkdown source={localMarkdown} style={{ background: 'transparent', color: 'inherit' }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop Raw Markdown Panel ──
  if (mode === 'desktop-markdown') {
    if (markdownCollapsed && !fullscreenPanel) {
      return (
        <div
          onClick={() => setMarkdownCollapsed?.(false)}
          className="w-9 bg-white dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-gray-800/40 flex flex-col items-center py-4 cursor-pointer select-none gap-2 flex-shrink-0 transition"
          title="Expand Raw Markdown"
        >
          <Code className="h-4 w-4 text-gray-400" />
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-4 [writing-mode:vertical-lr] rotate-180 select-none">
            Raw Markdown
          </span>
        </div>
      );
    }

    if (fullscreenPanel !== null && fullscreenPanel !== 'markdown') {
      return null;
    }

    return (
      <div
        style={{ width: panelWidth }}
        className="flex flex-col h-full bg-white dark:bg-[#121212] overflow-hidden flex-shrink-0"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0 select-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5 select-none">
            📝 Raw Markdown
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-2xs font-extrabold rounded bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1 text-2xs font-extrabold rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition cursor-pointer"
            >
              <Download className="h-3 w-3" />
              Download
            </button>
            <button
              onClick={() => setFullscreenPanel?.(fullscreenPanel === 'markdown' ? null : 'markdown')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-855 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              title={fullscreenPanel === 'markdown' ? 'Minimize Panel' : 'Maximize Panel'}
            >
              {fullscreenPanel === 'markdown' ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={() => setMarkdownCollapsed?.(true)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-855 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              title="Collapse Panel"
            >
              <PanelRightClose className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Editor Textarea */}
        <div className="flex-1 bg-gray-950 p-4 relative h-full">
          <textarea
            ref={editorScrollRef}
            onScroll={handleEditorScroll}
            value={localMarkdown}
            onChange={(e) => setLocalMarkdown(e.target.value)}
            placeholder="Type or tweak generated markdown here..."
            className="w-full h-full font-mono text-xs text-slate-300 bg-transparent resize-none border-none outline-none focus:ring-0 leading-relaxed custom-editor-scrollbar overflow-y-auto raw-markdown-editor"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default BuilderPreview;
