/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  READMEData,
  RoadmapData,
  READMEStyleTemplate,
  FeaturedProject,
  AnimatedComponentItem,
  SectionId,
  SectionConfig,
  AchievementWidgetConfig
} from '@/packages/readme-engine';

/**
 * Helper to safely sanitize and bound strings to prevent excessive sizes.
 */
function safeString(val: unknown, maxLength = 1000): string {
  if (typeof val !== 'string') return '';
  return val.slice(0, maxLength);
}

/**
 * Helper to validate positive numbers.
 */
function safeNumber(val: unknown): number | undefined {
  if (typeof val === 'number' && !isNaN(val) && val >= 0) return val;
  return undefined;
}

const VALID_TEMPLATES: READMEStyleTemplate[] = ['minimal', 'professional', 'developer', 'open-source', 'portfolio'];
function safeTemplate(val: unknown): READMEStyleTemplate | undefined {
  if (typeof val === 'string' && VALID_TEMPLATES.includes(val as READMEStyleTemplate)) {
    return val as READMEStyleTemplate;
  }
  return undefined;
}

/**
 * Strict validator schema for READMEData.
 * Ensures structure, type safety, and prevents prototype pollution.
 */
export function validateREADMEData(data: unknown): READMEData | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const raw = data as Record<string, any>;
  const validated: READMEData = {};

  if ('name' in raw) validated.name = safeString(raw.name, 100);
  if ('role' in raw) validated.role = safeString(raw.role, 150);
  if ('about' in raw) validated.about = safeString(raw.about, 2000);
  if ('skills' in raw) validated.skills = safeString(raw.skills, 2000);
  if ('projects' in raw) validated.projects = safeString(raw.projects, 2000);
  if ('socials' in raw) validated.socials = safeString(raw.socials, 2000);
  if ('avatarUrl' in raw) validated.avatarUrl = safeString(raw.avatarUrl, 1000);
  if ('followers' in raw) validated.followers = safeNumber(raw.followers);
  if ('following' in raw) validated.following = safeNumber(raw.following);
  if ('publicRepos' in raw) validated.publicRepos = safeNumber(raw.publicRepos);
  if ('template' in raw) validated.template = safeTemplate(raw.template);

  // techStack?: TechStackConfig;
  if (raw.techStack && typeof raw.techStack === 'object' && !Array.isArray(raw.techStack)) {
    const ts = raw.techStack as Record<string, any>;
    validated.techStack = {
      enabled: Boolean(ts.enabled),
      style: (ts.style === 'flat' || ts.style === 'flat-square' || ts.style === 'for-the-badge' || ts.style === 'plastic') ? ts.style : 'flat',
      iconOnly: Boolean(ts.iconOnly),
      groupByCategory: Boolean(ts.groupByCategory),
      hideEmptyCategories: Boolean(ts.hideEmptyCategories),
      selectedIds: Array.isArray(ts.selectedIds) ? ts.selectedIds.filter((id) => typeof id === 'string').map((id) => safeString(id, 100)) : []
    };
  }

  // githubStats?: GitHubStatsConfig;
  if (raw.githubStats && typeof raw.githubStats === 'object' && !Array.isArray(raw.githubStats)) {
    const gs = raw.githubStats as Record<string, any>;
    const cardOrder = Array.isArray(gs.cardOrder)
      ? gs.cardOrder.filter((c) => c === 'stats' || c === 'languages' || c === 'streak')
      : ['stats', 'languages', 'streak'];
    const cardConfigs: Record<'stats' | 'languages' | 'streak', { enabled: boolean }> = {
      stats: { enabled: true },
      languages: { enabled: true },
      streak: { enabled: true }
    };
    if (gs.cardConfigs && typeof gs.cardConfigs === 'object') {
      const cc = gs.cardConfigs as Record<string, any>;
      if (cc.stats && typeof cc.stats === 'object') {
        cardConfigs.stats.enabled = Boolean(cc.stats.enabled);
      }
      if (cc.languages && typeof cc.languages === 'object') {
        cardConfigs.languages.enabled = Boolean(cc.languages.enabled);
      }
      if (cc.streak && typeof cc.streak === 'object') {
        cardConfigs.streak.enabled = Boolean(cc.streak.enabled);
      }
    }
    validated.githubStats = {
      enabled: Boolean(gs.enabled),
      username: safeString(gs.username, 100),
      theme: safeString(gs.theme, 50),
      hideBorder: Boolean(gs.hideBorder),
      showIcons: Boolean(gs.showIcons),
      compactMode: Boolean(gs.compactMode),
      layout: (gs.layout === 'default' || gs.layout === 'compact') ? gs.layout : 'default',
      cardOrder: cardOrder as ('stats' | 'languages' | 'streak')[],
      cardConfigs
    };
  }

  // socialLinks?: SocialLinksConfig;
  if (raw.socialLinks && typeof raw.socialLinks === 'object' && !Array.isArray(raw.socialLinks)) {
    const sl = raw.socialLinks as Record<string, any>;
    const platforms: Record<string, { enabled: boolean; value: string }> = {};
    if (sl.platforms && typeof sl.platforms === 'object') {
      const pl = sl.platforms as Record<string, any>;
      for (const key of Object.keys(pl)) {
        if (key.length > 50) continue;
        const p = pl[key] as Record<string, any>;
        if (p && typeof p === 'object') {
          platforms[key] = {
            enabled: Boolean(p.enabled),
            value: safeString(p.value, 500)
          };
        }
      }
    }
    validated.socialLinks = {
      enabled: Boolean(sl.enabled),
      style: (sl.style === 'flat' || sl.style === 'flat-square' || sl.style === 'for-the-badge' || sl.style === 'plastic') ? sl.style : 'flat',
      iconOnly: Boolean(sl.iconOnly),
      platforms,
      order: Array.isArray(sl.order) ? sl.order.filter((o) => typeof o === 'string').map((o) => safeString(o, 50)) : []
    };
  }

  // header?: HeaderConfig;
  if (raw.header && typeof raw.header === 'object' && !Array.isArray(raw.header)) {
    const h = raw.header as Record<string, any>;
    validated.header = {
      enabled: Boolean(h.enabled),
      name: safeString(h.name, 100),
      pronouns: safeString(h.pronouns, 50),
      location: safeString(h.location, 100),
      title: safeString(h.title, 150),
      intro: safeString(h.intro, 1000),
      alignment: (h.alignment === 'left' || h.alignment === 'center' || h.alignment === 'right') ? h.alignment : 'left',
      bannerType: (h.bannerType === 'none' || h.bannerType === 'capsule' || h.bannerType === 'wave' || h.bannerType === 'gradient') ? h.bannerType : 'none',
      bannerTheme: safeString(h.bannerTheme, 50),
      bannerText: safeString(h.bannerText, 200),
      typingEnabled: Boolean(h.typingEnabled),
      typingLines: Array.isArray(h.typingLines) ? h.typingLines.filter((l) => typeof l === 'string').map((l) => safeString(l, 200)) : [],
      typingSpeed: typeof h.typingSpeed === 'number' ? h.typingSpeed : 40,
      typingDelay: typeof h.typingDelay === 'number' ? h.typingDelay : 1000,
      typingColor: safeString(h.typingColor, 50),
      typingCenter: Boolean(h.typingCenter),
      badges: {
        openToWork: Boolean(h.badges?.openToWork),
        freelance: Boolean(h.badges?.freelance),
        learning: safeString(h.badges?.learning, 100),
        building: safeString(h.badges?.building, 100)
      },
      visitorPlacement: (h.visitorPlacement === 'top' || h.visitorPlacement === 'bottom' || h.visitorPlacement === 'hidden') ? h.visitorPlacement : 'hidden'
    };
  }

  // support?: SupportConfig;
  if (raw.support && typeof raw.support === 'object' && !Array.isArray(raw.support)) {
    const s = raw.support as Record<string, any>;
    validated.support = {
      enabled: Boolean(s.enabled),
      buyMeACoffeeUsername: safeString(s.buyMeACoffeeUsername, 100),
      kofiUsername: safeString(s.kofiUsername, 100),
      style: (s.style === 'flat' || s.style === 'flat-square' || s.style === 'for-the-badge') ? s.style : 'flat'
    };
  }

  // quotes?: QuotesConfig;
  if (raw.quotes && typeof raw.quotes === 'object' && !Array.isArray(raw.quotes)) {
    const q = raw.quotes as Record<string, any>;
    validated.quotes = {
      enabled: Boolean(q.enabled),
      theme: safeString(q.theme, 50),
      quoteType: (q.quoteType === 'programming' || q.quoteType === 'funny' || q.quoteType === 'motivational') ? q.quoteType : 'programming'
    };
  }

  // customMarkdown?: CustomMarkdownConfig;
  if (raw.customMarkdown && typeof raw.customMarkdown === 'object' && !Array.isArray(raw.customMarkdown)) {
    const cm = raw.customMarkdown as Record<string, any>;
    validated.customMarkdown = {
      enabled: Boolean(cm.enabled),
      content: safeString(cm.content, 10000)
    };
  }

  // standaloneVisitor?: StandaloneVisitorConfig;
  if (raw.standaloneVisitor && typeof raw.standaloneVisitor === 'object' && !Array.isArray(raw.standaloneVisitor)) {
    const sv = raw.standaloneVisitor as Record<string, any>;
    validated.standaloneVisitor = {
      enabled: Boolean(sv.enabled),
      username: safeString(sv.username, 100),
      color: safeString(sv.color, 50),
      style: safeString(sv.style, 50)
    };
  }

  // featuredProjects?: FeaturedProjectsConfig;
  if (raw.featuredProjects && typeof raw.featuredProjects === 'object' && !Array.isArray(raw.featuredProjects)) {
    const fp = raw.featuredProjects as Record<string, any>;
    const projects = Array.isArray(fp.projects) ? fp.projects.filter((p) => p && typeof p === 'object').map((p) => {
      const projItem = p as Record<string, any>;
      const proj: FeaturedProject = {
        id: safeString(projItem.id, 100),
        source: (projItem.source === 'github' || projItem.source === 'manual') ? projItem.source : 'manual'
      };
      if ('repoName' in projItem) proj.repoName = safeString(projItem.repoName, 100);
      if ('description' in projItem) proj.description = safeString(projItem.description, 500);
      if ('language' in projItem) proj.language = safeString(projItem.language, 50);
      if ('stars' in projItem) proj.stars = safeNumber(projItem.stars);
      if ('forks' in projItem) proj.forks = safeNumber(projItem.forks);
      if ('topics' in projItem) proj.topics = Array.isArray(projItem.topics) ? projItem.topics.filter((t) => typeof t === 'string').map((t) => safeString(t, 50)) : [];
      if ('repoUrl' in projItem) proj.repoUrl = safeString(projItem.repoUrl, 500);
      if ('updatedAt' in projItem) proj.updatedAt = safeString(projItem.updatedAt, 100);
      if ('title' in projItem) proj.title = safeString(projItem.title, 100);
      if ('demoUrl' in projItem) proj.demoUrl = safeString(projItem.demoUrl, 500);
      if ('technologies' in projItem) proj.technologies = Array.isArray(projItem.technologies) ? projItem.technologies.filter((t) => typeof t === 'string').map((t) => safeString(t, 50)) : [];
      if ('pinned' in projItem) proj.pinned = Boolean(projItem.pinned);
      return proj;
    }) : [];
    validated.featuredProjects = {
      enabled: Boolean(fp.enabled),
      projects,
      cardStyle: (fp.cardStyle === 'minimal' || fp.cardStyle === 'modern' || fp.cardStyle === 'compact' || fp.cardStyle === 'grid' || fp.cardStyle === 'gprm') ? fp.cardStyle : 'minimal',
      layout: (fp.layout === '1-col' || fp.layout === '2-col' || fp.layout === 'grid') ? fp.layout : 'grid',
      sortMode: (fp.sortMode === 'manual' || fp.sortMode === 'stars' || fp.sortMode === 'updated') ? fp.sortMode : 'manual',
      badgeStyle: (fp.badgeStyle === 'flat' || fp.badgeStyle === 'flat-square' || fp.badgeStyle === 'for-the-badge' || fp.badgeStyle === 'plastic') ? fp.badgeStyle : 'flat',
      showStars: Boolean(fp.showStars),
      showForks: Boolean(fp.showForks),
      showLanguage: Boolean(fp.showLanguage),
      showTopics: Boolean(fp.showTopics)
    };
  }

  // achievements?: AchievementsConfig;
  if (raw.achievements && typeof raw.achievements === 'object' && !Array.isArray(raw.achievements)) {
    const ac = raw.achievements as Record<string, any>;
    const widgets: Record<'trophy' | 'visitor' | 'snake' | 'graph', AchievementWidgetConfig> = {
      trophy: { enabled: false },
      visitor: { enabled: false },
      snake: { enabled: false },
      graph: { enabled: false }
    };
    if (ac.widgets && typeof ac.widgets === 'object') {
      const aw = ac.widgets as Record<string, any>;
      for (const wKey of ['trophy', 'visitor', 'snake', 'graph'] as const) {
        const w = aw[wKey] as Record<string, any> | undefined;
        if (w && typeof w === 'object') {
          widgets[wKey] = {
            enabled: Boolean(w.enabled),
            theme: safeString(w.theme, 50),
            color: safeString(w.color, 50),
            style: safeString(w.style, 50),
            hideBorder: Boolean(w.hideBorder),
            noFrame: Boolean(w.noFrame),
            noBg: Boolean(w.noBg),
            rows: safeNumber(w.rows),
            columns: safeNumber(w.columns)
          };
        }
      }
    }
    validated.achievements = {
      enabled: Boolean(ac.enabled),
      username: safeString(ac.username, 100),
      widgets,
      order: Array.isArray(ac.order) ? ac.order.filter((o) => o === 'trophy' || o === 'visitor' || o === 'snake' || o === 'graph') : ['trophy', 'visitor', 'snake', 'graph']
    };
  }

  // sections?: SectionOrderConfig;
  if (raw.sections && typeof raw.sections === 'object' && !Array.isArray(raw.sections)) {
    const s = raw.sections as Record<string, any>;
    const sections: Record<SectionId, SectionConfig> = {} as any;
    if (s.sections && typeof s.sections === 'object') {
      const sec = s.sections as Record<string, any>;
      const allowedSectionIds: SectionId[] = [
        'header', 'about', 'socials', 'techStack', 'stats', 'achievements',
        'projects', 'support', 'quotes', 'visitor', 'custom', 'animatedComponents'
      ];
      for (const sId of allowedSectionIds) {
        const item = sec[sId] as Record<string, any> | undefined;
        if (item && typeof item === 'object') {
          sections[sId] = {
            id: sId,
            name: safeString(item.name, 100),
            enabled: Boolean(item.enabled),
            collapsed: Boolean(item.collapsed)
          };
        }
      }
    }
    validated.sections = {
      sections,
      order: Array.isArray(s.order) ? s.order.filter((o) => typeof o === 'string' && [
        'header', 'about', 'socials', 'techStack', 'stats', 'achievements',
        'projects', 'support', 'quotes', 'visitor', 'custom', 'animatedComponents'
      ].includes(o)) : []
    };
  }

  // animatedComponents?: AnimatedComponentsConfig;
  if (raw.animatedComponents && typeof raw.animatedComponents === 'object' && !Array.isArray(raw.animatedComponents)) {
    const ac = raw.animatedComponents as Record<string, any>;
    const components = Array.isArray(ac.components) ? ac.components.filter((c) => c && typeof c === 'object').map((c) => {
      const compItem = c as Record<string, any>;
      const comp: AnimatedComponentItem = {
        id: safeString(compItem.id, 100),
        type: (compItem.type === 'typing' || compItem.type === 'waveHeader' || compItem.type === 'divider' || compItem.type === 'snake' || compItem.type === 'decorative' || compItem.type === 'badge' || compItem.type === 'footer') ? compItem.type : 'typing',
        enabled: Boolean(compItem.enabled),
        title: safeString(compItem.title, 100),
        config: {}
      };
      if (compItem.config && typeof compItem.config === 'object' && !Array.isArray(compItem.config)) {
        const cfg = compItem.config as Record<string, any>;
        for (const k of Object.keys(cfg)) {
          if (k.length > 50) continue;
          const v = cfg[k];
          if (typeof v === 'string') {
            comp.config[k] = safeString(v, 500);
          } else if (typeof v === 'number') {
            comp.config[k] = v;
          } else if (typeof v === 'boolean') {
            comp.config[k] = v;
          }
        }
      }
      return comp;
    }) : [];
    validated.animatedComponents = {
      enabled: Boolean(ac.enabled),
      components
    };
  }

  return validated;
}

