import React from 'react';

export interface BuilderLayoutProps {
  header: React.ReactNode;
  statusBar: React.ReactNode;
  mobileTabsHeader: React.ReactNode;
  
  // Panel state props
  builderCollapsed: boolean;
  previewCollapsed: boolean;
  markdownCollapsed: boolean;
  fullscreenPanel: 'builder' | 'preview' | 'markdown' | null;
  panelWidths: { builder: string; preview: string; markdown: string };
  startResizing: (e: React.PointerEvent<HTMLDivElement>, direction: 'left' | 'right') => void;
  
  // Desktop Panel slots
  desktopBuilderPanel: React.ReactNode;
  desktopPreviewPanel: React.ReactNode;
  desktopMarkdownPanel: React.ReactNode;
  
  // Mobile Panel slots
  mobileViewMode: 'builder' | 'preview' | 'markdown';
  mobileBuilderPanel: React.ReactNode;
  mobilePreviewPanel: React.ReactNode;
  mobileMarkdownPanel: React.ReactNode;
  
  error: string | null;
  setError: (err: string | null) => void;
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({
  header,
  statusBar,
  mobileTabsHeader,
  builderCollapsed,
  previewCollapsed,
  markdownCollapsed,
  fullscreenPanel,
  panelWidths,
  startResizing,
  desktopBuilderPanel,
  desktopPreviewPanel,
  desktopMarkdownPanel,
  mobileViewMode,
  mobileBuilderPanel,
  mobilePreviewPanel,
  mobileMarkdownPanel,
  error,
  setError,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-[#0c0c0e] text-black dark:text-white transition-colors duration-200 overflow-hidden">
      
      {/* Top Header toolbar */}
      {header}

      {/* Mobile View Tabs Header (visible below lg screen) */}
      {mobileTabsHeader}

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative w-full">
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-md z-50 text-xs flex items-center gap-2">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold hover:text-red-900 cursor-pointer">✕</button>
          </div>
        )}

        {/* Desktop Split Panels */}
        <div className="hidden lg:flex flex-1 w-full h-full overflow-hidden select-none">
          {desktopBuilderPanel}

          {/* Separator 1 */}
          {!builderCollapsed && !previewCollapsed && !fullscreenPanel && (
            <div
              onPointerDown={(e) => startResizing(e, 'left')}
              className="w-1.5 bg-transparent hover:bg-blue-500/25 transition cursor-col-resize h-full flex-shrink-0 z-30 flex items-center justify-center"
            >
              <div className="w-[2px] h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
          )}

          {desktopPreviewPanel}

          {/* Separator 2 */}
          {!previewCollapsed && !markdownCollapsed && !fullscreenPanel && (
            <div
              onPointerDown={(e) => startResizing(e, 'right')}
              className="w-1.5 bg-transparent hover:bg-blue-500/25 transition cursor-col-resize h-full flex-shrink-0 z-30 flex items-center justify-center"
            >
              <div className="w-[2px] h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
          )}

          {desktopMarkdownPanel}
        </div>

        {/* Mobile Layout Columns (visible below lg screen) */}
        <div className="lg:hidden flex-1 w-full h-full overflow-hidden flex flex-col">
          {mobileViewMode === 'builder' && mobileBuilderPanel}
          {mobileViewMode === 'preview' && mobilePreviewPanel}
          {mobileViewMode === 'markdown' && mobileMarkdownPanel}
        </div>
      </div>

      {/* Telemetry/auto-save bar */}
      {statusBar}
    </div>
  );
};

export default BuilderLayout;
