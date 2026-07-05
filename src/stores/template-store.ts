/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SectionId } from './readme-store';

export type TemplateCategory =
  | 'minimal'
  | 'modern'
  | 'frontend'
  | 'full-stack'
  | 'open-source'
  | 'ai'
  | 'anime'
  | 'gprm';

export interface CommunityTemplate {
  id: string;
  name: string;
  description: string;
  author: string;
  category: TemplateCategory;
  tags: string[];
  likes: number;
  downloads: number;
  sections: SectionId[];
  theme: 'minimal' | 'dark' | 'gradient' | 'terminal';
  config: any; // Serialized useREADMEStore properties
  createdAt: string;
  isCustom?: boolean; // User created or imported
  isLiked?: boolean; // Locally liked status
  isFavorited?: boolean; // Locally favorited status
}

interface TemplateStore {
  templates: CommunityTemplate[];
  favorites: string[]; // List of template IDs
  recentlyUsed: string[]; // List of template IDs
  publishTemplate: (template: Omit<CommunityTemplate, 'id' | 'likes' | 'downloads' | 'createdAt' | 'isCustom'>) => void;
  deleteTemplate: (id: string) => void;
  toggleLike: (id: string) => void;
  incrementDownloads: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addRecentlyUsed: (id: string) => void;
  importTemplate: (jsonContent: string) => { success: boolean; error?: string };
}