/**
 * Strict validator schema for RoadmapData.
 * Ensures structure, type safety, and prevents prototype pollution.
 */
export function validateRoadmapData(data: unknown): RoadmapData | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const raw = data as Record<string, any>;
  const validated: RoadmapData = {};

  if ('title' in raw) {
    validated.title = safeString(raw.title, 200);
  }
  if ('steps' in raw) {
    if (Array.isArray(raw.steps)) {
      validated.steps = raw.steps
        .filter((step) => typeof step === 'string')
        .map((step) => safeString(step, 1000));
    } else {
      validated.steps = [];
    }
  }

  return validated;
}

/**
 * Encodes an object state to a URL-safe Base64 string.
 * Uses TextEncoder for safe unicode handling (replaces deprecated unescape/escape).
 */
export function encodeShareData(data: READMEData | RoadmapData): string {
  try {
    const json = JSON.stringify(data);
    const bytes = new TextEncoder().encode(json);
    const binary = Array.from(bytes).map((b) => String.fromCharCode(b)).join('');
    return btoa(binary);
  } catch (e) {
    console.error('Failed to encode share data:', e);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string back to its original object.
 * Hardened with:
 * - Length check (max 256 KB)
 * - Safe JSON parsing
 * - Validation callback checking schemas
 */
export function decodeShareData<T>(base64: string, validator?: (data: unknown) => T | null): T | null {
  try {
    if (!base64) return null;
    
    // Size safety guard: limit characters to prevent DOS / OOM
    if (base64.length > 262144) {
      console.warn('Share payload length exceeds safety limit.');
      return null;
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);

    if (validator) {
      return validator(data);
    }
    return data as T;
  } catch (e) {
    console.error('Failed to decode share data:', e);
    return null;
  }
}

/**
 * Generates an absolute share URL for the public README or Roadmap.
 */
export function generateShareUrl(type: 'readme' | 'roadmap', state: READMEData | RoadmapData, theme: string): string {
  if (typeof window === 'undefined') return '';
  const data = encodeShareData(state);
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${type}?data=${encodeURIComponent(data)}&theme=${encodeURIComponent(theme)}`;
}

