import React from 'react';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import { SOCIAL_PLATFORM_REGISTRY, SOCIAL_CATEGORIES } from '@/utils/social-registry';

export interface SocialLinksPanelProps {
  sectionId: string;
  socialLinks: {
    enabled: boolean;
    style: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge';
    iconOnly: boolean;
    platforms: Record<string, { enabled: boolean; value: string }>;
  };
  setSocialLinks: (updates: Partial<SocialLinksPanelProps['socialLinks']>) => void;
  socialSearch: string;
  setSocialSearch: (val: string) => void;
  socials: string;
  setSocials: (val: string) => void;
  loading: boolean;
}

export const SocialLinksPanel: React.FC<SocialLinksPanelProps> = ({
  sectionId,
  socialLinks,
  setSocialLinks,
  socialSearch,
  setSocialSearch,
  socials,
  setSocials,
  loading,
}) => {
  return (
    <div key={sectionId} className="p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
          🔗 Social Links & Contact Builder
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={socialLinks.enabled}
            onChange={(e) => setSocialLinks({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {socialLinks.enabled ? (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-all duration-300">
          {/* Badge Styling & Modifiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="social-style-select" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Badge Style</label>
              <select
                id="social-style-select"
                value={socialLinks.style}
                onChange={(e) => setSocialLinks({ style: e.target.value as any })}
                className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-2 ring-blue-500 transition duration-200"
              >
                <option value="flat">Flat</option>
                <option value="flat-square">Flat Square</option>
                <option value="plastic">Plastic</option>
                <option value="for-the-badge">For the Badge</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={socialLinks.iconOnly}
                  onChange={(e) => setSocialLinks({ iconOnly: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <span>Icon Only Mode</span>
              </label>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-64">
            <Input
              id="social-search-input"
              value={socialSearch}
              onChange={(e) => setSocialSearch(e.target.value)}
              placeholder="Search platforms..."
            />
          </div>

          {/* Platform Groups List */}
          <div className="space-y-6">
            {SOCIAL_CATEGORIES.map((category) => {
              const categoryPlatforms = SOCIAL_PLATFORM_REGISTRY.filter(
                (p) => p.category === category && p.name.toLowerCase().includes(socialSearch.toLowerCase())
              );

              if (categoryPlatforms.length === 0) return null;

              return (
                <div key={category} className="space-y-2 animate-fadeIn">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryPlatforms.map((platform) => {
                      const config = socialLinks.platforms[platform.id] || { enabled: false, value: '' };
                      const label = socialLinks.iconOnly ? '' : encodeURIComponent(platform.name);
                      const badgeUrl = `https://img.shields.io/badge/${label}-${platform.color}?style=${socialLinks.style}&logo=${platform.logo}&logoColor=${platform.logoColor}`;

                      const handleToggle = () => {
                        setSocialLinks({
                          platforms: {
                            ...socialLinks.platforms,
                            [platform.id]: {
                              ...config,
                              enabled: !config.enabled,
                            },
                          },
                        });
                      };

                      const handleValueChange = (val: string) => {
                        setSocialLinks({
                          platforms: {
                            ...socialLinks.platforms,
                            [platform.id]: {
                              ...config,
                              value: val,
                            },
                          },
                        });
                      };

                      return (
                        <div
                          key={platform.id}
                          className={`p-4 rounded-md border transition duration-150 space-y-3 ${
                            config.enabled
                              ? 'border-blue-200 dark:border-blue-900 bg-blue-50/10 dark:bg-blue-950/5'
                              : 'border-gray-200 dark:border-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={config.enabled}
                                onChange={handleToggle}
                                className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                                aria-label={`Toggle ${platform.name}`}
                              />
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{platform.name}</span>
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={badgeUrl}
                              alt={platform.name}
                              className="max-h-[20px] object-contain"
                              loading="lazy"
                            />
                          </div>

                          {config.enabled && (
                            <div>
                              <label className="block text-2xs uppercase tracking-wider text-gray-400 font-bold mb-0.5">Username / ID</label>
                              <Input
                                value={config.value}
                                onChange={(e) => handleValueChange(e.target.value)}
                                placeholder={platform.placeholder}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <label htmlFor="readme-socials" className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">Socials & Links (Fallback Text Block)</label>
          <Textarea
            id="readme-socials"
            value={socials}
            onChange={(e) => setSocials(e.target.value)}
            placeholder="Social Links (comma-separated or list)"
            rows={3}
            loading={loading}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default SocialLinksPanel;
