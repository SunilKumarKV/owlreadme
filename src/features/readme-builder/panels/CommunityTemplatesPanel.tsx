/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import React from 'react';
import { Search, Upload, FileDown, Share2, Trash2 } from 'lucide-react';
import { CommunityTemplate } from '@/stores/template-store';

export interface CommunityTemplatesPanelProps {
  communityTemplates: CommunityTemplate[];
  communitySearch: string;
  setCommunitySearch: (val: string) => void;
  selectedCommunityCategory: string;
  setSelectedCommunityCategory: (val: string) => void;
  activeCollection: 'all' | 'trending' | 'picks' | 'favorites' | 'recents';
  setActiveCollection: (val: 'all' | 'trending' | 'picks' | 'favorites' | 'recents') => void;
  templateFavorites: string[];
  toggleCommunityFavorite: (id: string) => void;
  templateRecentlyUsed: string[];
  setIsPublishModalOpen: (val: boolean) => void;
  handleImportTemplateFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteTemplate: (id: string) => void;
  toggleLike: (id: string) => void;
  applyCommunityTemplate: (tpl: CommunityTemplate) => void;
  setPreviewingCommunityTemplate: (tpl: CommunityTemplate | null) => void;
  handleExportTemplate: (tpl: CommunityTemplate) => void;
}

