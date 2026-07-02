import React from 'react';
import { Search } from 'lucide-react';
import { TEMPLATE_MARKETPLACE, MarketplaceTemplate } from '@/utils/template-registry';

export interface TemplateMarketplacePanelProps {
  marketplaceSearch: string;
  setMarketplaceSearch: (val: string) => void;
  selectedMarketplaceCategory: string;
  setSelectedMarketplaceCategory: (val: string) => void;
  handleImportConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportConfig: () => void;
  favoriteTemplates: string[];
  toggleFavorite: (id: string) => void;
  recentlyUsedTemplates: string[];
  applyMarketplaceTemplate: (tpl: MarketplaceTemplate) => void;
  setPreviewingTemplate: (tpl: MarketplaceTemplate | null) => void;
  duplicateTemplateToWorkspace: (tpl: MarketplaceTemplate) => void;
}

export const TemplateMarketplacePanel: React.FC<TemplateMarketplacePanelProps> = ({
  marketplaceSearch,
  setMarketplaceSearch,
  selectedMarketplaceCategory,
  setSelectedMarketplaceCategory,
  handleImportConfig,
  handleExportConfig,
  favoriteTemplates,
  toggleFavorite,
  recentlyUsedTemplates,
  applyMarketplaceTemplate,
  setPreviewingTemplate,
  duplicateTemplateToWorkspace,
}) => {
  return (
    <div className="space-y-4 text-left">
      
      {/* Search & Category Filter */}
      <div className="space-y-2 select-none">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={marketplaceSearch}
            onChange={(e) => setMarketplaceSearch(e.target.value)}
            className="pl-8 pr-4 py-1.5 w-full text-xs text-black dark:text-white rounded border border-gray-205 dark:bg-[#1e1e1e] dark:border-gray-700 focus:border-blue-500 focus:outline-none transition"
          />
        </div>
        
        {/* Categories scroll row */}
        <div className="flex gap-1 overflow-x-auto pb-1.5 custom-editor-scrollbar">
          {['all', 'minimal', 'modern', 'open-source', 'full-stack', 'frontend', 'ai', 'terminal', 'gprm', 'anime'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedMarketplaceCategory(cat)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full cursor-pointer transition flex-shrink-0 ${
                selectedMarketplaceCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-205 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {cat === 'all' ? '🌟 All' : cat.toUpperCase().replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Config Save / Load */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/20 text-2xs select-none">
        <span className="font-semibold text-gray-500 dark:text-gray-405">Layout Settings:</span>
        <div className="flex items-center gap-2">
          <label className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold cursor-pointer transition">
            📥 Import JSON
            <input type="file" accept=".json" onChange={handleImportConfig} className="hidden" />
          </label>
          <button
            onClick={handleExportConfig}
            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-655 dark:text-gray-305 font-bold transition cursor-pointer"
          >
            📤 Export JSON
          </button>
        </div>
      </div>

      {/* Template Gallery Cards */}
      <div className="grid grid-cols-1 gap-4">
        {TEMPLATE_MARKETPLACE.filter((tpl) => {
          const matchesCat = selectedMarketplaceCategory === 'all' || tpl.category === selectedMarketplaceCategory;
          const matchesQuery = tpl.name.toLowerCase().includes(marketplaceSearch.toLowerCase()) ||
                               tpl.description.toLowerCase().includes(marketplaceSearch.toLowerCase());
          return matchesCat && matchesQuery;
        }).map((tpl) => {
          const isFav = favoriteTemplates.includes(tpl.id);
          const isRecent = recentlyUsedTemplates.includes(tpl.id);

          return (
            <div
              key={tpl.id}
              className="group p-4 bg-gray-50/40 dark:bg-[#151518] hover:bg-gray-55/70 dark:hover:bg-[#1c1c20] border border-gray-255 dark:border-gray-800 rounded-xl transition duration-200 flex flex-col justify-between"
            >
              {/* Layout Mockup representation using dynamic SVG or CSS shapes */}
              <div className="w-full h-24 bg-white dark:bg-[#0c0c0e] rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden mb-3 select-none">
                {tpl.id === 'tpl-minimal' && (
                  <div className="w-full px-4 text-left space-y-1.5 opacity-60">
                    <div className="w-12 h-2.5 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="w-16 h-1 bg-gray-150 dark:bg-gray-900 rounded" />
                  </div>
                )}
                {tpl.id === 'tpl-modern' && (
                  <div className="w-full flex flex-col items-center space-y-1.5 opacity-60">
                    <div className="w-24 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
                    <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="flex gap-1">
                      <div className="w-5 h-2 bg-purple-500/35 rounded-full" />
                      <div className="w-5 h-2 bg-blue-500/35 rounded-full" />
                    </div>
                  </div>
                )}
                {tpl.id === 'tpl-open-source' && (
                  <div className="w-full flex flex-col items-center space-y-2 opacity-60 px-4">
                    <div className="flex gap-1.5 w-full justify-center">
                      <div className="w-8 h-2 bg-blue-400 dark:bg-blue-600 rounded" />
                      <div className="w-8 h-2 bg-green-400 dark:bg-green-600 rounded" />
                    </div>
                    <div className="w-full h-8 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-850 flex gap-0.5 p-1 items-end">
                      {[2,4,6,3,5,2,7,4,3,6,8,5,2,4,7,3].map((h, i) => (
                        <div key={i} style={{ height: `${h * 10}%` }} className="flex-1 bg-green-505 dark:bg-green-600 rounded-sm" />
                      ))}
                    </div>
                  </div>
                )}
                {tpl.id === 'tpl-fullstack' && (
                  <div className="w-full px-4 text-left space-y-2 opacity-60">
                    <div className="w-16 h-2 bg-green-500 dark:bg-green-600 rounded" />
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-6 bg-gray-100 dark:bg-gray-855 rounded border border-gray-200 dark:border-gray-800" />
                      <div className="h-6 bg-gray-100 dark:bg-gray-855 rounded border border-gray-200 dark:border-gray-800" />
                    </div>
                  </div>
                )}
                {tpl.id === 'tpl-frontend' && (
                  <div className="w-full flex flex-col items-center space-y-1.5 opacity-60">
                    <div className="w-10 h-10 rounded-full border border-pink-505 flex items-center justify-center text-xs">🎨</div>
                    <div className="w-20 h-1.5 bg-gray-300 dark:bg-gray-700 rounded" />
                  </div>
                )}
                {tpl.id === 'tpl-ai' && (
                  <div className="w-full px-4 text-left space-y-1 opacity-60 font-mono text-[8px] text-blue-500">
                    <div>import torch.nn as nn</div>
                    <div>model = TransformerModel()</div>
                    <div className="w-20 h-2 bg-blue-500/20 rounded mt-1" />
                  </div>
                )}
                {tpl.id === 'tpl-terminal' && (
                  <div className="w-full h-full bg-black p-3 font-mono text-[9px] text-[#39ff14] text-left space-y-1.5 opacity-80 font-semibold">
                    <div>$ systemctl start developer</div>
                    <div className="animate-pulse">_</div>
                  </div>
                )}
                {tpl.id === 'tpl-gprm' && (
                  <div className="w-full flex flex-col items-center space-y-1.5 opacity-60">
                    <div className="w-24 h-2 bg-blue-600 dark:bg-blue-800 rounded" />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-155 dark:bg-gray-855 rounded border border-gray-200 dark:border-gray-805" />
                      <div className="w-8 h-8 bg-gray-155 dark:bg-gray-855 rounded border border-gray-200 dark:border-gray-805" />
                    </div>
                  </div>
                )}
                {tpl.id === 'tpl-anime' && (
                  <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-purple-500/15 flex flex-col items-center justify-center space-y-1.5 opacity-80">
                    <div className="text-sm">🌸✨</div>
                    <div className="w-20 h-2 bg-pink-400 dark:bg-pink-600 rounded" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {tpl.category}
                </span>
                <div className="flex items-center gap-1.5">
                  {isRecent && (
                    <span className="text-[8px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                      Recent
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(tpl.id)}
                    className="text-xs transition cursor-pointer"
                    title="Add to Favorites"
                  >
                    {isFav ? '❤️' : '🖤'}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-0.5">{tpl.name}</h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-550 leading-relaxed">{tpl.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 select-none pt-2 border-t border-gray-100 dark:border-gray-850/60 mt-auto">
                <button
                  onClick={() => applyMarketplaceTemplate(tpl)}
                  className="px-2 py-1 text-2xs font-extrabold rounded bg-blue-600 hover:bg-blue-700 text-white transition text-center cursor-pointer"
                >
                  Apply
                </button>
                <button
                  onClick={() => setPreviewingTemplate(tpl)}
                  className="px-2 py-1 text-2xs font-bold rounded bg-gray-155 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition text-center cursor-pointer"
                >
                  Preview
                </button>
                <button
                  onClick={() => duplicateTemplateToWorkspace(tpl)}
                  className="px-2 py-1 text-2xs font-bold rounded bg-gray-105 hover:bg-gray-250 dark:bg-[#1a1a20] dark:hover:bg-[#25252c] text-gray-500 dark:text-gray-455 hover:text-gray-650 transition text-center cursor-pointer"
                  title="Duplicate template settings to a new workspace"
                >
                  Dup
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateMarketplacePanel;
