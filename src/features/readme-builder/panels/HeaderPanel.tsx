/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import React from 'react';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import { READMEStyleTemplate } from '@/stores/readme-store';
import type { Snapshot } from '@/stores/history-store';

export interface HeaderPanelProps {
  sectionId: string;
  header: {
    enabled: boolean;
    intro: string;
    alignment: 'left' | 'center' | 'right';
    bannerType: 'none' | 'capsule' | 'wave' | 'gradient';
    bannerText: string;
    bannerTheme: string;
    typingEnabled: boolean;
    typingLines: string[];
    typingSpeed: number;
    typingDelay: number;
    typingColor: string;
    typingCenter: boolean;
    badges: {
      openToWork: boolean;
      freelance: boolean;
      learning: string;
      building: string;
    };
    visitorPlacement: 'hidden' | 'top' | 'bottom';
  };
  setHeader: (updates: Partial<HeaderPanelProps['header']>) => void;
  
  template: string;
  setTemplate: (template: READMEStyleTemplate) => void;
  triggerAutoSnapshot: (source: 'template' | 'manual' | 'ai' | 'import' | 'auto', customTitle?: string) => void;
  pushUndo: (config: Snapshot['config']) => void;
  getCurrentConfig: () => Snapshot['config'];
  handleUndoCapture: () => void;
  
  name: string;
  setName: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  about: string;
  setAbout: (val: string) => void;
  skills: string;
  setSkills: (val: string) => void;
  projects: string;
  setProjects: (val: string) => void;
  socials: string;
  setSocials: (val: string) => void;
  loading: boolean;
}

