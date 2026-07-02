import React from 'react';
import Textarea from '@/components/Textarea';
import { CustomMarkdownConfig } from '@/stores/readme-store';

export interface CustomMarkdownPanelProps {
  sectionId: string;
  customMarkdown: CustomMarkdownConfig;
  setCustomMarkdown: (custom: Partial<CustomMarkdownConfig>) => void;
}

export const CustomMarkdownPanel: React.FC<CustomMarkdownPanelProps> = ({
  sectionId,
  customMarkdown,
  setCustomMarkdown,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          ✍️ Custom Markdown Config
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={customMarkdown.enabled}
            onChange={(e) => setCustomMarkdown({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {customMarkdown.enabled && (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Custom Markdown Content</label>
            <Textarea
              value={customMarkdown.content}
              onChange={(e) => setCustomMarkdown({ content: e.target.value })}
              placeholder="Type any custom markdown or HTML tags here..."
              rows={5}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMarkdownPanel;
