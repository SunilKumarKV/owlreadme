/* eslint-disable @typescript-eslint/no-explicit-any -- AST node structures and legacy state configurations utilize explicit any */
import { SectionId } from '@/stores/readme-store';
import { TECHNOLOGY_REGISTRY } from '@/utils/tech-registry';
import { SOCIAL_PLATFORM_REGISTRY } from '@/utils/social-registry';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';

export interface DetectedSectionInfo {
  id: string; // Display name of the detected section
  sectionId: SectionId;
  name: string; // Mapped section display name
  confidence: number; // 0 to 100
  lines: [number, number]; // Source line numbers [start, end]
  status: 'Imported' | 'Unsupported' | 'Partial';
  details?: string;
}

export interface ParsedReadmeResult {
  detectedSections: SectionId[];
  analysis: {
    sections: DetectedSectionInfo[];
    totalDetected: number;
  };
  data: {
    name: string;
    role: string;
    about: string;
    skills: string;
    header: {
      enabled: boolean;
      name: string;
      title: string;
      intro: string;
      pronouns: string;
      location: string;
      alignment: 'left' | 'center' | 'right';
      bannerType: 'none' | 'capsule' | 'wave' | 'gradient';
      bannerTheme: string;
      bannerText: string;
      typingEnabled: boolean;
      typingLines: string[];
      typingSpeed: number;
      typingDelay: number;
      typingColor: string;
      typingCenter: boolean;
      badges: {
        openToWork: boolean;
        freelance: boolean;
        learning: string;
        building: string;
      };
      visitorPlacement: 'top' | 'bottom' | 'hidden';
    };
    githubStats: {
      enabled: boolean;
      username: string;
      theme: string;
      hideBorder: boolean;
      showIcons: boolean;
      compactMode: boolean;
      layout: 'default' | 'compact' | 'languages';
    };
    techStack: {
      enabled: boolean;
      style: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
      iconOnly: boolean;
      groupByCategory: boolean;
      selectedIds: string[];
    };
    socialLinks: {
      enabled: boolean;
      style: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
      iconOnly: boolean;
      platforms: Record<string, { enabled: boolean; value: string }>;
    };
    achievements: {
      enabled: boolean;
      username: string;
      widgets: Record<
        string,
        {
          enabled: boolean;
          theme?: string;
          color?: string;
          style?: string;
          hideBorder?: boolean;
          noFrame?: boolean;
          noBg?: boolean;
        }
      >;
    };
    featuredProjects: {
      enabled: boolean;
      projects: Array<{
        id: string;
        source: 'github' | 'manual';
        repoName?: string;
        title?: string;
        description?: string;
        language?: string;
        stars?: number;
        forks?: number;
        repoUrl?: string;
        demoUrl?: string;
        technologies?: string[];
      }>;
      cardStyle: 'minimal' | 'modern' | 'compact' | 'grid' | 'gprm';
      layout: '1-col' | '2-col' | 'grid';
      sortMode: 'stars' | 'updated' | 'manual';
      badgeStyle: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
      showStars: boolean;
      showForks: boolean;
      showLanguage: boolean;
      showTopics: boolean;
    };
    standaloneVisitor: {
      enabled: boolean;
      username: string;
      color: string;
      style: string;
    };
    support: {
      enabled: boolean;
      buyMeACoffeeUsername: string;
      kofiUsername: string;
      style: 'flat' | 'flat-square' | 'for-the-badge';
    };
    quotes: {
      enabled: boolean;
      theme: string;
      quoteType: 'programming' | 'funny' | 'motivational';
    };
    customMarkdown: {
      enabled: boolean;
      content: string;
    };
    animatedComponents: {
      enabled: boolean;
      items: any[];
    };
  };
}

/** Recursively gathers all AST nodes under a parent matching specified types */
function findNodes(node: any, types: string[]): any[] {
  const results: any[] = [];
  if (!node) return results;
  if (types.includes(node.type)) {
    results.push(node);
  }
  if (node.children) {
    for (const child of node.children) {
      results.push(...findNodes(child, types));
    }
  }
  return results;
}

