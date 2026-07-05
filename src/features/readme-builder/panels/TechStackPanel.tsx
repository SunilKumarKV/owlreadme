/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import React from 'react';
import Input from '@/components/Input';
import { TECHNOLOGY_REGISTRY, CATEGORIES } from '@/utils/tech-registry';
import type { TechCategory } from '../types/builder-types';

export interface TechStackPanelProps {
  sectionId: string;
  techStack: {
    enabled: boolean;
    style: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge';
    iconOnly: boolean;
    groupByCategory: boolean;
    selectedIds: string[];
  };
  setTechStack: (updates: Partial<TechStackPanelProps['techStack']>) => void;
  techSearch: string;
  setTechSearch: (val: string) => void;
  activeTechCategory: TechCategory;
  setActiveTechCategory: (val: TechCategory) => void;
}

export const TechStackPanel: React.FC<TechStackPanelProps> = ({
  sectionId,
  techStack,
  setTechStack,
  techSearch,
  setTechSearch,
  activeTechCategory,
  setActiveTechCategory,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          🛠️ Tech Stack Builder
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={techStack.enabled}
            onChange={(e) => setTechStack({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {techStack.enabled && (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-all duration-300">
          {/* Badges styling modifiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="tech-style-select" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Badge Style</label>
              <select
                id="tech-style-select"
                value={techStack.style}
                onChange={(e) => setTechStack({ style: e.target.value as any })}
                className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
              >
                <option value="flat">Flat</option>
                <option value="flat-square">Flat Square</option>
                <option value="plastic">Plastic</option>
                <option value="for-the-badge">For the Badge</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-303 cursor-pointer">
                <input
                  type="checkbox"
                  checked={techStack.iconOnly}
                  onChange={(e) => setTechStack({ iconOnly: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <span>Icon Only Mode</span>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-303 cursor-pointer">
                <input
                  type="checkbox"
                  checked={techStack.groupByCategory}
                  onChange={(e) => setTechStack({ groupByCategory: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <span>Group by Category</span>
              </label>
            </div>
          </div>

          {/* Search / Categories Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="w-full sm:w-64">
              <Input
                id="tech-search-input"
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                placeholder="Search technologies..."
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {['All', ...CATEGORIES].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveTechCategory(category as TechCategory)}
                  className={`px-2.5 py-1 text-2xs font-semibold rounded cursor-pointer transition ${
                    activeTechCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-150 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result Grid */}
          <div>
            <span className="block text-2xs uppercase tracking-wider font-bold text-gray-400 mb-2">Available Badges</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-2 bg-gray-50 dark:bg-black/20 rounded border border-gray-100 dark:border-gray-900">
              {TECHNOLOGY_REGISTRY.filter((tech) => {
                const matchesSearch = tech.name.toLowerCase().includes(techSearch.toLowerCase());
                const matchesCategory = activeTechCategory === 'All' || tech.category === activeTechCategory;
                return matchesSearch && matchesCategory;
              }).map((tech) => {
                const isSelected = techStack.selectedIds.includes(tech.id);
                const handleSelect = () => {
                  if (isSelected) {
                    setTechStack({
                      selectedIds: techStack.selectedIds.filter((id) => id !== tech.id),
                    });
                  } else {
                    setTechStack({
                      selectedIds: [...techStack.selectedIds, tech.id],
                    });
                  }
                };

                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={handleSelect}
                    className={`flex items-center gap-2 p-2 rounded text-left border text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900 text-blue-700 dark:text-blue-400'
                        : 'bg-white border-gray-250 hover:bg-gray-50 dark:bg-[#1a1a1e] dark:border-gray-800 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{tech.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ordered Selection Panel */}
          {techStack.selectedIds.length > 0 && (
            <div>
              <span className="block text-2xs uppercase tracking-wider font-bold text-gray-400 mb-2">Selected Badges Ordering</span>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {techStack.selectedIds.map((techId, index) => {
                  const tech = TECHNOLOGY_REGISTRY.find((t) => t.id === techId);
                  if (!tech) return null;
                  const label = techStack.iconOnly ? '' : encodeURIComponent(tech.name);
                  const badgeUrl = `https://img.shields.io/badge/${label}-${tech.color}?style=${techStack.style}&logo=${tech.logo}&logoColor=${tech.logoColor}`;

                  const moveTech = (dir: 'up' | 'down') => {
                    const idx = techStack.selectedIds.indexOf(techId);
                    if (dir === 'up' && idx === 0) return;
                    if (dir === 'down' && idx === techStack.selectedIds.length - 1) return;
                    const newOrder = [...techStack.selectedIds];
                    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
                    const temp = newOrder[idx];
                    newOrder[idx] = newOrder[swapIdx];
                    newOrder[swapIdx] = temp;
                    setTechStack({ selectedIds: newOrder });
                  };

                  return (
                    <div
                      key={techId}
                      className="flex items-center justify-between p-3 rounded-md bg-gray-55/70 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-gray-400 w-4"># {index + 1}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={badgeUrl}
                          alt={tech.name}
                          className="max-h-[28px] object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveTech('up')}
                          disabled={index === 0}
                          className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          aria-label={`Move ${tech.name} up`}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveTech('down')}
                          disabled={index === techStack.selectedIds.length - 1}
                          className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          aria-label={`Move ${tech.name} down`}
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTechStack({
                              selectedIds: techStack.selectedIds.filter((id) => id !== techId),
                            });
                          }}
                          className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer ml-1"
                          aria-label={`Remove ${tech.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TechStackPanel;
