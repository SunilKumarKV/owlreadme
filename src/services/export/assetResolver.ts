import { ExportAsset } from '@/types/export';

/**
 * Extracts and categorizes image/badge assets referenced in a Markdown document.
 */
export function extractMarkdownAssets(markdown: string): ExportAsset[] {
  if (!markdown) return [];

  const assets: ExportAsset[] = [];
  const seenUrls = new Set<string>();

  // RegEx for markdown image syntax: ![alt](url)
  const mdImgRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+|\/[^\s\)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = mdImgRegex.exec(markdown)) !== null) {
    const url = match[1];
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      assets.push(classifyAsset(url));
    }
  }

  // RegEx for HTML img tag: <img ... src="url" ... />
  const htmlImgRegex = /<img\s+[^>]*src=["'](https?:\/\/[^"']+|\/[^"']+)["'][^>]*>/gi;
  while ((match = htmlImgRegex.exec(markdown)) !== null) {
    const url = match[1];
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      assets.push(classifyAsset(url));
    }
  }

  return assets;
}

function classifyAsset(url: string): ExportAsset {
  const filename = url.substring(url.lastIndexOf('/') + 1) || 'asset.png';

  if (url.includes('shields.io') || url.includes('badgen.net')) {
    return {
      url,
      type: 'generated',
      filename,
      isPackagable: false, // Shields.io badges are dynamic SVG URLs
    };
  }

  if (url.includes('githubusercontent.com') || url.includes('github.com')) {
    return {
      url,
      type: 'github',
      filename,
      isPackagable: false,
    };
  }

  if (url.startsWith('/')) {
    return {
      url,
      type: 'local',
      filename,
      isPackagable: true,
    };
  }

  return {
    url,
    type: 'external',
    filename,
    isPackagable: false,
  };
}
