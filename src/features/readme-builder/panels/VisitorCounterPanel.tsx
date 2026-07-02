import React from 'react';
import Input from '@/components/Input';
import { StandaloneVisitorConfig } from '@/stores/readme-store';

export interface VisitorCounterPanelProps {
  sectionId: string;
  standaloneVisitor: StandaloneVisitorConfig;
  setStandaloneVisitor: (visitor: Partial<StandaloneVisitorConfig>) => void;
  defaultUsername: string;
}

export const VisitorCounterPanel: React.FC<VisitorCounterPanelProps> = ({
  sectionId,
  standaloneVisitor,
  setStandaloneVisitor,
  defaultUsername,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          👀 Standalone Visitor Counter
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={standaloneVisitor.enabled}
            onChange={(e) => setStandaloneVisitor({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {standaloneVisitor.enabled && (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">GitHub Username</label>
              <Input
                value={standaloneVisitor.username || ''}
                onChange={(e) => setStandaloneVisitor({ username: e.target.value })}
                placeholder={defaultUsername || 'username'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Badge Style</label>
              <select
                value={standaloneVisitor.style}
                onChange={(e) => setStandaloneVisitor({ style: e.target.value })}
                className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
              >
                <option value="flat">Flat</option>
                <option value="flat-square">Flat Square</option>
                <option value="plastic">Plastic</option>
                <option value="for-the-badge">For the Badge</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Hex Color / Color Name</label>
              <Input
                value={standaloneVisitor.color}
                onChange={(e) => setStandaloneVisitor({ color: e.target.value })}
                placeholder="green"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorCounterPanel;
