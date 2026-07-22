import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://owlreadme.com';

  const routes = [
    '',
    '/dashboard',
    '/readme-builder',
    '/roadmap-builder',
    '/templates',
    '/preview',
    '/export',
    '/theme',
    '/analytics',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}
