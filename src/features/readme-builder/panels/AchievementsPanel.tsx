/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import React from 'react';
import Input from '@/components/Input';

import { AchievementsConfig } from '@/stores/readme-store';

export interface AchievementsPanelProps {
  sectionId: string;
  achievements: AchievementsConfig;
  setAchievements: (updates: Partial<AchievementsConfig>) => void;
  loading: boolean;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  sectionId,
  achievements,
  setAchievements,
  loading,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          🏆 GitHub Achievements Builder
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={achievements.enabled}
            onChange={(e) => setAchievements({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {achievements.enabled && (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-all duration-300">
          <div>
            <label htmlFor="achievements-username" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 font-medium">GitHub Username</label>
            <Input
              id="achievements-username"
              value={achievements.username}
              onChange={(e) => setAchievements({ username: e.target.value })}
              placeholder="Username"
            />
          </div>

          {/* Widgets Settings mapping */}
          <div className="space-y-3 pt-2">
            <span className="block text-2xs uppercase tracking-wider font-bold text-gray-450 font-medium text-left">Trophy & Counter Widgets</span>
            <div className="space-y-3">
              {achievements.order.map((widgetId, index) => {
                const widgetConfig = achievements.widgets[widgetId];
                if (!widgetConfig) return null;

                const widgetNames: Record<string, string> = {
                  trophy: 'GitHub Profile Trophies',
                  visitor: 'Komarev Profile Visitors',
                  graph: 'Activity Graph',
                  snake: 'Contribution Snake Game',
                };
                const widgetName = widgetNames[widgetId] || widgetId;

                const handleWidgetToggle = () => {
                  setAchievements({
                    widgets: {
                      ...achievements.widgets,
                      [widgetId]: {
                        ...widgetConfig,
                        enabled: !widgetConfig.enabled,
                      },
                    },
                  });
                };

                const updateWidgetProperty = (prop: string, val: any) => {
                  setAchievements({
                    widgets: {
                      ...achievements.widgets,
                      [widgetId]: {
                        ...widgetConfig,
                        [prop]: val,
                      },
                    },
                  });
                };

                const moveWidget = (dir: 'up' | 'down') => {
                  const idx = achievements.order.indexOf(widgetId);
                  if (dir === 'up' && idx === 0) return;
                  if (dir === 'down' && idx === achievements.order.length - 1) return;
                  const newOrder = [...achievements.order];
                  const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
                  const temp = newOrder[idx];
                  newOrder[idx] = newOrder[swapIdx];
                  newOrder[swapIdx] = temp;
                  setAchievements({ order: newOrder });
                };

                // Preview generation
                const userVal = achievements.username.trim() || 'username';
                let previewUrl = '';
                if (widgetId === 'trophy') {
                  previewUrl = `https://github-profile-trophy.vercel.app/?username=${userVal}&theme=${widgetConfig.theme || 'flat'}`;
                } else if (widgetId === 'visitor') {
                  previewUrl = `https://komarev.com/ghpvc/?username=${userVal}&color=${widgetConfig.color || '0078d7'}&style=${widgetConfig.style || 'flat'}`;
                } else if (widgetId === 'graph') {
                  previewUrl = `https://github-readme-activity-graph.vercel.app/graph?username=${userVal}&theme=${widgetConfig.theme || 'github'}&hide_border=${widgetConfig.hideBorder || false}`;
                }

                return (
                  <div
                    key={widgetId}
                    className={`p-4 rounded-md border transition duration-150 space-y-3 ${
                      widgetConfig.enabled
                        ? 'border-blue-200 dark:border-blue-900 bg-blue-50/10 dark:bg-blue-950/5'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={widgetConfig.enabled}
                          onChange={handleWidgetToggle}
                          className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                          aria-label={`Toggle ${widgetName}`}
                        />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{widgetName}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveWidget('up')}
                          disabled={index === 0}
                          className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          aria-label={`Move ${widgetName} up`}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveWidget('down')}
                          disabled={index === achievements.order.length - 1}
                          className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          aria-label={`Move ${widgetName} down`}
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    {widgetConfig.enabled && (
                      <div className="space-y-3 text-left">
                        {widgetId === 'trophy' && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Theme</label>
                              <select
                                value={widgetConfig.theme || 'flat'}
                                onChange={(e) => updateWidgetProperty('theme', e.target.value)}
                                className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                              >
                                <option value="flat">Flat</option>
                                <option value="juicyfresh">Juicy Fresh</option>
                                <option value="radical">Radical</option>
                                <option value="dracula">Dracula</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {widgetId === 'visitor' && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Style</label>
                              <select
                                value={widgetConfig.style || 'flat'}
                                onChange={(e) => updateWidgetProperty('style', e.target.value)}
                                className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                              >
                                <option value="flat">Flat</option>
                                <option value="flat-square">Flat Square</option>
                                <option value="plastic">Plastic</option>
                                <option value="for-the-badge">For the Badge</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Hex Color</label>
                              <input
                                type="text"
                                placeholder="0078d7"
                                value={widgetConfig.color || ''}
                                onChange={(e) => updateWidgetProperty('color', e.target.value)}
                                className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                              />
                            </div>
                          </div>
                        )}

                        {widgetId === 'graph' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Theme</label>
                              <select
                                value={widgetConfig.theme || 'github'}
                                onChange={(e) => updateWidgetProperty('theme', e.target.value)}
                                className="w-full text-xs p-1.5 rounded border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                              >
                                <option value="github">GitHub</option>
                                <option value="radical">Radical</option>
                                <option value="dracula">Dracula</option>
                                <option value="tokyonight">Tokyo Night</option>
                              </select>
                            </div>
                            <div className="flex items-center pt-4">
                              <label className="flex items-center gap-1 text-2xs text-gray-600 dark:text-gray-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!widgetConfig.hideBorder}
                                  onChange={(e) => updateWidgetProperty('hideBorder', e.target.checked)}
                                  className="rounded border-gray-300 dark:bg-gray-800"
                                />
                                <span>Hide Border</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {widgetId === 'snake' && (
                          <span className="block text-2xs text-gray-450 italic">
                            * Requires generating snake SVG via GitHub Action workflow. Future-ready configuration.
                          </span>
                        )}

                        {/* Preview container */}
                        {previewUrl && (
                          <div className="pt-2 flex justify-center bg-white dark:bg-black/30 p-3 rounded border border-gray-105 dark:border-gray-900 overflow-auto">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previewUrl}
                              alt={`${widgetName} Preview`}
                              className="max-h-[160px] object-contain"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPanel;
