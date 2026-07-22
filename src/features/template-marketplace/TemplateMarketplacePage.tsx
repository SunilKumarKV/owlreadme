'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Search,
  Sparkles,
  Heart,
  Download,
  Eye,
  Check,
  Copy,
  Clock,
  Code,
  X,
  Laptop,
  Tablet,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import useReadmeStore from '@/stores/readme-store';
import { useWorkspaceStore } from '@/stores/workspace-store';
import {
  MarketplaceTemplate,
  TEMPLATE_MARKETPLACE,
  CATEGORIES_LIST,
} from '@/utils/template-registry';
import { useTemplateMarketplaceStore } from '@/stores/template-marketplace-store';
import { generateREADME } from '@/utils/markdown';
import Button from '@/components/Button';

const MDEditorMarkdown = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
) as React.ComponentType<{ source: string }>;

export const TemplateMarketplacePage: React.FC = () => {
  const router = useRouter();
  const applyTemplate = useReadmeStore((state) => state.applyTemplate);
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const setActiveWorkspaceId = useWorkspaceStore((state) => state.setActiveWorkspaceId);

  const {
    favorites,
    recentlyUsed,
    userLikes,
    userDownloads,
    toggleFavorite,
    addRecentlyUsed,
    toggleLike,
    incrementDownload,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTheme,
    setSelectedTheme,
    sortBy,
    setSortBy,
    resetFilters,
  } = useTemplateMarketplaceStore();

  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'trending' | 'newest' | 'favorites'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplate | null>(null);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile' | 'markdown'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUseTemplate = (template: MarketplaceTemplate) => {
    // 1. Add to recently used
    addRecentlyUsed(template.id);
    incrementDownload(template.id);

    // 2. Create clean workspace or apply template directly
    const wsName = `${template.name} Workspace`;
    const newWsId = createWorkspace(wsName, 'readme');
    setActiveWorkspaceId(newWsId);
    applyTemplate(template);

    showToast(`Applied "${template.name}" template successfully!`);
    router.push('/readme-builder');
  };

  const filteredTemplates = useMemo(() => {
    return TEMPLATE_MARKETPLACE.filter((tpl) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(q);
        const matchesDesc = tpl.description.toLowerCase().includes(q);
        const matchesCat = tpl.category.toLowerCase().includes(q);
        const matchesAuthor = tpl.author.toLowerCase().includes(q);
        const matchesTags = tpl.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesAuthor && !matchesTags) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && tpl.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // 3. Difficulty Filter
      if (selectedDifficulty !== 'All' && tpl.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // 4. Theme Filter
      if (selectedTheme !== 'All' && tpl.theme.toLowerCase() !== selectedTheme.toLowerCase()) {
        return false;
      }

      // 5. Active Tab filter
      if (activeTab === 'featured' && !tpl.featured) return false;
      if (activeTab === 'trending' && !tpl.trending) return false;
      if (activeTab === 'newest' && !tpl.newest) return false;
      if (activeTab === 'favorites' && !favorites.includes(tpl.id)) return false;

      return true;
    }).sort((a, b) => {
      const aDownloads = a.downloads + (userDownloads[a.id] || 0);
      const bDownloads = b.downloads + (userDownloads[b.id] || 0);
      const aLikes = a.likes + (userLikes[a.id] ? 1 : 0);
      const bLikes = b.likes + (userLikes[b.id] ? 1 : 0);

      if (sortBy === 'popular') return bLikes - aLikes;
      if (sortBy === 'downloads') return bDownloads - aDownloads;
      if (sortBy === 'newest') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      if (sortBy === 'rating') return bLikes - aLikes;
      // default trending
      return (b.featured ? 100 : 0) + bLikes - ((a.featured ? 100 : 0) + aLikes);
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedTheme, activeTab, favorites, sortBy, userDownloads, userLikes]);

  const recentlyUsedTemplatesList = useMemo(() => {
    return recentlyUsed
      .map((id) => TEMPLATE_MARKETPLACE.find((t) => t.id === id))
      .filter(Boolean) as MarketplaceTemplate[];
  }, [recentlyUsed]);

  const previewMarkdownContent = useMemo(() => {
    if (!previewTemplate) return '';
    return generateREADME(previewTemplate.config);
  }, [previewTemplate]);

  const handleCopyMarkdown = () => {
    if (!previewMarkdownContent) return;
    navigator.clipboard.writeText(previewMarkdownContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-300" />
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
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">🛍️</span>
              <span>README Templates</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {TEMPLATE_MARKETPLACE.length} Ready-to-Use
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button href="/readme-builder" variant="primary" className="text-xs">
            Open Builder
          </Button>
        </div>
      </header>

      {/* Main Hero & Search Container */}
      <section className="bg-gradient-to-b from-blue-50/60 via-purple-50/20 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent pt-10 pb-8 px-6 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Professional Template Library
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white max-w-3xl mx-auto leading-tight">
            Craft a World-Class GitHub Profile in <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Seconds</span>
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse {TEMPLATE_MARKETPLACE.length}+ curated, production-quality README templates engineered for developers, designers, open source maintainers, and tech leaders.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by technology (React, Python, Go), role (Frontend, DevOps), author, or tag..."
                className="w-full pl-12 pr-10 py-3.5 text-sm bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-2xl shadow-lg focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 space-y-8 w-full">
        {/* Category Pills Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 flex-wrap gap-3">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-gray-200/60 dark:bg-gray-800/60 p-1 rounded-xl select-none">
              {(['all', 'featured', 'trending', 'newest', 'favorites'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition capitalize flex items-center gap-1.5 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'all' && '🔥 All Templates'}
                  {tab === 'featured' && '⭐ Featured'}
                  {tab === 'trending' && '📈 Trending'}
                  {tab === 'newest' && '✨ Newest'}
                  {tab === 'favorites' && `❤️ Favorites (${favorites.length})`}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 select-none">
              <span className="text-2xs font-bold uppercase tracking-wider text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'trending' | 'popular' | 'downloads' | 'newest')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer focus:outline-none"
              >
                <option value="trending">🔥 Trending</option>
                <option value="popular">❤️ Most Liked</option>
                <option value="downloads">📥 Most Downloaded</option>
                <option value="newest">✨ Newest First</option>
              </select>
            </div>
          </div>

          {/* Categories Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Additional Filter Pills (Difficulty & Theme) */}
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 select-none flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Difficulty:</span>
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-md text-2xs font-bold cursor-pointer transition ${
                    selectedDifficulty === diff
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Theme Style:</span>
              {(['All', 'minimal', 'dark', 'gradient', 'terminal'] as const).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setSelectedTheme(thm)}
                  className={`px-2.5 py-1 rounded-md text-2xs font-bold cursor-pointer transition capitalize ${
                    selectedTheme === thm
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {thm}
                </button>
              ))}
            </div>

            {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedTheme !== 'All' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-2xs font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
              >
                <RefreshCw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Recently Used Templates Section */}
        {recentlyUsedTemplatesList.length > 0 && activeTab === 'all' && !searchQuery && selectedCategory === 'All' && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 select-none">
              <Clock className="w-4 h-4 text-blue-500" /> Recently Used Templates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyUsedTemplatesList.map((tpl) => (
                <div
                  key={`recent-${tpl.id}`}
                  className="p-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between shadow-xs hover:border-blue-500/50 transition cursor-pointer"
                  onClick={() => handleUseTemplate(tpl)}
                >
                  <div className="space-y-0.5 truncate">
                    <span className="font-bold text-xs text-gray-900 dark:text-white block truncate">{tpl.name}</span>
                    <span className="text-[10px] text-gray-400 block">{tpl.category} · {tpl.theme}</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Use →</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Grid View */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 select-none">
            <span>Showing <strong>{filteredTemplates.length}</strong> of {TEMPLATE_MARKETPLACE.length} templates</span>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-3">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">No Templates Found</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No templates matched your current filters or search query. Try clearing your search or resetting category filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs hover:bg-blue-700 transition"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const isFav = favorites.includes(template.id);
                const isLiked = Boolean(userLikes[template.id]);
                const totalLikes = template.likes + (isLiked ? 1 : 0);
                const totalDownloads = template.downloads + (userDownloads[template.id] || 0);

                return (
                  <div
                    key={template.id}
                    className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                  >
                    {/* Visual Card Banner Header */}
                    <div className="relative h-44 bg-gradient-to-br from-gray-900 to-gray-950 p-4 flex flex-col justify-between overflow-hidden border-b border-gray-200 dark:border-gray-800">
                      {/* Background Visual Flair */}
                      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                      
                      {/* Top Bar Badges */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-md">
                          {template.category}
                        </span>
                        <div className="flex items-center gap-1.5">
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
                            aria-label="Bookmark template"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Center Banner Title Mockup */}
                      <div className="relative z-10 text-center space-y-1 my-auto">
                        <span className="text-xs font-mono font-bold text-blue-400 block truncate">
                          {template.config.header.name || template.name}
                        </span>
                        <span className="text-[10px] text-gray-300 font-mono block truncate opacity-80">
                          {template.config.header.title || template.description}
                        </span>
                      </div>

                      {/* Bottom Banner Tags */}
                      <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-gray-400">
                        <span className="px-2 py-0.5 rounded bg-gray-800/80 uppercase tracking-wider text-[9px]">
                          {template.difficulty}
                        </span>
                        <span className="text-gray-400">{template.author}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-500 transition line-clamp-1">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer Metrics & Actions */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 select-none">
                          <button
                            onClick={() => toggleLike(template.id)}
                            className="flex items-center gap-1 hover:text-red-500 transition cursor-pointer"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                            <span>{totalLikes}</span>
                          </button>
                          <div className="flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" />
                            <span>{totalDownloads.toLocaleString()}</span>
                          </div>
                          <span>Updated {template.lastUpdated}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setPreviewTemplate(template);
                              setViewportMode('desktop');
                            }}
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
        </section>
      </main>

      {/* Large Responsive Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 select-none flex-shrink-0">
              <div className="flex items-center gap-3 truncate">
                <h2 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
                  {previewTemplate.name}
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
                  {previewTemplate.category}
                </span>
              </div>

              {/* Viewport Tabs */}
              <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    viewportMode === 'desktop' ? 'bg-white dark:bg-gray-900 text-blue-500 shadow-xs' : 'text-gray-400'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> Desktop
                </button>
                <button
                  onClick={() => setViewportMode('tablet')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    viewportMode === 'tablet' ? 'bg-white dark:bg-gray-900 text-blue-500 shadow-xs' : 'text-gray-400'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" /> Tablet
                </button>
                <button
                  onClick={() => setViewportMode('mobile')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    viewportMode === 'mobile' ? 'bg-white dark:bg-gray-900 text-blue-500 shadow-xs' : 'text-gray-400'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
                <button
                  onClick={() => setViewportMode('markdown')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    viewportMode === 'markdown' ? 'bg-white dark:bg-gray-900 text-blue-500 shadow-xs' : 'text-gray-400'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" /> Raw MD
                </button>
              </div>

              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Preview Area */}
            <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-6 custom-editor-scrollbar flex justify-center">
              <div
                className={`transition-all duration-300 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-md h-fit ${
                  viewportMode === 'desktop' ? 'w-full max-w-4xl' : ''
                } ${viewportMode === 'tablet' ? 'w-[768px]' : ''} ${
                  viewportMode === 'mobile' ? 'w-[375px]' : ''
                } ${viewportMode === 'markdown' ? 'w-full max-w-4xl font-mono text-xs' : ''}`}
              >
                {viewportMode === 'markdown' ? (
                  <div className="relative">
                    <button
                      onClick={handleCopyMarkdown}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-2xs font-bold rounded-lg flex items-center gap-1 transition"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      {copiedCode ? 'Copied!' : 'Copy Markdown'}
                    </button>
                    <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed font-mono p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl overflow-x-auto">
                      {previewMarkdownContent}
                    </pre>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <MDEditorMarkdown source={previewMarkdownContent} />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0 select-none">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>By <strong>{previewTemplate.author}</strong></span>
                <span>•</span>
                <span>Difficulty: <strong>{previewTemplate.difficulty}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  🚀 Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateMarketplacePage;
