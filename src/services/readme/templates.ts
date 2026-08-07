export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  themeId: string;
  align: 'left' | 'center';
  showBanners: boolean;
}

export const README_TEMPLATES: Record<string, TemplateConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Sleek, typography-first minimal layout',
    themeId: 'minimal',
    align: 'left',
    showBanners: false,
  },
  modern: {
    id: 'modern',
    name: 'Modern Developer',
    description: 'Centered intro, badges, and stats grid',
    themeId: 'modern',
    align: 'center',
    showBanners: true,
  },
  creative: {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Vibrant badges, project showcases, and trophies',
    themeId: 'creative',
    align: 'center',
    showBanners: true,
  },
  compact: {
    id: 'compact',
    name: 'Compact Profile',
    description: 'Dense layout optimized for quick scanning',
    themeId: 'compact',
    align: 'left',
    showBanners: false,
  },
};

export function getTemplateConfig(templateId = 'modern'): TemplateConfig {
  return README_TEMPLATES[templateId] || README_TEMPLATES.modern;
}
