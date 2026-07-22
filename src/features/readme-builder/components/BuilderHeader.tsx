import React from 'react';
import Button from '@/components/Button';
import { Layout, FolderPlus } from 'lucide-react';
import { BRANDING } from '@/config/branding';
import type { Workspace } from '@/stores/workspace-store';
import type { READMEStyleTemplate } from '@/stores/readme-store';
import type { Theme } from '../types/builder-types';

export interface BuilderHeaderProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  createWorkspace: (name: string, type: 'readme' | 'roadmap') => string;
  setActiveWorkspaceId: (id: string | null) => void;
  template: string;
  setTemplate: (template: READMEStyleTemplate) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resetLayout: () => void;
  setIsImportModalOpen: (open: boolean) => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  workspaces,
  activeWorkspaceId,
  createWorkspace,
  setActiveWorkspaceId,
  template,
  setTemplate,
  theme,
  setTheme,
  resetLayout,
  setIsImportModalOpen,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 z-50 flex-shrink-0 gap-3">
      <div className="flex items-center gap-2.5">
        <span className="text-lg font-black tracking-tight text-blue-600 dark:text-blue-400 flex items-center gap-2 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/branding/owlreadme-icon.svg" className="h-6 w-6" alt="OwlREADME Icon" />
          <span>{BRANDING.name}</span>
          <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/35 text-blue-700 dark:text-blue-300">v{BRANDING.version}</span>
        </span>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        {workspaces.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Workspace:</span>
            <select
              value={activeWorkspaceId || ''}
              onChange={(e) => {
                if (e.target.value === 'new-workspace-trigger') {
                  const name = prompt('Enter workspace name:');
                  if (name && name.trim()) {
                    createWorkspace(name.trim(), 'readme');
                  }
                } else {
                  setActiveWorkspaceId(e.target.value);
                }
              }}
              className="px-2 py-1 text-xs rounded border border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-blue-500 focus:outline-none cursor-pointer text-black dark:text-white"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
              <option value="new-workspace-trigger">+ Create New...</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <label htmlFor="builder-template-select" className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Template:</label>
          <select
            id="builder-template-select"
            value={template}
            onChange={(e) => setTemplate(e.target.value as READMEStyleTemplate)}
            className="px-2 py-1 text-xs rounded border border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-blue-500 focus:outline-none cursor-pointer text-black dark:text-white"
          >
            <option value="minimal">Minimal</option>
            <option value="professional">Professional</option>
            <option value="developer">Developer</option>
            <option value="open-source">Open Source</option>
            <option value="portfolio">Portfolio</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <label htmlFor="builder-theme-select" className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Theme:</label>
          <select
            id="builder-theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="px-2 py-1 text-xs rounded border border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-blue-500 focus:outline-none cursor-pointer text-black dark:text-white"
          >
            <option value="minimal">Minimal Theme</option>
            <option value="dark">Dark Theme</option>
            <option value="gradient">Gradient Theme</option>
            <option value="terminal">Terminal Theme</option>
          </select>
        </div>

        <button
          onClick={resetLayout}
          className="p-1 rounded hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer transition text-xs"
          title="Reset panel layouts to defaults"
        >
          <Layout className="h-3.5 w-3.5" />
          <span className="hidden md:inline font-semibold">Reset View</span>
        </button>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="p-1 rounded hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer transition text-xs"
          title="Import an existing GitHub Profile README"
        >
          <FolderPlus className="h-3.5 w-3.5" />
          <span className="hidden md:inline font-semibold">Import README</span>
        </button>

        <Button href="/templates" variant="secondary" className="!py-1 !px-2.5 !text-xs">
          🛍️ Templates
        </Button>

        <Button href="/dashboard" variant="secondary" className="!py-1 !px-2.5 !text-xs">
          Dashboard
        </Button>
      </div>
    </header>
  );
};

export default BuilderHeader;