/** Helper to extract a query parameter from both relative and absolute URLs */
function getQueryParam(url: string, param: string): string | null {
  try {
    const urlObj = new URL(url, 'https://dummy.com');
    return urlObj.searchParams.get(param);
  } catch {
    const regex = new RegExp(`[?&]${param}=([^&#]*)`, 'i');
    const match = url.match(regex);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

/** Analyzes raw HTML text to extract image sources or anchor tags */
function parseHtmlTags(html: string): { images: string[]; links: string[] } {
  const images: string[] = [];
  const links: string[] = [];

  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }

  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }

  return { images, links };
}

/** Robustly verifies if a URL represents a specific technology or social platform without false positive substring matches (like 'go' matching inside 'logo') */
function matchesTechOrSocial(url: string, key: string, logo: string): boolean {
  const urlLower = url.toLowerCase();
  const keyLower = key.toLowerCase();
  const logoLower = logo.toLowerCase();

  const checkMatch = (val: string) => {
    if (!val) return false;
    
    // 1. Exact match for Shields.io logo query param
    const logoParam = getQueryParam(urlLower, 'logo');
    if (logoParam === val) return true;

    // 2. Exact match for path parameter in Shields.io URL, e.g., /badge/React-20232A
    const badgeMatch = urlLower.match(/\/badge\/([a-z0-9_#+.-]+)/i);
    if (badgeMatch) {
      const badgeName = badgeMatch[1].split('-')[0];
      if (badgeName === val) return true;
    }

    // 3. Exact word boundary match for direct paths or subdomain structures
    const regex = new RegExp(`(?:[/._-]|^)${val}(?:[/._-]|$|\\?)`, 'i');
    if (regex.test(urlLower)) return true;

    return false;
  };

  return checkMatch(keyLower) || checkMatch(logoLower);
}

export function parseReadmeMarkdown(markdown: string): ParsedReadmeResult {
  // 1. Initialize MDAST Parser
  const processor = unified().use(remarkParse);
  const ast = processor.parse(markdown);

  // 2. Group MDAST nodes into segments delimited by headings
  interface ASTSegment {
    headingNode?: any;
    nodes: any[];
    startLine: number;
    endLine: number;
    startOffset: number;
    endOffset: number;
  }

  const segments: ASTSegment[] = [];
  let currentSegment: ASTSegment = {
    nodes: [],
    startLine: 1,
    endLine: 1,
    startOffset: 0,
    endOffset: 0,
  };

  for (const child of ast.children) {
    const nodeStartLine = child.position?.start?.line || 1;
    const nodeEndLine = child.position?.end?.line || nodeStartLine;
    const nodeStartOffset = child.position?.start?.offset ?? 0;
    const nodeEndOffset = child.position?.end?.offset ?? markdown.length;

    if (child.type === 'heading') {
      if (currentSegment.nodes.length > 0 || currentSegment.headingNode) {
        segments.push(currentSegment);
      }
      currentSegment = {
        headingNode: child,
        nodes: [],
        startLine: nodeStartLine,
        endLine: nodeEndLine,
        startOffset: nodeStartOffset,
        endOffset: nodeEndOffset,
      };
    } else {
      if (currentSegment.nodes.length === 0 && !currentSegment.headingNode) {
        currentSegment.startLine = nodeStartLine;
        currentSegment.startOffset = nodeStartOffset;
      }
      currentSegment.nodes.push(child);
      currentSegment.endLine = Math.max(currentSegment.endLine, nodeEndLine);
      currentSegment.endOffset = Math.max(currentSegment.endOffset, nodeEndOffset);
    }
  }
  if (currentSegment.nodes.length > 0 || currentSegment.headingNode) {
    segments.push(currentSegment);
  }

  // 3. Initialize default output builder state
  const resultData: ParsedReadmeResult['data'] = {
    name: '',
    role: '',
    about: '',
    skills: '',
    header: {
      enabled: false,
      name: '',
      title: '',
      intro: '',
      pronouns: '',
      location: '',
      alignment: 'center',
      bannerType: 'none',
      bannerTheme: 'default',
      bannerText: '',
      typingEnabled: false,
      typingLines: [],
      typingSpeed: 200,
      typingDelay: 1000,
      typingColor: '36BCF7',
      typingCenter: true,
      badges: { openToWork: false, freelance: false, learning: '', building: '' },
      visitorPlacement: 'hidden',
    },
    githubStats: {
      enabled: false,
      username: '',
      theme: 'default',
      hideBorder: false,
      showIcons: true,
      compactMode: false,
      layout: 'default',
    },
    techStack: {
      enabled: false,
      style: 'flat-square',
      iconOnly: false,
      groupByCategory: true,
      selectedIds: [],
    },
    socialLinks: {
      enabled: false,
      style: 'flat-square',
      iconOnly: false,
      platforms: {},
    },
    achievements: {
      enabled: false,
      username: '',
      widgets: {
        trophy: { enabled: false, theme: 'flat' },
        visitor: { enabled: false, color: 'green', style: 'flat' },
        snake: { enabled: false },
        graph: { enabled: false, theme: 'github' },
      },
    },
    featuredProjects: {
      enabled: false,
      projects: [],
      cardStyle: 'modern',
      layout: '2-col',
      sortMode: 'manual',
      badgeStyle: 'flat-square',
      showStars: true,
      showForks: true,
      showLanguage: true,
      showTopics: true,
    },
    standaloneVisitor: {
      enabled: false,
      username: '',
      color: 'green',
      style: 'flat',
    },
    support: {
      enabled: false,
      buyMeACoffeeUsername: '',
      kofiUsername: '',
      style: 'for-the-badge',
    },
    quotes: {
      enabled: false,
      theme: 'radical',
      quoteType: 'programming',
    },
    customMarkdown: {
      enabled: false,
      content: '',
    },
    animatedComponents: {
      enabled: false,
      items: [],
    },
  };

  const detectedSections = new Set<SectionId>();
  const sectionLines = new Map<SectionId, [number, number]>();
  const parsedNodes = new Set<any>(); // Track which AST nodes were processed
  const unsupportedContentBlocks: string[] = [];
  const sectionNameMap: Record<SectionId, string> = {
    header: 'Profile Header',
    about: 'About Me & Skills',
    socials: 'Social Links',
    techStack: 'Tech Stack & Badges',
    stats: 'GitHub Stats',
    achievements: 'GitHub Achievements',
    projects: 'Featured Projects',
    visitor: 'Visitor Counter',
    support: 'Support Me',
    quotes: 'Quotes Card',
    custom: 'Custom Markdown',
    animatedComponents: 'Animated Components',
  };

  const trackLine = (secId: SectionId, node: any) => {
    if (!node || !node.position) return;
    const start = node.position.start.line;
    const end = node.position.end.line;
    const current = sectionLines.get(secId);
    if (current) {
      sectionLines.set(secId, [Math.min(current[0], start), Math.max(current[1], end)]);
    } else {
      sectionLines.set(secId, [start, end]);
    }
  };

  // Helper to test if a URL represents a specific widget
  const isWidgetUrl = (url: string) => {
    return (
      url.includes('github-readme-stats') ||
      url.includes('github-readme-streak-stats') ||
      url.includes('github-profile-trophy') ||
      url.includes('github-readme-activity-graph') ||
      url.includes('github-contribution-grid-snake') ||
      url.includes('readme-typing-svg') ||
      url.includes('komarev.com/ghpvc') ||
      url.includes('visitor-badge') ||
      url.includes('github-readme-quotes') ||
      url.includes('buymeacoffee.com') ||
      url.includes('ko-fi.com')
    );
  };

  // --- GLOBAL NODE SCANNING STAGE ---
  // A. Parse and scan links (strictly mapping anchor URLs to social platform templates)
  const allLinkNodes = findNodes(ast, ['link']);
  const allHtmlNodes = findNodes(ast, ['html']);

  const extractedLinks: { url: string; node: any }[] = [];
  for (const node of allLinkNodes) {
    if (node.url) extractedLinks.push({ url: node.url, node });
  }
  for (const node of allHtmlNodes) {
    const parsed = parseHtmlTags(node.value);
    for (const link of parsed.links) {
      extractedLinks.push({ url: link, node });
    }
  }

  for (const { url, node } of extractedLinks) {
    const urlLower = url.toLowerCase();

    // E. Support
    if (urlLower.includes('buymeacoffee.com') || urlLower.includes('ko-fi.com')) {
      detectedSections.add('support');
      trackLine('support', node);
      parsedNodes.add(node);
      resultData.support.enabled = true;

      if (urlLower.includes('buymeacoffee.com')) {
        const match = url.match(/buymeacoffee\.com\/([^/?#]+)/);
        if (match) resultData.support.buyMeACoffeeUsername = match[1];
      }
      if (urlLower.includes('ko-fi.com')) {
        const match = url.match(/ko-fi\.com\/([^/?#]+)/);
        if (match) resultData.support.kofiUsername = match[1];
      }
      continue;
    }

    if (isWidgetUrl(url)) continue;

    const platform = SOCIAL_PLATFORM_REGISTRY.find((p) => {
      const isTwitter = p.id === 'x' && (urlLower.includes('twitter.com') || urlLower.includes('logo=twitter'));
      return isTwitter || matchesTechOrSocial(url, p.id, p.logo);
    });

    if (platform) {
      detectedSections.add('socials');
      trackLine('socials', node);
      parsedNodes.add(node);
      resultData.socialLinks.enabled = true;

      let val = url;
      if (platform.urlTemplate.includes('{value}')) {
        const prefix = platform.urlTemplate.split('{value}')[0];
        if (url.startsWith(prefix)) {
          val = url.replace(prefix, '');
        } else if (platform.id === 'x' && url.startsWith('https://twitter.com/')) {
          val = url.replace('https://twitter.com/', '');
        }
      }
      resultData.socialLinks.platforms[platform.id] = { enabled: true, value: val };
    }
  }

  // B. Parse and scan images (for widgets and tech badges)
  const allImageNodes = findNodes(ast, ['image']);
  const extractedImages: { url: string; node: any }[] = [];
  for (const node of allImageNodes) {
    if (node.url) extractedImages.push({ url: node.url, node });
  }
  for (const node of allHtmlNodes) {
    const parsed = parseHtmlTags(node.value);
    for (const img of parsed.images) {
      extractedImages.push({ url: img, node });
    }
  }

  for (const { url, node } of extractedImages) {
    const urlLower = url.toLowerCase();

    // Stats Card
    if (urlLower.includes('github-readme-stats') || urlLower.includes('github-readme-streak-stats')) {
      detectedSections.add('stats');
      trackLine('stats', node);
      parsedNodes.add(node);
      resultData.githubStats.enabled = true;

      if (urlLower.includes('github-readme-stats')) {
        const uName = getQueryParam(url, 'username');
        if (uName) resultData.githubStats.username = uName;
        resultData.githubStats.theme = getQueryParam(url, 'theme') || 'default';
        resultData.githubStats.hideBorder = getQueryParam(url, 'hide_border') === 'true';
        resultData.githubStats.showIcons = getQueryParam(url, 'show_icons') === 'true';
        
        if (urlLower.includes('top-langs')) {
          resultData.githubStats.layout = 'languages';
        } else if (getQueryParam(url, 'layout') === 'compact') {
          resultData.githubStats.layout = 'compact';
        }
      }
      if (urlLower.includes('github-readme-streak-stats')) {
        const uName = getQueryParam(url, 'user');
        if (uName && !resultData.githubStats.username) {
          resultData.githubStats.username = uName;
        }
      }
    }
    // Visitor counter
    else if (urlLower.includes('komarev.com/ghpvc') || urlLower.includes('visitor-badge')) {
      detectedSections.add('visitor');
      trackLine('visitor', node);
      parsedNodes.add(node);
      resultData.standaloneVisitor.enabled = true;
      resultData.standaloneVisitor.username = getQueryParam(url, 'username') || '';
      resultData.standaloneVisitor.color = getQueryParam(url, 'color') || 'green';
      resultData.standaloneVisitor.style = getQueryParam(url, 'style') || 'flat';
    }
    // Trophies / Activity graph
    else if (
      urlLower.includes('github-profile-trophy') ||
      urlLower.includes('github-readme-activity-graph') ||
      urlLower.includes('github-contribution-grid-snake.svg')
    ) {
      detectedSections.add('achievements');
      trackLine('achievements', node);
      parsedNodes.add(node);
      resultData.achievements.enabled = true;

      if (urlLower.includes('github-profile-trophy')) {
        resultData.achievements.widgets.trophy.enabled = true;
        resultData.achievements.widgets.trophy.theme = getQueryParam(url, 'theme') || 'flat';
        const uName = getQueryParam(url, 'username');
        if (uName) resultData.achievements.username = uName;
      }
      if (urlLower.includes('github-readme-activity-graph')) {
        resultData.achievements.widgets.graph.enabled = true;
        resultData.achievements.widgets.graph.theme = getQueryParam(url, 'theme') || 'github';
        const uName = getQueryParam(url, 'username');
        if (uName && !resultData.achievements.username) {
          resultData.achievements.username = uName;
        }
      }
      if (urlLower.includes('github-contribution-grid-snake')) {
        resultData.achievements.widgets.snake.enabled = true;
      }
    }
    // Quotes Card
    else if (urlLower.includes('github-readme-quotes')) {
      detectedSections.add('quotes');
      trackLine('quotes', node);
      parsedNodes.add(node);
      resultData.quotes.enabled = true;
      resultData.quotes.theme = getQueryParam(url, 'theme') || 'radical';
    }
    // Tech Stack Badges
    else if (!isWidgetUrl(url) && TECHNOLOGY_REGISTRY.some((t) => matchesTechOrSocial(url, t.id, t.logo || ''))) {
      const tech = TECHNOLOGY_REGISTRY.find((t) => matchesTechOrSocial(url, t.id, t.logo || ''));
      if (tech) {
        detectedSections.add('techStack');
        trackLine('techStack', node);
        parsedNodes.add(node);
        resultData.techStack.enabled = true;

        if (!resultData.techStack.selectedIds.includes(tech.id)) {
          resultData.techStack.selectedIds.push(tech.id);
        }

        const style = getQueryParam(url, 'style');
        if (style) {
          resultData.techStack.style = style as any;
        }
      }
    }
    // Social Links Badges (to extract style)
    else if (!isWidgetUrl(url) && SOCIAL_PLATFORM_REGISTRY.some((p) => {
      const isTwitter = p.id === 'x' && (urlLower.includes('twitter.com') || urlLower.includes('logo=twitter'));
      return isTwitter || matchesTechOrSocial(url, p.id, p.logo);
    })) {
      const style = getQueryParam(url, 'style');
      if (style) {
        resultData.socialLinks.style = style as any;
      }
    }
  }

  // --- SEGMENT SCANNING STAGE: PROJECTS, ABOUT, HEADER ---
  for (let idx = 0; idx < segments.length; idx++) {
    const seg = segments[idx];
    const headingText = seg.headingNode ? toString(seg.headingNode).trim() : '';
    const headingTextLower = headingText.toLowerCase();
    const segmentText = (seg.headingNode ? toString(seg.headingNode) + '\n' : '') + toString({ type: 'root', children: seg.nodes });

    const mediaUrls: string[] = [];
    const linkUrls: string[] = [];

    const allSegmentNodes = [...(seg.headingNode ? [seg.headingNode] : []), ...seg.nodes];
    for (const node of allSegmentNodes) {
      const imageNodes = findNodes(node, ['image']);
      for (const img of imageNodes) {
        if (img.url) mediaUrls.push(img.url);
      }

      const linkNodes = findNodes(node, ['link']);
      for (const lnk of linkNodes) {
        if (lnk.url) linkUrls.push(lnk.url);
      }

      const htmlNodes = findNodes(node, ['html']);
      for (const html of htmlNodes) {
        const parsed = parseHtmlTags(html.value);
        mediaUrls.push(...parsed.images);
        linkUrls.push(...parsed.links);
      }
    }

    let isMatchedSegment = false;

    // A. Projects
    if (headingTextLower.includes('project') || headingTextLower.includes('portfolio') || headingTextLower.includes('repos')) {
      detectedSections.add('projects');
      trackLine('projects', seg.headingNode);
      if (seg.headingNode) parsedNodes.add(seg.headingNode);
      resultData.featuredProjects.enabled = true;
      isMatchedSegment = true;

      const listItems = findNodes({ type: 'root', children: seg.nodes }, ['listItem']);
      for (const item of listItems) {
        trackLine('projects', item);
        parsedNodes.add(item);
        const linksInItem = findNodes(item, ['link']);
        const ghLink = linksInItem.find((l) => l.url?.includes('github.com/'));
        if (ghLink) {
          const match = ghLink.url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
          if (match) {
            const rName = match[2].replace(/\/$/, '');
            const fullText = toString(item).trim();
            const linkText = toString(ghLink);
            const desc = fullText.replace(linkText, '').replace(/^[\s—\-:]+/, '').trim();

            resultData.featuredProjects.projects.push({
              id: Math.random().toString(36).substr(2, 9),
              source: 'github',
              repoName: rName,
              title: linkText || rName,
              repoUrl: ghLink.url,
              description: desc,
              stars: 0,
              forks: 0,
            });
          }
        }
      }

      // Check GPRM pinned image cards
      const imagesInSegment = findNodes({ type: 'root', children: seg.nodes }, ['image', 'html']);
      for (const imgNode of imagesInSegment) {
        const urls = imgNode.type === 'image' ? [imgNode.url] : parseHtmlTags(imgNode.value).images;
        for (const u of urls) {
          if (u.includes('github-readme-stats') && u.includes('pin/')) {
            parsedNodes.add(imgNode);
            const repoParam = getQueryParam(u, 'repo');
            const usernameParam = getQueryParam(u, 'username');
            if (repoParam && usernameParam) {
              resultData.featuredProjects.projects.push({
                id: Math.random().toString(36).substr(2, 9),
                source: 'github',
                repoName: repoParam,
                title: repoParam,
                repoUrl: `https://github.com/${usernameParam}/${repoParam}`,
                stars: 0,
                forks: 0,
              });
            }
          }
        }
      }
    }
    // B. Header (Banner, greeting details)
    else if (
      mediaUrls.some((u) => u.includes('capsule-render') || u.includes('readme-typing-svg')) ||
      headingTextLower.includes('hi ') ||
      headingTextLower.includes('hello') ||
      headingTextLower.includes('welcome') ||
      (idx === 0 && (segmentText.toLowerCase().includes("hi 👋") || segmentText.toLowerCase().includes("i'm") || segmentText.toLowerCase().includes("i am") || segmentText.toLowerCase().includes("welcome")))
    ) {
      detectedSections.add('header');
      trackLine('header', seg.headingNode);
      if (seg.headingNode) parsedNodes.add(seg.headingNode);
      resultData.header.enabled = true;
      isMatchedSegment = true;

      for (const child of seg.nodes) {
        const childImages = findNodes(child, ['image', 'html']);
        for (const img of childImages) {
          const urls = img.type === 'image' ? [img.url] : parseHtmlTags(img.value).images;
          for (const u of urls) {
            if (u.includes('capsule-render')) {
              parsedNodes.add(img);
              const type = getQueryParam(u, 'type');
              resultData.header.bannerType = type === 'waving' ? 'capsule' : type === 'soft' ? 'wave' : 'gradient';
              resultData.header.bannerTheme = getQueryParam(u, 'color') || 'default';
              resultData.header.bannerText = getQueryParam(u, 'text') || '';
            }
            if (u.includes('readme-typing-svg')) {
              parsedNodes.add(img);
              resultData.header.typingEnabled = true;
              const linesStr = getQueryParam(u, 'lines');
              if (linesStr) {
                resultData.header.typingLines = linesStr.split(';').map((line) => decodeURIComponent(line));
              }
              resultData.header.typingColor = getQueryParam(u, 'color') || '36BCF7';
              resultData.header.typingCenter = getQueryParam(u, 'center') === 'true';
              resultData.header.typingSpeed = parseInt(getQueryParam(u, 'speed') || '200', 10);
              resultData.header.typingDelay = parseInt(getQueryParam(u, 'pause') || '1000', 10);
            }
          }
        }
      }

      const greetingMatch = segmentText.match(/(?:Hi 👋, I'm|Hello, I'm|I am|I'm)\s+([^<\n\r]+)/i);
      if (greetingMatch) {
        let rawName = greetingMatch[1].trim().replace(/^#+\s+/, '');
        const pronounsMatch = rawName.match(/\(([^)]+)\)/);
        if (pronounsMatch) {
          resultData.header.pronouns = pronounsMatch[1];
          rawName = rawName.replace(/\(([^)]+)\)/, '').trim();
        }
        resultData.header.name = rawName;
        resultData.name = rawName;
      }

      const locationMatch = segmentText.match(/(?:based in|Based in)\s+([^<\n\r]+)/i);
      if (locationMatch) {
        resultData.header.location = locationMatch[1].trim();
      }

      const titleMatch = segmentText.match(/(?:Software Engineer|Frontend Architect|Backend Engineer|Full Stack Developer|Developer|Architect|Designer|Student)/i);
      if (titleMatch) {
        resultData.header.title = titleMatch[0].trim();
        resultData.role = titleMatch[0].trim();
      }
    }
    // C. About Me Bio
    else if (headingTextLower.includes('about') || headingTextLower.includes('bio') || headingTextLower.includes('introduction')) {
      detectedSections.add('about');
      trackLine('about', seg.headingNode);
      if (seg.headingNode) parsedNodes.add(seg.headingNode);
      resultData.about = seg.nodes
        .filter((n) => n.type === 'paragraph')
        .map((n) => {
          parsedNodes.add(n);
          return toString(n).trim();
        })
        .filter(Boolean)
        .join('\n\n');
      isMatchedSegment = true;
    }

    // D. Header subheadings lookahead (helps resolve sub-headings containing title/location/pronouns)
    if (resultData.header.enabled) {
      if (!resultData.header.title) {
        const titleMatch = segmentText.match(/(?:Software Engineer|Frontend Architect|Backend Engineer|Full Stack Developer|Developer|Architect|Designer|Student)/i);
        if (titleMatch) {
          resultData.header.title = titleMatch[0].trim();
          resultData.role = titleMatch[0].trim();
          if (seg.headingNode) parsedNodes.add(seg.headingNode);
        }
      }
      if (!resultData.header.location) {
        const locationMatch = segmentText.match(/(?:based in|Based in)\s+([^<\n\r]+)/i);
        if (locationMatch) {
          resultData.header.location = locationMatch[1].trim();
          if (seg.headingNode) parsedNodes.add(seg.headingNode);
        }
      }
    }

    if (isMatchedSegment) {
      for (const node of seg.nodes) {
        parsedNodes.add(node);
      }
    }
  }

  // --- CLEANUP AND FALLBACK TO CUSTOM MARKDOWN ---
  let isGroupingCustom = false;
  let customStartOffset = 0;
  let customEndOffset = 0;

  for (const child of ast.children) {
    const hasChildren = 'children' in child && Array.isArray((child as any).children);
    const isNodeParsed = parsedNodes.has(child) || (hasChildren && (child as any).children.every((c: any) => parsedNodes.has(c)));
    if (!isNodeParsed) {
      const start = child.position?.start?.offset ?? 0;
      const end = child.position?.end?.offset ?? markdown.length;

      if (!isGroupingCustom) {
        isGroupingCustom = true;
        customStartOffset = start;
        customEndOffset = end;
      } else {
        customEndOffset = Math.max(customEndOffset, end);
      }
    } else {
      if (isGroupingCustom) {
        const slice = markdown.slice(customStartOffset, customEndOffset).trim();
        if (slice) {
          unsupportedContentBlocks.push(slice);
        }
        isGroupingCustom = false;
      }
    }
  }
  if (isGroupingCustom) {
    const slice = markdown.slice(customStartOffset, customEndOffset).trim();
    if (slice) {
      unsupportedContentBlocks.push(slice);
    }
  }

  if (unsupportedContentBlocks.length > 0) {
    resultData.customMarkdown.content = unsupportedContentBlocks.join('\n\n');
    resultData.customMarkdown.enabled = true;
    detectedSections.add('custom');
  }

  // 5. Build final analysis reports
  const enabledSections = Array.from(detectedSections);
  const analysisSections: DetectedSectionInfo[] = [];

  for (const secId of enabledSections) {
    const lineRange = sectionLines.get(secId) || [1, ast.children[ast.children.length - 1]?.position?.end?.line || 1];
    let status: 'Imported' | 'Unsupported' | 'Partial' = 'Imported';
    if (secId === 'custom') {
      status = 'Unsupported';
    } else if (secId === 'projects' && resultData.featuredProjects.projects.length === 0) {
      status = 'Partial';
    }

    analysisSections.push({
      id: sectionNameMap[secId] || secId,
      sectionId: secId,
      name: sectionNameMap[secId] || secId,
      confidence: secId === 'custom' ? 100 : 95,
      lines: lineRange,
      status,
      details: secId === 'custom' ? 'Preserved custom layout markup.' : undefined,
    });
  }

  return {
    detectedSections: enabledSections,
    analysis: {
      sections: analysisSections,
      totalDetected: analysisSections.length,
    },
    data: resultData,
  };
}
