import React from 'react';
import { PanelLeft, PanelLeftClose, Maximize2, Minimize2 } from 'lucide-react';

export interface BuilderSidebarProps {
  mode: 'desktop' | 'mobile';
  
  // Collapse/Expand states for desktop split panel
  builderCollapsed?: boolean;
  setBuilderCollapsed?: (collapsed: boolean) => void;
  fullscreenPanel?: 'builder' | 'preview' | 'markdown' | null;
  setFullscreenPanel?: (panel: 'builder' | 'preview' | 'markdown' | null) => void;
  panelWidth?: string;
  
  // Tabs controller
  activeBuilderTab: 'editor' | 'marketplace' | 'community' | 'analyzer' | 'improver';
  setActiveBuilderTab: (tab: 'editor' | 'marketplace' | 'community' | 'analyzer' | 'improver') => void;
  marketplaceLength: number;
  
  children: React.ReactNode;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  mode,
  builderCollapsed = false,
  setBuilderCollapsed,
  fullscreenPanel = null,
  setFullscreenPanel,
  panelWidth = '32%',
  activeBuilderTab,
  setActiveBuilderTab,
  marketplaceLength,
  children,
}) => {
  // Mobile rendering layout
  if (mode === 'mobile') {
    return (
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#121212] flex flex-col h-full">
        {/* Tab Header inside mobile builder tab */}
        <div className="flex border-b border-gray-150 dark:border-gray-800 bg-gray-55/20 dark:bg-gray-900/5 flex-shrink-0 select-none">
          <button
            onClick={() => setActiveBuilderTab('editor')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'editor'
                ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            ✏️ Section Editor
          </button>
          <button
            onClick={() => setActiveBuilderTab('marketplace')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'marketplace'
                ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            🛍️ Marketplace ({marketplaceLength})
          </button>
          <button
            onClick={() => setActiveBuilderTab('community')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'community'
                ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            👥 Community
          </button>
          <button
            onClick={() => setActiveBuilderTab('analyzer')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'analyzer'
                ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            📊 Quality
          </button>
          <button
            onClick={() => setActiveBuilderTab('improver')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'improver'
                ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            ✨ AI
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-editor-scrollbar">
          {children}
        </div>
      </div>
    );
  }

  // Desktop rendering layout
  if (builderCollapsed && !fullscreenPanel) {
    return (
      <div
        onClick={() => setBuilderCollapsed?.(false)}
        className="w-9 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/40 flex flex-col items-center py-4 cursor-pointer select-none gap-2 flex-shrink-0 transition"
        title="Expand Section Builder"
      >
        <PanelLeft className="h-4 w-4 text-gray-400" />
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-4 [writing-mode:vertical-lr] rotate-180 select-none">
          Section Builder
        </span>
      </div>
    );
  }

  if (fullscreenPanel !== null && fullscreenPanel !== 'builder') {
    return null;
  }

  return (
    <div
      style={{ width: panelWidth }}
      className="flex flex-col h-full bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 overflow-hidden flex-shrink-0"
    >
      {/* Panel Header Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0 items-center justify-between px-2 select-none">
        <div className="flex flex-1">
          <button
            onClick={() => setActiveBuilderTab('editor')}
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'editor'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-400'
            }`}
          >
            ✏️ Edit Sections
          </button>
          <button
            onClick={() => setActiveBuilderTab('marketplace')}
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'marketplace'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-400'
            }`}
          >
            🛍️ Marketplace ({marketplaceLength})
          </button>
          <button
            onClick={() => setActiveBuilderTab('community')}
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'community'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-400'
            }`}
          >
            👥 Community
          </button>
          <button
            onClick={() => setActiveBuilderTab('analyzer')}
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'analyzer'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-400'
            }`}
          >
            📊 Quality Analyzer
          </button>
          <button
            onClick={() => setActiveBuilderTab('improver')}
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
              activeBuilderTab === 'improver'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-400'
            }`}
          >
            ✨ AI Improve
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setFullscreenPanel?.(fullscreenPanel === 'builder' ? null : 'builder')}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-850 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            title={fullscreenPanel === 'builder' ? 'Minimize Panel' : 'Maximize Panel'}
          >
            {fullscreenPanel === 'builder' ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => setBuilderCollapsed?.(true)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-850 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            title="Collapse Panel"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-editor-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default BuilderSidebar;