export const HeaderPanel: React.FC<HeaderPanelProps> = ({
  sectionId,
  header,
  setHeader,
  template,
  setTemplate,
  triggerAutoSnapshot,
  pushUndo,
  getCurrentConfig,
  handleUndoCapture,
  name,
  setName,
  role,
  setRole,
  about,
  setAbout,
  skills,
  setSkills,
  projects,
  setProjects,
  socials,
  setSocials,
  loading,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          👤 Profile Header Config
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={header.enabled}
            onChange={(e) => setHeader({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Template Selector */}
      <div className="w-full max-w-lg mb-6">
        <label htmlFor="readme-template-select" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 font-semibold">README Style Template</label>
        <select
          id="readme-template-select"
          value={template}
          onChange={(e) => {
            triggerAutoSnapshot('template', 'Style Template Change');
            pushUndo(getCurrentConfig());
            setTemplate(e.target.value as READMEStyleTemplate);
          }}
          className="w-full px-4 py-2 text-black dark:text-white rounded-md border border-gray-350 dark:bg-[#1e1e1e] dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
        >
          <option value="minimal">Minimal</option>
          <option value="professional">Professional</option>
          <option value="developer">Developer</option>
          <option value="open-source">Open Source</option>
          <option value="portfolio">Portfolio</option>
        </select>
      </div>

      <div className="space-y-4 w-full max-w-lg">
        <div>
          <label htmlFor="readme-name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
          <Input
            id="readme-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={handleUndoCapture}
            placeholder="Your Name"
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-role" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role / Designation</label>
          <Input
            id="readme-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onFocus={handleUndoCapture}
            placeholder="Your Role"
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-about" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">About Me / Bio</label>
          <Textarea
            id="readme-about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            onFocus={handleUndoCapture}
            placeholder="About You"
            rows={4}
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-skills" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Skills</label>
          <Textarea
            id="readme-skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            onFocus={handleUndoCapture}
            placeholder="Skills (comma-separated or list)"
            rows={3}
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-projects" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Projects / Repositories</label>
          <Textarea
            id="readme-projects"
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
            onFocus={handleUndoCapture}
            placeholder="Projects (comma-separated or list)"
            rows={4}
            loading={loading}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="readme-socials" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Social Links</label>
          <Textarea
            id="readme-socials"
            value={socials}
            onChange={(e) => setSocials(e.target.value)}
            onFocus={handleUndoCapture}
            placeholder="Social Links (comma-separated or list)"
            rows={3}
            loading={loading}
            disabled={loading}
          />
        </div>

        {/* Short Intro */}
        <div>
          <label htmlFor="header-intro-input" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Short Introduction</label>
          <Input
            id="header-intro-input"
            value={header.intro}
            onChange={(e) => setHeader({ intro: e.target.value })}
            placeholder="e.g. Passionate developer building web applications."
          />
        </div>

        {/* Alignment Selector */}
        <div>
          <span className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Alignment</span>
          <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => setHeader({ alignment: align })}
                className={`px-3 py-1.5 rounded text-xs capitalize transition font-medium cursor-pointer ${
                  header.alignment === align
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        {/* Banner Configuration */}
        <div className="p-4 rounded border border-gray-100 dark:border-gray-800 space-y-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Banner Config</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Banner Type</label>
              <select
                value={header.bannerType || 'none'}
                onChange={(e) => setHeader({ bannerType: e.target.value as any })}
                className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value="none">None</option>
                <option value="capsule">Capsule Render (Waving)</option>
                <option value="wave">Wave Header</option>
                <option value="gradient">Gradient Banner</option>
              </select>
            </div>
            <div>
              <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Banner Text</label>
              <input
                type="text"
                placeholder="Welcome..."
                value={header.bannerText || ''}
                onChange={(e) => setHeader({ bannerText: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Banner Theme/Color</label>
              <select
                value={header.bannerTheme || 'gradient'}
                onChange={(e) => setHeader({ bannerTheme: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value="gradient">Gradient</option>
                <option value="radical">Radical</option>
                <option value="dracula">Dracula</option>
                <option value="github">GitHub</option>
                <option value="ocean">Ocean</option>
                <option value="sunset">Sunset</option>
              </select>
            </div>
          </div>
        </div>

        {/* Typing SVG config */}
        <div className="p-4 rounded border border-gray-105 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Typing SVG Settings</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={header.typingEnabled}
                onChange={(e) => setHeader({ typingEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {header.typingEnabled && (
            <div className="space-y-3 transition-all duration-255">
              {/* List of lines */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Text Lines</label>
                {(header.typingLines || []).map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const newLines = [...(header.typingLines || [])];
                        newLines[idx] = e.target.value;
                        setHeader({ typingLines: newLines });
                      }}
                      className="flex-1 text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      placeholder={`Line ${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newLines = (header.typingLines || []).filter((_, i) => i !== idx);
                        setHeader({ typingLines: newLines });
                      }}
                      className="text-red-500 text-xs font-semibold p-1.5 hover:bg-red-500/10 rounded cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setHeader({ typingLines: [...(header.typingLines || []), ''] });
                  }}
                  className="text-blue-500 text-xs font-semibold hover:underline cursor-pointer"
                >
                  + Add Line
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Speed</label>
                  <input
                    type="number"
                    value={header.typingSpeed || 200}
                    onChange={(e) => setHeader({ typingSpeed: parseInt(e.target.value) || 200 })}
                    className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Delay</label>
                  <input
                    type="number"
                    value={header.typingDelay || 1000}
                    onChange={(e) => setHeader({ typingDelay: parseInt(e.target.value) || 1000 })}
                    className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Hex Color</label>
                  <input
                    type="text"
                    value={header.typingColor || '36BCF7'}
                    onChange={(e) => setHeader({ typingColor: e.target.value })}
                    className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={header.typingCenter !== false}
                      onChange={(e) => setHeader({ typingCenter: e.target.checked })}
                      className="rounded border-gray-300 dark:bg-gray-800"
                    />
                    <span>Center Text</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="p-4 rounded border border-gray-105 dark:border-gray-800 space-y-4">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Status Badges Under Header</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={header.badges.openToWork}
                  onChange={(e) => setHeader({
                    badges: {
                      ...header.badges,
                      openToWork: e.target.checked,
                    }
                  })}
                  className="rounded border-gray-300 dark:bg-gray-800"
                />
                <span>Open to Work Badge</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={header.badges.freelance}
                  onChange={(e) => setHeader({
                    badges: {
                      ...header.badges,
                      freelance: e.target.checked,
                    }
                  })}
                  className="rounded border-gray-300 dark:bg-gray-800"
                />
                <span>Freelance Badge</span>
              </label>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Learning Status</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Rust..."
                  value={header.badges.learning || ''}
                  onChange={(e) => setHeader({
                    badges: {
                      ...header.badges,
                      learning: e.target.value,
                    }
                  })}
                  className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Building Status</label>
                <input
                  type="text"
                  placeholder="e.g. SaaS project, Compiler..."
                  value={header.badges.building || ''}
                  onChange={(e) => setHeader({
                    badges: {
                      ...header.badges,
                      building: e.target.value,
                    }
                  })}
                  className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Placement & Views placement */}
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 font-medium">Visitor Counter Placement</label>
          <select
            value={header.visitorPlacement || 'hidden'}
            onChange={(e) => setHeader({ visitorPlacement: e.target.value as any })}
            className="w-full md:w-64 text-xs p-2 rounded border border-gray-305 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500"
          >
            <option value="hidden">Hidden</option>
            <option value="top">Top (Prepend before Name)</option>
            <option value="bottom">Bottom (Append after Badges)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default HeaderPanel;
