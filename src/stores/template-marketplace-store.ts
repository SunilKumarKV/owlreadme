import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TemplateMarketplaceState {
  favorites: string[]; // Array of template IDs
  recentlyUsed: string[]; // Array of template IDs
  userLikes: Record<string, boolean>; // templateId -> liked
  userDownloads: Record<string, number>; // templateId -> download count
  searchQuery: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedTheme: string;
  sortBy: 'popular' | 'trending' | 'newest' | 'downloads' | 'rating';
  
  // Actions
  toggleFavorite: (id: string) => void;
  addRecentlyUsed: (id: string) => void;
  toggleLike: (id: string) => void;
  incrementDownload: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedDifficulty: (difficulty: string) => void;
  setSelectedTheme: (theme: string) => void;
  setSortBy: (sort: 'popular' | 'trending' | 'newest' | 'downloads' | 'rating') => void;
  resetFilters: () => void;
}

export const useTemplateMarketplaceStore = create<TemplateMarketplaceState>()(
  persist(
    (set) => ({
      favorites: ['tpl-github-profile-pro', 'tpl-react-dev', 'tpl-animated-readme'],
      recentlyUsed: ['tpl-modern-portfolio', 'tpl-minimal-dev'],
      userLikes: { 'tpl-github-profile-pro': true, 'tpl-react-dev': true },
      userDownloads: {},
      searchQuery: '',
      selectedCategory: 'All',
      selectedDifficulty: 'All',
      selectedTheme: 'All',
      sortBy: 'trending',

      toggleFavorite: (id) =>
        set((state) => {
          const isFav = state.favorites.includes(id);
          return {
            favorites: isFav
              ? state.favorites.filter((favId) => favId !== id)
              : [...state.favorites, id],
          };
        }),

      addRecentlyUsed: (id) =>
        set((state) => ({
          recentlyUsed: [id, ...state.recentlyUsed.filter((item) => item !== id)].slice(0, 8),
        })),

      toggleLike: (id) =>
        set((state) => {
          const currentlyLiked = Boolean(state.userLikes[id]);
          return {
            userLikes: {
              ...state.userLikes,
              [id]: !currentlyLiked,
            },
          };
        }),

      incrementDownload: (id) =>
        set((state) => ({
          userDownloads: {
            ...state.userDownloads,
            [id]: (state.userDownloads[id] || 0) + 1,
          },
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
      setSelectedTheme: (theme) => set({ selectedTheme: theme }),
      setSortBy: (sortBy) => set({ sortBy }),
      resetFilters: () =>
        set({
          searchQuery: '',
          selectedCategory: 'All',
          selectedDifficulty: 'All',
          selectedTheme: 'All',
          sortBy: 'trending',
        }),
    }),
    {
      name: 'owlreadme-template-marketplace',
    }
  )
);
