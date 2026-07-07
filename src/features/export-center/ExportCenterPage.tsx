"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Button from '@/components/Button';
import Textarea from '@/components/Textarea';
import ErrorBoundary from '@/components/ErrorBoundary';
import useReadmeStore from '@/stores/readme-store';
import useRoadmapStore from '@/stores/roadmap-store';
import useThemeStore from '@/stores/theme-store';
import { generateREADME, generateRoadmapMarkdown, combineMarkdown, exportFile } from '@/utils/markdown';
import { generateShareUrl } from '@/utils/share-utils';
import '@uiw/react-md-editor/markdown-editor.css';
import {
  FileText,
  FileDown,
  Archive,
  Printer,
  Database,
  Copy,
  CheckCircle,
  History,
  Trash2,
  ArrowLeft,
  Download,
  Sparkles,
  Info,
  Share2
} from 'lucide-react';

// Dynamically import the Markdown preview component to disable SSR
const MDMarkdown = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800/40 rounded-md h-[400px] flex items-center justify-center text-xs text-gray-400">
        Loading markdown preview...
      </div>
    ),
  }
);

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const ExportCenterPage = () => {
  // Theme and store selectors
  const theme = useThemeStore((state) => state.theme);
  const readmeState = useReadmeStore();
  const roadmapState = useRoadmapStore();

  // Tab configurations
  const [activeTab, setActiveTab] = useState<'readme' | 'roadmap' | 'combined'>('combined');
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');

  // Toasts state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Markdown contents
  const readmeMarkdown = generateREADME(readmeState);
  const roadmapMarkdown = generateRoadmapMarkdown(roadmapState);
  const combinedMarkdown = combineMarkdown(readmeMarkdown, roadmapMarkdown);

  const activeContent =
    activeTab === 'readme'
      ? readmeMarkdown
      : activeTab === 'roadmap'
      ? roadmapMarkdown
      : combinedMarkdown;

  const activeTitle =
    activeTab === 'readme'
      ? 'README.md'
      : activeTab === 'roadmap'
      ? 'roadmap.md'
      : 'README_&_ROADMAP.md';

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Helper for identifying target project names for export history
  const getProjectName = (format: string) => {
    if (format.includes('README')) {
      return readmeState.name ? `${readmeState.name}'s Profile` : 'Untitled README';
    }
    if (format.includes('roadmap')) {
      return roadmapState.title || 'Untitled Roadmap';
    }
    return readmeState.name || roadmapState.title
      ? `${readmeState.name || 'Project'} Workspace`
      : 'Untitled Package';
  };

  // Copy handler
  const handleCopy = async (content: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content);
      addToast(`${label} copied to clipboard!`, 'success');
      
      // Increment exports
      if (label.includes('README')) {
        readmeState.incrementReadmeExports();
      } else if (label.includes('roadmap')) {
        roadmapState.incrementRoadmapExports();
      } else {
        readmeState.incrementReadmeExports();
        roadmapState.incrementRoadmapExports();
      }
      
      // Log to history
      readmeState.addExportHistoryItem('Clipboard Copy', getProjectName(label));
    } catch (err) {
      console.error('Failed to copy markdown:', err);
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  // Individual file download handlers
  const handleDownloadReadme = () => {
    if (!readmeMarkdown.trim()) {
      addToast('README content is empty. Add some details first!', 'error');
      return;
    }
    exportFile('markdown', {
      readmeContent: readmeMarkdown,
      roadmapContent: roadmapMarkdown,
      readmeData: readmeState,
      roadmapData: roadmapState,
      theme,
      title: 'README.md',
      filename: 'README.md'
    });
    readmeState.incrementReadmeExports();
    readmeState.addExportHistoryItem('README.md', getProjectName('README'));
    addToast('README.md download started!', 'success');
  };

  const handleDownloadRoadmap = () => {
    if (!roadmapMarkdown.trim()) {
      addToast('Roadmap content is empty. Create some steps first!', 'error');
      return;
    }
    exportFile('markdown', {
      readmeContent: roadmapMarkdown,
      roadmapContent: roadmapMarkdown,
      readmeData: readmeState,
      roadmapData: roadmapState,
      theme,
      title: 'roadmap.md',
      filename: 'roadmap.md'
    });
    roadmapState.incrementRoadmapExports();
    readmeState.addExportHistoryItem('roadmap.md', getProjectName('roadmap'));
    addToast('roadmap.md download started!', 'success');
  };

  const handleDownloadZip = async () => {
    if (!readmeMarkdown.trim() && !roadmapMarkdown.trim()) {
      addToast('No content generated yet to compile inside ZIP.', 'error');
      return;
    }
    try {
      await exportFile('zip', {
        readmeContent: readmeMarkdown,
        roadmapContent: roadmapMarkdown,
        readmeData: readmeState,
        roadmapData: roadmapState,
        theme,
        title: 'Combined Workspace',
        filename: 'owlreadme-workspace.zip'
      });
      readmeState.incrementReadmeExports();
      roadmapState.incrementRoadmapExports();
      readmeState.addExportHistoryItem('ZIP Package', getProjectName('Combined'));
      addToast('ZIP Package download started!', 'success');
    } catch (err) {
      console.error('ZIP generation failed:', err);
      addToast('ZIP compilation failed', 'error');
    }
  };

  const handleDownloadJson = () => {
    exportFile('json', {
      readmeContent: readmeMarkdown,
      roadmapContent: roadmapMarkdown,
      readmeData: readmeState,
      roadmapData: roadmapState,
      theme,
      title: 'Backup',
      filename: 'owlreadme-backup.json'
    });
    readmeState.incrementReadmeExports();
    roadmapState.incrementRoadmapExports();
    readmeState.addExportHistoryItem('JSON Backup', getProjectName('Combined'));
    addToast('JSON backup download started!', 'success');
  };

  const handlePdfPrint = () => {
    const printElement = document.getElementById('pdf-print-anchor');
    const printHtml = printElement?.innerHTML || '';
    if (!printHtml.trim() || !activeContent.trim()) {
      addToast('No preview content ready to render for PDF.', 'error');
      return;
    }
    
    exportFile('pdf', {
      readmeContent: readmeMarkdown,
      roadmapContent: roadmapMarkdown,
      readmeData: readmeState,
      roadmapData: roadmapState,
      theme,
      title: activeTitle,
      htmlContent: printHtml
    });
    
    // Log stats and history
    if (activeTab === 'readme') {
      readmeState.incrementReadmeExports();
    } else if (activeTab === 'roadmap') {
      roadmapState.incrementRoadmapExports();
    } else {
      readmeState.incrementReadmeExports();
      roadmapState.incrementRoadmapExports();
    }
    readmeState.addExportHistoryItem(`PDF Print (${activeTab})`, getProjectName(activeTab));
    addToast('PDF print preview requested!', 'success');
  };

  const handleShare = (type: 'readme' | 'roadmap') => {
    try {
      const state = type === 'readme' ? readmeState : roadmapState;
      const url = generateShareUrl(type, state, theme);
      navigator.clipboard.writeText(url);
      addToast(`Public share link for ${type === 'readme' ? 'README' : 'roadmap'} copied to clipboard!`, 'success');
      readmeState.addExportHistoryItem(`Share Link (${type})`, getProjectName(type));
    } catch (err) {
      console.error('Failed to generate share link:', err);
      addToast('Failed to copy share link', 'error');
    }
  };

  const handleClearHistory = () => {
    // Clear history logs without resetting the rest of the store
    useReadmeStore.setState({ exportHistory: [] });
    addToast('Export history log cleared!', 'info');
  };

  const colorMode = (theme === 'dark' || theme === 'gradient' || theme === 'terminal') ? 'dark' : 'light';

  // Format history timestamp nicely
  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-[#1e1e1e] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Workspace
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight">Export Studio</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Select a format to download, copy, or print your project workspace.
            </p>
          </div>
          <div className="flex gap-2">
            <Button href="/readme-builder" variant="secondary" className="text-xs">
              Edit README
            </Button>
            <Button href="/roadmap-builder" variant="secondary" className="text-xs">
              Edit Roadmap
            </Button>
          </div>
        </div>

        {/* 5-Column Formats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* README CARD */}
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition">
            <div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg w-fit mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg leading-tight">README.md</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4">
                Raw Markdown developer profile including synced GitHub bio and projects.
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={handleDownloadReadme} className="w-full text-xs py-2" variant="primary">
                <Download className="h-3 w-3 mr-1" /> Download
              </Button>
              <Button
                onClick={() => handleCopy(readmeMarkdown, 'README.md')}
                className="w-full text-xs py-2"
                variant="secondary"
              >
                <Copy className="h-3 w-3 mr-1" /> Copy Markdown
              </Button>
              <Button
                onClick={() => handleShare('readme')}
                className="w-full text-xs py-2"
                variant="secondary"
              >
                <Share2 className="h-3 w-3 mr-1" /> Share Link
              </Button>
            </div>
          </div>

          {/* ROADMAP CARD */}
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition">
            <div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg w-fit mb-4">
                <FileDown className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg leading-tight">roadmap.md</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4">
                Step-by-step customized curriculum roadmap structure in markdown file.
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={handleDownloadRoadmap} className="w-full text-xs py-2" variant="primary">
                <Download className="h-3 w-3 mr-1" /> Download
              </Button>
              <Button
                onClick={() => handleCopy(roadmapMarkdown, 'roadmap.md')}
                className="w-full text-xs py-2"
                variant="secondary"
              >
                <Copy className="h-3 w-3 mr-1" /> Copy Markdown
              </Button>
              <Button
                onClick={() => handleShare('roadmap')}
                className="w-full text-xs py-2"
                variant="secondary"
              >
                <Share2 className="h-3 w-3 mr-1" /> Share Link
              </Button>
            </div>
          </div>

          {/* ZIP PACKAGE */}
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition">
            <div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg w-fit mb-4">
                <Archive className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg leading-tight">ZIP Package</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4">
                Zipped bundle containing both README.md and roadmap.md for local setups.
              </p>
            </div>
            <div className="space-y-2 pt-4">
              <Button onClick={handleDownloadZip} className="w-full text-xs py-2" variant="primary">
                <Archive className="h-3 w-3 mr-1" /> Download ZIP
              </Button>
            </div>
          </div>

          {/* PDF EXPORT */}
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition">
            <div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg w-fit mb-4">
                <Printer className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg leading-tight">PDF Export</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4">
                Print active tab preview into styled layout PDF via system dialogue.
              </p>
            </div>
            <div className="space-y-2 pt-4">
              <Button onClick={handlePdfPrint} className="w-full text-xs py-2" variant="primary">
                <Printer className="h-3 w-3 mr-1" /> Print PDF
              </Button>
            </div>
          </div>

          {/* JSON BACKUP */}
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition">
            <div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg w-fit mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg leading-tight">JSON Backup</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4">
                Complete data backup containing JSON structures of stores for restore.
              </p>
            </div>
            <div className="space-y-2 pt-4">
              <Button onClick={handleDownloadJson} className="w-full text-xs py-2" variant="primary">
                <Database className="h-3 w-3 mr-1" /> Backup Store
              </Button>
            </div>
          </div>
        </div>

        {/* Preview and Workspace Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Preview Panel (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col h-[600px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 gap-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <h2 className="font-bold text-lg">Studio Preview</h2>
              </div>
              <div role="tablist" className="flex bg-gray-100 dark:bg-black/40 rounded-lg p-1 text-xs">
                <button
                  role="tab"
                  aria-selected={viewMode === 'preview'}
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    viewMode === 'preview'
                      ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  Rendered
                </button>
                <button
                  role="tab"
                  aria-selected={viewMode === 'source'}
                  onClick={() => setViewMode('source')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    viewMode === 'source'
                      ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  Raw Source
                </button>
              </div>
            </div>

            {/* Target Select Tabs */}
            <div role="tablist" className="flex border-b border-gray-100 dark:border-gray-800 mb-4 text-xs font-semibold">
              <button
                role="tab"
                aria-selected={activeTab === 'readme'}
                onClick={() => setActiveTab('readme')}
                className={`pb-2 px-4 border-b-2 transition cursor-pointer ${
                  activeTab === 'readme'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                README.md
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'roadmap'}
                onClick={() => setActiveTab('roadmap')}
                className={`pb-2 px-4 border-b-2 transition cursor-pointer ${
                  activeTab === 'roadmap'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                roadmap.md
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'combined'}
                onClick={() => setActiveTab('combined')}
                className={`pb-2 px-4 border-b-2 transition cursor-pointer ${
                  activeTab === 'combined'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Combined Workspace
              </button>
            </div>

            {/* Content Display Container */}
            <div className="flex-1 overflow-auto border border-gray-100 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-black/10">
              {viewMode === 'preview' ? (
                <div data-color-mode={colorMode} className="theme-preview-container min-h-full">
                  <ErrorBoundary name="Export Preview Renderer" fallback={<div className="p-4 text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">Failed to render markdown content. Syntax errors in template or markdown.</div>}>
                    {activeContent.trim() ? (
                      <MDMarkdown source={activeContent} style={{ background: 'transparent', color: 'inherit' }} />
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-12">
                        Empty preview. Modify data in builders first.
                      </p>
                    )}
                  </ErrorBoundary>
                </div>
              ) : (
                <Textarea
                  value={activeContent}
                  onChange={() => {}}
                  placeholder="No code generated yet. Build your files first!"
                  className="w-full h-full font-mono text-xs resize-none bg-transparent border-0 focus:ring-0 focus:outline-none"
                  readOnly
                  rows={20}
                />
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="flex justify-between items-center mt-4 text-xs">
              <span className="text-gray-400">
                Viewing: <b className="text-gray-600 dark:text-gray-200">{activeTitle}</b>
              </span>
              <Button
                onClick={() => handleCopy(activeContent, activeTitle)}
                variant="secondary"
                className="py-1 px-3 text-xs"
              >
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy Active Code
              </Button>
            </div>
          </div>

          {/* Export History (Spans 1 column) */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col h-[600px]">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-blue-500" />
                <h2 className="font-bold text-lg">Export History Log</h2>
              </div>
              {readmeState.exportHistory && readmeState.exportHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>

            {/* History Table */}
            <div className="flex-1 overflow-auto">
              {!readmeState.exportHistory || readmeState.exportHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-full text-gray-400 mb-2">
                    <History className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm">No Exports Logged</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                    Your history is saved locally and logs formats, targets, and dates.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pr-1">
                  {readmeState.exportHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 text-xs flex flex-col justify-between gap-1 hover:border-gray-200 dark:hover:border-gray-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800 dark:text-gray-100">{item.projectName}</span>
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-500 uppercase tracking-wide">
                          {item.format}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                        <span>{formatTimestamp(item.timestamp)}</span>
                        <span className="flex items-center text-green-500 font-semibold gap-0.5">
                          <CheckCircle className="h-3 w-3" /> Success
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 flex items-center space-x-1.5 bg-blue-50/20 dark:bg-blue-950/10 p-2.5 rounded-lg">
              <Info className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Exports automatically increment counts on your developer dashboard.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden PDF compilation container (always rendered as html) */}
      <div style={{ display: 'none' }}>
        <div id="pdf-print-anchor">
          <div data-color-mode={colorMode} className="theme-preview-container">
            <ErrorBoundary name="PDF Export Compiler" fallback={<p className="text-red-500 font-mono text-xs">Failed to compile preview for PDF export.</p>}>
              {activeContent.trim() ? (
                <MDMarkdown source={activeContent} style={{ background: 'transparent', color: 'inherit' }} />
              ) : (
                <p>No content generated</p>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 border transition-all duration-300 transform translate-y-0 animate-fade-in pointer-events-auto w-full justify-between ${
              theme === 'terminal'
                ? 'bg-black border-[#39ff14] text-[#39ff14]'
                : theme === 'gradient'
                ? 'bg-[#1e1b4b]/95 border-purple-500/30 text-white backdrop-blur-md shadow-purple-500/10 shadow-lg'
                : theme === 'dark'
                ? 'bg-[#1a1a1a] border-gray-800 text-white'
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle
                className={`h-5 w-5 shrink-0 ${
                  theme === 'terminal'
                    ? 'text-[#39ff14]'
                    : toast.type === 'error'
                    ? 'text-red-500'
                    : toast.type === 'info'
                    ? 'text-blue-500'
                    : 'text-green-500'
                }`}
              />
              <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportCenterPage;