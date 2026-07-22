'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  Heart,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useTemplateStore, CommunityTemplate } from '@/stores/template-store';
import useReadmeStore from '@/stores/readme-store';
import { useWorkspaceStore } from '@/stores/workspace-store';
import { CATEGORIES_LIST } from '@/utils/template-registry';
import TemplatePreviewModal from './components/TemplatePreviewModal';

export const CommunityPage: React.FC = () => {
  const router = useRouter();
  const {
    templates,
    favorites,
    toggleLike,
    toggleFavorite,
    incrementDownloads,
    addRecentlyUsed,
  } = useTemplateStore();

  const applyTemplate = useReadmeStore((state) => state.applyTemplate);
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const setActiveWorkspaceId = useWorkspaceStore((state) => state.setActiveWorkspaceId);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTech, setSelectedTech] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'newest'>('trending');
  const [previewTemplate, setPreviewTemplate] = useState<CommunityTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUseTemplate = (template: CommunityTemplate) => {
    addRecentlyUsed(template.id);
    incrementDownloads(template.id);

    const wsName = `${template.name} Workspace`;
    const newWsId = createWorkspace(wsName, 'readme');
    setActiveWorkspaceId(newWsId);
    applyTemplate(template);

    showToast(`Applied "${template.name}" successfully!`);
    router.push('/readme-builder');
  };

  // Extract all technologies from templates to offer a filter dropdown
  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((tpl) => {
      if (Array.isArray(tpl.technologies)) {
        tpl.technologies.forEach((tech) => set.add(tech.toLowerCase()));
      }
    });
    return Array.from(set);
  }, [templates]);

  // Live filter / search logic
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((tpl) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = tpl.name.toLowerCase().includes(q);
          const matchesDesc = (tpl.description || '').toLowerCase().includes(q);
          const matchesAuthor = (tpl.author || '').toLowerCase().includes(q);
          const matchesCategory = (tpl.category || '').toLowerCase().includes(q);
          const matchesTags = (tpl.tags || []).some((t) => t.toLowerCase().includes(q));
          const matchesTech = (tpl.technologies || []).some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesAuthor && !matchesCategory && !matchesTags && !matchesTech) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && tpl.category !== selectedCategory) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'All' && tpl.difficulty !== selectedDifficulty) {
          return false;
        }

        // Tech filter
        if (selectedTech !== 'All' && !(tpl.technologies || []).map(t => t.toLowerCase()).includes(selectedTech.toLowerCase())) {
          return false;
        }

        // Only show public templates in community feed
        return tpl.visibility === 'public';
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.likes - a.likes;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default trending (likes + downloads weight)
        return b.likes + b.downloads - (a.likes + a.downloads);
      });
  }, [templates, searchQuery, selectedCategory, selectedDifficulty, selectedTech, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedTech('All');
    setSortBy('trending');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
          >
            ← Dashboard
          </button>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-2 select-none">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">🌐</span>
              <span>Community Templates</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/my-templates')}
            className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            My Templates
          </button>
        </div>
      </header>

      {/* Hero & Search Banner */}
      <section className="bg-gradient-to-b from-blue-50/60 via-purple-50/20 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent pt-10 pb-8 px-6 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Community Sharing Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white max-w-3xl mx-auto leading-tight">
            Discover & Share Beautiful <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">README Templates</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse and use custom templates published by developers globally, or publish your own to help the community.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by technology, name, tag, author, or category..."
                className="w-full pl-12 pr-4 py-3.5 text-sm bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-2xl shadow-lg focus:outline-none transition text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid & Filters */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 space-y-6 w-full">
        {/* Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-gray-200 dark:border-gray-800 select-none text-xs font-medium text-gray-500">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'trending' | 'popular' | 'newest')}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer focus:outline-none"
              >
                <option value="trending">🔥 Trending</option>
                <option value="popular">⭐ Popular</option>
                <option value="newest">✨ Newest First</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Tech filter */}
            {allTechnologies.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Technology:</span>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer focus:outline-none capitalize"
                >
                  <option value="All">All Technologies</option>
                  {allTechnologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedTech !== 'All' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-2xs font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 animate-spin-hover" /> Clear Filters
            </button>
          )}
        </div>

        {/* Templates Feed */}
        {filteredTemplates.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-4">
            <span className="text-4xl block">🔭</span>
            <h3 className="font-extrabold text-sm text-gray-700 dark:text-gray-300">No Templates Match Filters</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Try adjusting your technology filter, category pills, or search query.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const isFav = favorites.includes(template.id);
              const isLiked = Boolean(template.isLiked);

              return (
                <div
                  key={template.id}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
                >
                  {/* Card Visual Banner Header */}
                  <div className="relative h-36 bg-gradient-to-br from-gray-900 to-gray-950 p-4 flex flex-col justify-between overflow-hidden border-b border-gray-200 dark:border-gray-800">
                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {template.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(template.id);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                          isFav
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                            : 'bg-gray-800/60 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="relative z-10 text-center space-y-0.5 my-auto">
                      <span className="text-xs font-mono font-bold text-blue-400 block truncate">
                        {template.name}
                      </span>
                      <span className="text-[9px] text-gray-300 font-mono block truncate opacity-70">
                        {template.description}
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-gray-400">
                      <span className="px-2 py-0.5 rounded bg-gray-800/80 uppercase tracking-wider text-[9px]">
                        {template.difficulty}
                      </span>
                      <span className="text-gray-400">@{template.author}</span>
                    </div>
                  </div>

                  {/* Card Info Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-blue-500 transition truncate">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>

                      {/* Tags */}
                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stats & Actions */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 select-none">
                        <button
                          onClick={() => toggleLike(template.id)}
                          className="flex items-center gap-1 hover:text-red-500 transition cursor-pointer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                          <span>{template.likes}</span>
                        </button>
                        <div className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" />
                          <span>{template.downloads}</span>
                        </div>
                        <span>Updated {new Date(template.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Use Template →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={handleUseTemplate}
        onFavorite={toggleFavorite}
        isFavorited={previewTemplate ? favorites.includes(previewTemplate.id) : false}
      />
    </div>
  );
};

export default CommunityPage;
