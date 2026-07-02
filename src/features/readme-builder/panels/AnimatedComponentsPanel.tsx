import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/Input';
import { AnimatedComponentsConfig } from '@/stores/readme-store';

export interface AnimatedComponentsPanelProps {
  sectionId: string;
  animatedComponents: AnimatedComponentsConfig;
  setAnimatedComponents: (config: Partial<AnimatedComponentsConfig>) => void;
  updateAnimatedComponentItem: (id: string, updates: any) => void;
  animatedSearch: string;
  setAnimatedSearch: (query: string) => void;
  animatedCategory: 'all' | 'headers' | 'dividers' | 'widgets';
  setAnimatedCategory: (cat: 'all' | 'headers' | 'dividers' | 'widgets') => void;
  activeEditingCompId: string | null;
  setActiveEditingCompId: (id: string | null) => void;
}

export const AnimatedComponentsPanel: React.FC<AnimatedComponentsPanelProps> = ({
  sectionId,
  animatedComponents,
  setAnimatedComponents,
  updateAnimatedComponentItem,
  animatedSearch,
  setAnimatedSearch,
  animatedCategory,
  setAnimatedCategory,
  activeEditingCompId,
  setActiveEditingCompId,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          ✨ Animated Components Config
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={animatedComponents.enabled}
            onChange={(e) => setAnimatedComponents({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {animatedComponents.enabled && (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-55 dark:bg-gray-900/10 p-3 rounded-lg border border-gray-150 dark:border-gray-850">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search component gallery..."
                value={animatedSearch}
                onChange={(e) => setAnimatedSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-full text-xs rounded border border-gray-200 dark:bg-[#18181b] dark:border-gray-700 focus:border-blue-500 focus:outline-none font-medium"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: '🌟 All' },
                { id: 'headers', label: 'Headers' },
                { id: 'dividers', label: 'Dividers' },
                { id: 'widgets', label: 'Widgets' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setAnimatedCategory(cat.id as any)}
                  className={`px-2.5 py-1 text-2xs font-bold rounded-lg cursor-pointer transition flex-shrink-0 ${
                    animatedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-755 text-gray-550 dark:text-gray-400'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Components list */}
          <div className="space-y-4">
            {animatedComponents.components
              .filter((comp) => {
                if (animatedSearch) {
                  const matchTitle = comp.title.toLowerCase().includes(animatedSearch.toLowerCase());
                  const matchType = comp.type.toLowerCase().includes(animatedSearch.toLowerCase());
                  if (!matchTitle && !matchType) return false;
                }
                if (animatedCategory === 'headers') return comp.type === 'waveHeader';
                if (animatedCategory === 'dividers') return comp.type === 'divider';
                if (animatedCategory === 'widgets') return ['typing', 'snake', 'badge', 'footer', 'decorative'].includes(comp.type);
                return true;
              })
              .map((comp) => {
                const isEditing = activeEditingCompId === comp.id;
                
                return (
                  <div key={comp.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151518] space-y-3">
                    {/* Header details */}
                    <div className="flex items-center justify-between select-none">
                      <div className="space-y-0.5 text-left">
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{comp.title}</h4>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono tracking-wider">{comp.type}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setActiveEditingCompId(isEditing ? null : comp.id)}
                          className="px-2 py-1 text-2xs font-bold rounded border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-55 dark:hover:bg-gray-900 cursor-pointer transition"
                        >
                          {isEditing ? 'Hide Config' : '⚙️ Edit Config'}
                        </button>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={comp.enabled}
                            onChange={(e) => updateAnimatedComponentItem(comp.id, { enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Live visual animation preview */}
                    {comp.enabled && (
                      <div className="p-3.5 bg-gray-55 dark:bg-gray-955/40 border border-dashed border-gray-200 dark:border-gray-800/80 rounded-lg flex items-center justify-center min-h-16 overflow-hidden">
                        {comp.type === 'typing' && (
                          <img
                            src={`https://readme-typing-svg.demolab.com?font=Fira+Code&width=400&speed=${comp.config.speed || 10}&pause=${comp.config.delay || 1000}&color=${(comp.config.color || '36BCF7').replace('#','')}&lines=${(comp.config.lines || []).map((l: string) => encodeURIComponent(l)).join(';')}`}
                            alt="Typing preview"
                            className="max-w-full"
                          />
                        )}
                        {comp.type === 'waveHeader' && (
                          <img
                            src={`https://capsule-render.vercel.app/api?type=${comp.config.animation || 'wave'}&color=${comp.config.theme === 'auto' ? 'auto' : (comp.config.theme || 'auto').replace('#','')}&height=100&section=header&text=${encodeURIComponent(comp.config.text || 'Welcome')}&fontSize=24`}
                            alt="Header preview"
                            className="w-full max-w-sm rounded"
                          />
                        )}
                        {comp.type === 'divider' && (
                          <div className="w-full max-w-md">
                            {comp.config.style === 'waves' ? (
                              <svg width="100%" height="20" viewBox="0 0 1200 20" fill="none">
                                <path d="M0 10 Q 75 0, 150 10 T 300 10 T 450 10 T 600 10 T 750 10 T 900 10 T 1050 10 T 1200 10" stroke={comp.config.color1 || '#0078d7'} strokeWidth="3" fill="none" />
                              </svg>
                            ) : comp.config.style === 'dots' ? (
                              <svg width="120" height="20" viewBox="0 0 120 20" fill="none" className="mx-auto">
                                <circle cx="20" cy="10" r="4" fill={comp.config.color1 || '#0078d7'} />
                                <circle cx="40" cy="10" r="5" fill={comp.config.color2 || '#36BCF7'} />
                                <circle cx="60" cy="10" r="6" fill={comp.config.color1 || '#0078d7'} />
                              </svg>
                            ) : (
                              <div className="h-1 w-full rounded" style={{ background: `linear-gradient(90deg, ${comp.config.color1 || '#0078d7'}, ${comp.config.color2 || '#36BCF7'})` }} />
                            )}
                          </div>
                        )}
                        {comp.type === 'snake' && (
                          <div className="text-center space-y-1 p-2">
                            <span className="text-lg">🐍</span>
                            <span className="text-3xs block text-gray-400">Contribution Snake Grid Animation Placeholder</span>
                          </div>
                        )}
                        {comp.type === 'decorative' && (
                          <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                            <polygon points="10,1 4,19 19,7 1,7 16,19" fill={comp.config.color || '#eab308'} />
                            <polygon points="30,3 25,17 37,8 23,8 35,17" fill={comp.config.color || '#eab308'} opacity="0.6" />
                            <polygon points="50,1 44,19 59,7 41,7 56,19" fill={comp.config.color || '#eab308'} />
                          </svg>
                        )}
                        {comp.type === 'badge' && (
                          <img
                            src={`https://img.shields.io/badge/Status-${encodeURIComponent(comp.config.label || 'Open to Work')}-${(comp.config.color || '10b981').replace('#','') || 'emerald'}?style=for-the-badge`}
                            alt="Status badge preview"
                          />
                        )}
                        {comp.type === 'footer' && (
                          <img
                            src={`https://capsule-render.vercel.app/api?type=waving&color=${comp.config.theme === 'auto' ? 'auto' : (comp.config.theme || 'auto').replace('#','')}&height=80&section=footer&text=${encodeURIComponent(comp.config.text || 'Thanks')}&fontSize=18`}
                            alt="Footer preview"
                            className="w-full max-w-sm rounded"
                          />
                        )}
                      </div>
                    )}

                    {/* Collapsible Edit Configurations */}
                    {isEditing && (
                      <div className="p-4 rounded-lg bg-gray-55 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-800/60 space-y-4 text-left">
                        {comp.type === 'typing' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Typing Text Lines</label>
                              {(comp.config.lines || []).map((line: string, idx: number) => (
                                <div key={idx} className="flex gap-2 items-center">
                                  <Input
                                    value={line}
                                    onChange={(e) => {
                                      const updatedLines = [...(comp.config.lines || [])];
                                      updatedLines[idx] = e.target.value;
                                      updateAnimatedComponentItem(comp.id, { config: { lines: updatedLines } });
                                    }}
                                    placeholder={`Line ${idx + 1}`}
                                  />
                                  <button
                                    onClick={() => {
                                      const updatedLines = (comp.config.lines || []).filter((_: any, i: number) => i !== idx);
                                      updateAnimatedComponentItem(comp.id, { config: { lines: updatedLines } });
                                    }}
                                    className="p-1 text-red-550 hover:text-red-700 transition font-extrabold cursor-pointer"
                                    title="Delete line"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const updatedLines = [...(comp.config.lines || []), ''];
                                  updateAnimatedComponentItem(comp.id, { config: { lines: updatedLines } });
                                }}
                                className="mt-1 text-2xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                              >
                                + Add Line
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Animation Speed ({comp.config.speed || 10})</label>
                                <input
                                  type="range"
                                  min="1"
                                  max="20"
                                  value={comp.config.speed || 10}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { speed: parseInt(e.target.value, 10) } })}
                                  className="w-full accent-blue-600"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Pause Delay ({comp.config.delay || 1000}ms)</label>
                                <input
                                  type="range"
                                  min="200"
                                  max="4000"
                                  step="100"
                                  value={comp.config.delay || 1000}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { delay: parseInt(e.target.value, 10) } })}
                                  className="w-full accent-blue-600"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Text Color (Hex)</label>
                                <Input
                                  value={comp.config.color || '36BCF7'}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { color: e.target.value } })}
                                  placeholder="36BCF7"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Cursor Style</label>
                                <select
                                  value={comp.config.cursor || 'pipe'}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { cursor: e.target.value } })}
                                  className="w-full px-2 py-1.5 text-xs rounded border border-gray-200 dark:bg-gray-850 dark:border-gray-700 focus:outline-none cursor-pointer"
                                >
                                  <option value="pipe">Pipe Cursor</option>
                                  <option value="multi">Multiline Vertical</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {comp.type === 'waveHeader' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Welcome Title Text</label>
                              <Input
                                value={comp.config.text || ''}
                                onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { text: e.target.value } })}
                                placeholder="Welcome to my profile!"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-2 space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Theme Color</label>
                                <Input
                                  value={comp.config.theme || 'auto'}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { theme: e.target.value } })}
                                  placeholder="auto or Hex (#ff0000)"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Height ({comp.config.height || 120})</label>
                                <input
                                  type="range"
                                  min="60"
                                  max="240"
                                  value={comp.config.height || 120}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { height: parseInt(e.target.value, 10) } })}
                                  className="w-full accent-blue-600"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Animation Style</label>
                              <select
                                value={comp.config.animation || 'wave'}
                                onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { animation: e.target.value } })}
                                className="w-full px-2 py-1.5 text-xs rounded border border-gray-200 dark:bg-gray-850 dark:border-gray-700 focus:outline-none cursor-pointer"
                              >
                                <option value="wave">Wave</option>
                                <option value="waving">Waving</option>
                                <option value="slice">Slice</option>
                                <option value="rect">Rect</option>
                                <option value="transparent">Transparent</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {comp.type === 'divider' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Divider Style</label>
                              <select
                                value={comp.config.style || 'gradient-line'}
                                onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { style: e.target.value } })}
                                className="w-full px-2 py-1.5 text-xs rounded border border-gray-200 dark:bg-gray-855 dark:border-gray-700 focus:outline-none cursor-pointer"
                              >
                                <option value="gradient-line">Gradient Separator</option>
                                <option value="waves">Waves Shape</option>
                                <option value="dots">Pulsing Dots</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Start Color (Hex)</label>
                                <Input
                                  value={comp.config.color1 || '#0078d7'}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { color1: e.target.value } })}
                                  placeholder="#0078d7"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">End Color (Hex)</label>
                                <Input
                                  value={comp.config.color2 || '#36BCF7'}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { color2: e.target.value } })}
                                  placeholder="#36BCF7"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {comp.type === 'snake' && (
                          <div className="space-y-3 text-[11px] leading-relaxed">
                            <p className="text-gray-400">To enable the active Contribution Snake SVG on GitHub, copy and place this workflow YAML file inside your repository at `.github/workflows/snake.yml`:</p>
                            <pre className="p-3 bg-gray-950 text-gray-300 font-mono text-[9px] rounded-lg overflow-x-auto select-all leading-tight border border-gray-800">
{`name: Generate Snake

on:
  schedule:
    - cron: "0 */12 * * *"
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: Platane/snk@v3
        with:
          github_user_name: \${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg
      - uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`}
                            </pre>
                          </div>
                        )}

                        {comp.type === 'decorative' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Element Theme Color</label>
                              <Input
                                value={comp.config.color || '#eab308'}
                                onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { color: e.target.value } })}
                                placeholder="#eab308"
                              />
                            </div>
                          </div>
                        )}

                        {comp.type === 'badge' && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Badge Label</label>
                                <Input
                                  value={comp.config.label || 'Open to Work'}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { label: e.target.value } })}
                                  placeholder="Open to Work"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Theme Color</label>
                                <Input
                                  value={comp.config.color || '#10b981'}
                                  onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { color: e.target.value } })}
                                  placeholder="#10b981"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {comp.type === 'footer' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Footer Message</label>
                              <Input
                                value={comp.config.text || ''}
                                onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { text: e.target.value } })}
                                placeholder="Thanks for stopping by! ❤️"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-2xs font-bold text-gray-500 uppercase tracking-wide">Theme Color</label>
                              <Input
                                value={comp.config.theme || 'auto'}
                                onChange={(e) => updateAnimatedComponentItem(comp.id, { config: { theme: e.target.value } })}
                                placeholder="auto or Hex (#ff0000)"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedComponentsPanel;
