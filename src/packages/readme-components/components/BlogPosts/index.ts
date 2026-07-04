import type { READMEComponent } from '../../types';

export const BlogPostsComponent: READMEComponent = {
  metadata: {
    id: 'BlogPosts',
    name: 'Latest Blog Posts',
    category: 'Content',
    icon: 'Rss',
    description: 'Dynamic RSS feed template or list mapping your recent articles, Dev.to writeups, or Medium updates.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config) => {
    if (!config || !config.enabled || !config.feedUrl) return '';
    const limit = config.limit || 5;
    const lines = ['## ✍️ Latest Blog Posts', ''];
    for (let i = 1; i <= limit; i++) {
      lines.push(`- [Latest Post Title #${i}](${config.feedUrl})`);
    }
    return lines.join('\n');
  },
  defaultConfig: {
    enabled: true,
    feedUrl: '',
    limit: 5,
  },
};

export default BlogPostsComponent;
