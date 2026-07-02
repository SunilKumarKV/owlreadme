import React from 'react';
import Input from '@/components/Input';

export interface GitHubStatsPanelProps {
  sectionId: string;
  githubStats: {
    enabled: boolean;
    username: string;
    theme: string;
    showIcons: boolean;
    hideBorder: boolean;
    cardConfigs: {
      stats: { enabled: boolean };
      languages: { enabled: boolean };
      streak: { enabled: boolean };
    };
  };
  setGithubStats: (updates: Partial<GitHubStatsPanelProps['githubStats']> | { cardConfigs: any }) => void;
}

export const GitHubStatsPanel: React.FC<GitHubStatsPanelProps> = ({
  sectionId,
  githubStats,
  setGithubStats,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          📊 GitHub Stats Builder
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={githubStats.enabled}
            onChange={(e) => setGithubStats({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {githubStats.enabled && (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stats-username" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">GitHub Username</label>
              <Input
                id="stats-username"
                value={githubStats.username}
                onChange={(e) => setGithubStats({ username: e.target.value })}
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="stats-theme-select" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Card Theme</label>
              <select
                id="stats-theme-select"
                value={githubStats.theme}
                onChange={(e) => setGithubStats({ theme: e.target.value })}
                className="w-full px-4 py-2 text-sm rounded-md border border-gray-350 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
              >
                <option value="default">Default</option>
                <option value="radical">Radical</option>
                <option value="tokyonight">Tokyo Night</option>
                <option value="onedark">One Dark</option>
                <option value="dracula">Dracula</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={githubStats.showIcons}
                  onChange={(e) => setGithubStats({ showIcons: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <span>Show Icons</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={githubStats.hideBorder}
                  onChange={(e) => setGithubStats({ hideBorder: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <span>Hide Border</span>
              </label>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={githubStats.cardConfigs.stats.enabled}
                  onChange={(e) => setGithubStats({
                    cardConfigs: {
                      ...githubStats.cardConfigs,
                      stats: { ...githubStats.cardConfigs.stats, enabled: e.target.checked }
                    }
                  })}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                />
                <span>Stats Card</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={githubStats.cardConfigs.languages.enabled}
                  onChange={(e) => setGithubStats({
                    cardConfigs: {
                      ...githubStats.cardConfigs,
                      languages: { ...githubStats.cardConfigs.languages, enabled: e.target.checked }
                    }
                  })}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                />
                <span>Languages Card</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={githubStats.cardConfigs.streak.enabled}
                  onChange={(e) => setGithubStats({
                    cardConfigs: {
                      ...githubStats.cardConfigs,
                      streak: { ...githubStats.cardConfigs.streak, enabled: e.target.checked }
                    }
                  })}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                />
                <span>Streak Card</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubStatsPanel;