// ── Seed Templates Definitions ──────────────────────────────────────────────
const SEED_TEMPLATES: CommunityTemplate[] = [
  {
    id: 'comm-ai-engineer',
    name: 'Neural Architect Profile',
    description: 'Designed for AI & ML engineers. Features animated typing vectors and model showcase stats.',
    author: 'alt_brain_42',
    category: 'ai',
    tags: ['ai', 'python', 'pytorch', 'llm'],
    likes: 142,
    downloads: 512,
    sections: ['header', 'about', 'techStack', 'stats', 'projects', 'animatedComponents'],
    theme: 'dark',
    createdAt: '2026-06-25T12:00:00Z',
    config: {
      header: {
        enabled: true,
        name: 'Dr. Evelyn Carter',
        title: 'Principal AI Researcher',
        intro: 'Building large language models and cognitive agents at the intersection of reasoning and control.',
        pronouns: 'she/her',
        location: 'Boston, MA',
        alignment: 'center',
        bannerType: 'gradient',
        bannerTheme: 'tokyonight',
        bannerText: '✨ Neural Engineering Lab',
        typingEnabled: true,
        typingLines: ['PyTorch Architect', 'Agent Orchestration Expert', 'Generative AI Specialist'],
        typingSpeed: 120,
        typingDelay: 800,
        typingColor: 'a855f7',
        typingCenter: true,
        badges: { openToWork: true, freelance: false, learning: 'Quantum ML', building: 'Cognitive-OS v2' },
        visitorPlacement: 'hidden',
      },
      githubStats: { enabled: true, theme: 'tokyonight', hideBorder: false, showIcons: true, compactMode: true, layout: 'compact' },
      techStack: { enabled: true, style: 'flat-square', iconOnly: false, groupByCategory: true, selectedIds: ['python', 'pytorch', 'tensorflow', 'fastapi', 'docker', 'huggingface'] },
      socialLinks: { enabled: true, style: 'for-the-badge', iconOnly: true, platforms: { github: 'https://github.com/evelyncarter', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' } },
      achievements: {
        enabled: false,
        widgets: {
          trophy: { enabled: false, theme: 'tokyonight', noFrame: false, noBg: false },
          visitor: { enabled: false, color: 'purple', style: 'flat' },
          snake: { enabled: false },
          graph: { enabled: false, theme: 'tokyonight', hideBorder: false },
        },
      },
      quotes: { enabled: true, theme: 'tokyonight', quoteType: 'programming' },
      animatedComponents: {
        enabled: true,
        components: [
          {
            id: 'typing-svg',
            type: 'typing',
            enabled: true,
            title: 'Model Focus Typing',
            config: { lines: ['Running Inference...', 'Optimizing Hyperparameters...', 'Aligning Policy Gradients...'], speed: 12, delay: 1000, color: 'a855f7' }
          }
        ]
      }
    }
  },
  {
    id: 'comm-gprm-dash',
    name: 'GPRM Modern Dashboard',
    description: 'High impact layout with neon dividers, custom badges, and detailed repository stats.',
    author: 'dashboard_wizard',
    category: 'gprm',
    tags: ['gprm', 'neon', 'dashboard', 'badges'],
    likes: 89,
    downloads: 304,
    sections: ['header', 'about', 'socials', 'techStack', 'stats', 'achievements', 'support'],
    theme: 'gradient',
    createdAt: '2026-06-26T08:30:00Z',
    config: {
      header: {
        enabled: true,
        name: 'Neon Coder',
        title: 'Creative Web Developer',
        intro: 'A visual-focused builder focusing on micro-animations and advanced SVG layouts.',
        pronouns: 'they/them',
        location: 'Berlin, DE',
        alignment: 'left',
        bannerType: 'capsule',
        bannerTheme: 'radical',
        bannerText: 'Interactive Dashboard',
        typingEnabled: false,
        typingLines: [],
        typingSpeed: 200,
        typingDelay: 1000,
        typingColor: '36BCF7',
        typingCenter: false,
        badges: { openToWork: false, freelance: true, learning: 'Three.js', building: 'WebGL Engine' },
        visitorPlacement: 'hidden',
      },
      githubStats: { enabled: true, theme: 'radical', hideBorder: true, showIcons: true, compactMode: false, layout: 'default' },
      techStack: { enabled: true, style: 'for-the-badge', iconOnly: true, groupByCategory: false, selectedIds: ['javascript', 'typescript', 'react', 'nextjs', 'tailwindcss', 'threejs'] },
      socialLinks: { enabled: true, style: 'flat-square', iconOnly: false, platforms: { github: 'https://github.com', devto: 'https://dev.to', hashnode: 'https://hashnode.com' } },
      achievements: {
        enabled: true,
        widgets: {
          trophy: { enabled: true, theme: 'radical', noFrame: true, noBg: true },
          visitor: { enabled: true, color: '0078d7', style: 'flat' },
          snake: { enabled: true },
          graph: { enabled: true, theme: 'radical', hideBorder: true },
        },
        order: ['trophy', 'visitor', 'graph', 'snake']
      },
      quotes: { enabled: false, theme: 'radical', quoteType: 'programming' }
    }
  },
  {
    id: 'comm-minimal-dev',
    name: 'Minimalist Clean Profile',
    description: 'A pure typography design. Lightweight, clean, and highly readable.',
    author: 'clean_coder',
    category: 'minimal',
    tags: ['minimal', 'typography', 'clean', 'simple'],
    likes: 215,
    downloads: 984,
    sections: ['header', 'about', 'socials'],
    theme: 'minimal',
    createdAt: '2026-06-24T10:15:00Z',
    config: {
      header: {
        enabled: true,
        name: 'Alex Sterling',
        title: 'Systems Architect',
        intro: 'Keeping code architectures slim and algorithms efficient.',
        pronouns: 'he/him',
        location: 'London, UK',
        alignment: 'left',
        bannerType: 'none',
        bannerTheme: 'default',
        bannerText: '',
        typingEnabled: false,
        typingLines: [],
        typingSpeed: 200,
        typingDelay: 1000,
        typingColor: '36BCF7',
        typingCenter: false,
        badges: { openToWork: false, freelance: false, learning: 'Rust Kernels', building: 'AeroFS' },
        visitorPlacement: 'hidden',
      },
      githubStats: { enabled: false, theme: 'default', hideBorder: false, showIcons: true, compactMode: false, layout: 'default' },
      techStack: { enabled: false, style: 'flat', iconOnly: false, groupByCategory: true, selectedIds: [] },
      socialLinks: { enabled: true, style: 'flat', iconOnly: false, platforms: { github: 'https://github.com', linkedin: 'https://linkedin.com' } },
      achievements: {
        enabled: false,
        widgets: {
          trophy: { enabled: false, theme: 'flat', noFrame: false, noBg: false },
          visitor: { enabled: false, color: 'green', style: 'flat' },
          snake: { enabled: false },
          graph: { enabled: false, theme: 'github', hideBorder: false },
        },
      },
      quotes: { enabled: false, theme: 'default', quoteType: 'programming' }
    }
  }
];

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: SEED_TEMPLATES,
      favorites: [],
      recentlyUsed: [],

      publishTemplate: (tpl) => {
        const newTemplate: CommunityTemplate = {
          ...tpl,
          id: `comm-${Math.random().toString(36).substring(2, 9)}`,
          likes: 0,
          downloads: 0,
          createdAt: new Date().toISOString(),
          isCustom: true,
        };
        set((state) => ({
          templates: [newTemplate, ...state.templates],
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((tpl) => tpl.id !== id || !tpl.isCustom),
          favorites: state.favorites.filter((fid) => fid !== id),
          recentlyUsed: state.recentlyUsed.filter((rid) => rid !== id),
        }));
      },

      toggleLike: (id) => {
        set((state) => ({
          templates: state.templates.map((tpl) => {
            if (tpl.id !== id) return tpl;
            const isLiked = !tpl.isLiked;
            return {
              ...tpl,
              isLiked,
              likes: isLiked ? tpl.likes + 1 : Math.max(0, tpl.likes - 1),
            };
          }),
        }));
      },

      incrementDownloads: (id) => {
        set((state) => ({
          templates: state.templates.map((tpl) => {
            if (tpl.id !== id) return tpl;
            return {
              ...tpl,
              downloads: tpl.downloads + 1,
            };
          }),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => {
          const isFav = state.favorites.includes(id);
          const updatedFavorites = isFav
            ? state.favorites.filter((fid) => fid !== id)
            : [...state.favorites, id];

          return {
            favorites: updatedFavorites,
            templates: state.templates.map((tpl) => {
              if (tpl.id !== id) return tpl;
              return {
                ...tpl,
                isFavorited: !isFav,
              };
            }),
          };
        });
      },

      addRecentlyUsed: (id) => {
        set((state) => {
          const filtered = state.recentlyUsed.filter((rid) => rid !== id);
          return {
            recentlyUsed: [id, ...filtered].slice(0, 8),
          };
        });
      },

      importTemplate: (jsonContent) => {
        try {
          const parsed = JSON.parse(jsonContent);
          if (!parsed.name || !parsed.category || !parsed.config) {
            return { success: false, error: 'Invalid schema. Missing name, category, or config.' };
          }
          const allowedCategories: TemplateCategory[] = ['minimal', 'modern', 'frontend', 'full-stack', 'open-source', 'ai', 'anime', 'gprm'];
          if (!allowedCategories.includes(parsed.category)) {
            return { success: false, error: `Invalid category. Must be one of: ${allowedCategories.join(', ')}` };
          }

          const newTemplate: CommunityTemplate = {
            id: parsed.id || `comm-${Math.random().toString(36).substring(2, 9)}`,
            name: parsed.name,
            description: parsed.description || 'Imported Community Template',
            author: parsed.author || 'Anonymous',
            category: parsed.category,
            tags: Array.isArray(parsed.tags) ? parsed.tags : [],
            likes: parsed.likes || 0,
            downloads: parsed.downloads || 0,
            sections: Array.isArray(parsed.sections) ? parsed.sections : ['header', 'about', 'socials'],
            theme: parsed.theme || 'minimal',
            config: parsed.config,
            createdAt: parsed.createdAt || new Date().toISOString(),
            isCustom: true,
          };

          set((state) => {
            // Avoid duplicate imports with same ID
            const filtered = state.templates.filter((tpl) => tpl.id !== newTemplate.id);
            return {
              templates: [newTemplate, ...filtered],
            };
          });

          return { success: true };
        } catch (e: any) {
          return { success: false, error: e.message || 'JSON parsing failed' };
        }
      },
    }),
    {
      name: 'community-template-store',
    }
  )
);
