/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import React from 'react';
import Input from '@/components/Input';
import { SupportConfig } from '@/stores/readme-store';

export interface SupportPanelProps {
  sectionId: string;
  support: SupportConfig;
  setSupport: (support: Partial<SupportConfig>) => void;
}

export const SupportPanel: React.FC<SupportPanelProps> = ({
  sectionId,
  support,
  setSupport,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          💖 Support Me Config
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={support.enabled}
            onChange={(e) => setSupport({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {support.enabled && (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Buy Me a Coffee Username</label>
              <Input
                value={support.buyMeACoffeeUsername || ''}
                onChange={(e) => setSupport({ buyMeACoffeeUsername: e.target.value })}
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Ko-fi Username</label>
              <Input
                value={support.kofiUsername || ''}
                onChange={(e) => setSupport({ kofiUsername: e.target.value })}
                placeholder="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Badge Style</label>
            <select
              value={support.style}
              onChange={(e) => setSupport({ style: e.target.value as any })}
              className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
            >
              <option value="flat">Flat</option>
              <option value="flat-square">Flat Square</option>
              <option value="for-the-badge">For the Badge</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPanel;