export const CommunityTemplatesPanel: React.FC<CommunityTemplatesPanelProps> = ({
  communityTemplates,
  communitySearch,
  setCommunitySearch,
  selectedCommunityCategory,
  setSelectedCommunityCategory,
  activeCollection,
  setActiveCollection,
  templateFavorites,
  toggleCommunityFavorite,
  templateRecentlyUsed,
  setIsPublishModalOpen,
  handleImportTemplateFile,
  deleteTemplate,
  toggleLike,
  applyCommunityTemplate,
  setPreviewingCommunityTemplate,
  handleExportTemplate,
}) => {
  // 1. Filter templates by search and category
  let filtered = communityTemplates.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(communitySearch.toLowerCase()) ||
      tpl.description.toLowerCase().includes(communitySearch.toLowerCase()) ||
      tpl.author.toLowerCase().includes(communitySearch.toLowerCase()) ||
      tpl.tags.some(tag => tag.toLowerCase().includes(communitySearch.toLowerCase()));
    
    const matchesCategory =
      selectedCommunityCategory === 'all' || tpl.category === selectedCommunityCategory;

    // Filter by Collection tabs
    if (activeCollection === 'favorites') {
      return matchesSearch && matchesCategory && templateFavorites.includes(tpl.id);
    }
    if (activeCollection === 'recents') {
      return matchesSearch && matchesCategory && templateRecentlyUsed.includes(tpl.id);
    }
    if (activeCollection === 'picks') {
      return matchesSearch && matchesCategory && !tpl.isCustom;
    }
    return matchesSearch && matchesCategory;
  });

  // 2. Sort templates
  if (activeCollection === 'trending') {
    filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  } else {
    // Default: sort by newest or custom created timestamp
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <div className="space-y-4 text-xs text-left">
      {/* Search, Import/Export, and Publish Active controls */}
      <div className="space-y-3 select-none">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search community templates or tags..."
              value={communitySearch}
              onChange={(e) => setCommunitySearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 w-full text-xs text-black dark:text-white rounded border border-gray-200 dark:bg-[#18181b] dark:border-gray-700 focus:border-blue-500 focus:outline-none transition"
            />
          </div>
          
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold cursor-pointer transition flex items-center gap-1 flex-shrink-0"
            title="Publish current profile configuration as a template"
          >
            <Upload className="h-3 w-3" /> Publish Active
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between border-t border-b border-gray-150 dark:border-gray-800/80 py-2">
          {/* Collection tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-thin w-full sm:w-auto">
            {[
              { id: 'all', label: '🌍 All' },
              { id: 'trending', label: '🔥 Trending' },
              { id: 'picks', label: 'Staff Picks' },
              { id: 'favorites', label: '💖 Favorites' },
              { id: 'recents', label: '🕒 Recent' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCollection(tab.id as any)}
                className={`px-2 py-0.5 text-3xs font-extrabold rounded uppercase tracking-wider cursor-pointer transition flex-shrink-0 ${
                  activeCollection === tab.id
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-450 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Import Trigger */}
          <label className="px-2.5 py-1 text-3xs font-bold rounded border border-gray-200 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 transition cursor-pointer flex items-center gap-1 flex-shrink-0 w-full sm:w-auto justify-center">
            <FileDown className="h-3 w-3" /> Import Template JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportTemplateFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Categories Grid */}
        <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-none">
          {['all', 'minimal', 'modern', 'frontend', 'full-stack', 'open-source', 'ai', 'anime', 'gprm'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCommunityCategory(cat)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full cursor-pointer transition flex-shrink-0 ${
                selectedCommunityCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-500 dark:text-gray-400'
              }`}
            >
              {cat === 'all' ? '🌟 All' : cat.toUpperCase().replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            No community templates match your criteria.
          </div>
        ) : (
          filtered.map((tpl) => {
            const isFav = templateFavorites.includes(tpl.id);
            const isLiked = tpl.isLiked;

            return (
              <div
                key={tpl.id}
                className="group p-4 bg-gray-50/40 dark:bg-[#151518] hover:bg-gray-50/70 dark:hover:bg-[#1c1c20] border border-gray-250 dark:border-gray-800 rounded-xl transition duration-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-105 dark:border-blue-900/10">
                      {tpl.category}
                    </span>
                    {tpl.isCustom && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-505 border border-amber-500/20">
                        Custom
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCommunityFavorite(tpl.id)}
                      className={`text-xs transition cursor-pointer hover:scale-110 ${isFav ? 'text-red-550' : 'text-gray-405'}`}
                      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      {isFav ? '❤️' : '🖤'}
                    </button>

                    {tpl.isCustom && (
                      <button
                        onClick={() => {
                          if (confirm('Delete this custom template?')) {
                            deleteTemplate(tpl.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-550 transition cursor-pointer"
                        title="Delete Template"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-2 text-left">
                  <h4 className="text-xs font-bold text-gray-850 dark:text-gray-200 mb-0.5">{tpl.name}</h4>
                  <p className="text-[10px] text-gray-450 dark:text-gray-500 leading-relaxed mb-2">{tpl.description}</p>
                  
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                    <span>By:</span>
                    <span className="font-semibold text-blue-500">@{tpl.author}</span>
                  </div>
                </div>

                {/* Tags */}
                {tpl.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tpl.tags.map((tag) => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.2 bg-gray-100 dark:bg-gray-800 text-gray-450 dark:text-gray-400 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metrics bar */}
                <div className="flex items-center justify-between py-2 border-t border-gray-150/40 dark:border-gray-850/60 mt-auto select-none">
                  <div className="flex items-center gap-3 text-[10px] text-gray-405">
                    <button
                      onClick={() => toggleLike(tpl.id)}
                      className={`flex items-center gap-1 cursor-pointer transition ${isLiked ? 'text-red-500 font-bold' : 'hover:text-red-500'}`}
                    >
                      👍 {tpl.likes}
                    </button>
                    <span>📥 {tpl.downloads} downloads</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => applyCommunityTemplate(tpl)}
                      className="px-2.5 py-1 text-2xs font-extrabold rounded bg-blue-600 hover:bg-blue-700 text-white transition text-center cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setPreviewingCommunityTemplate(tpl)}
                      className="px-2.5 py-1 text-2xs font-bold rounded bg-gray-150 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition text-center cursor-pointer"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleExportTemplate(tpl)}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-550 dark:text-gray-400 transition cursor-pointer"
                      title="Export Template to JSON"
                    >
                      <Share2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunityTemplatesPanel;
