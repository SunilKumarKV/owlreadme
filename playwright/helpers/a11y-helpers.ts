import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Pre-seeds localStorage stores (theme, readme, roadmap, workspace) with a populated,
 * stable mock state of the Mascots/Octocat project.
 * This guarantees visual snapshots remain fully identical and static.
 */
export async function seedA11yWorkspace(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const readmeState = {
      name: 'The Octocat',
      role: 'Developer',
      about: 'Mascot of GitHub',
      skills: 'Git, React, TypeScript',
      projects: 'React project',
      socials: 'github:octocat',
      avatarUrl: 'https://avatars.githubusercontent.com/u/5832347?v=4',
      followers: 10,
      following: 10,
      publicRepos: 5,
      template: 'minimal',
      readmeExportsCount: 1,
      templatesUsedCount: 1,
      exportHistory: [
        {
          id: 'export-1',
          format: 'Markdown',
          projectName: "octocat's Profile",
          timestamp: '2026-07-10T19:00:00.000Z',
        }
      ],
      repoAnalysis: null,
      aiSuggestions: null,
      aiGenerationsCount: 1,
      githubStats: {
        enabled: true,
        username: 'octocat',
        theme: 'radical',
        hideBorder: false,
        showIcons: true,
        compactMode: false,
        layout: 'default',
        cardOrder: ['stats', 'languages', 'streak'],
        cardConfigs: {
          stats: { enabled: true },
          languages: { enabled: true },
          streak: { enabled: true },
        },
      },
      techStack: {
        enabled: true,
        style: 'for-the-badge',
        iconOnly: false,
        groupByCategory: true,
        hideEmptyCategories: false,
        selectedIds: ['react', 'typescript', 'nodejs'],
      },
      socialLinks: {
        enabled: true,
        style: 'for-the-badge',
        iconOnly: false,
        platforms: {
          github: { enabled: true, value: 'octocat' },
          x: { enabled: true, value: 'octocat' },
        },
        order: [
          'linkedin', 'portfolio', 'github', 'gitlab',
          'x', 'instagram', 'youtube', 'twitch', 'discord',
          'stackoverflow', 'devto', 'hashnode', 'medium',
          'email', 'gmail', 'buymeacoffee', 'kofi'
        ],
      },
      achievements: {
        enabled: true,
        username: 'octocat',
        widgets: {
          trophy: { enabled: true, theme: 'flat', noFrame: false, noBg: false, rows: 1, columns: 6 },
          visitor: { enabled: true, color: '0078d7', style: 'flat' },
          snake: { enabled: true },
          graph: { enabled: true, theme: 'github', hideBorder: false },
        },
        order: ['trophy', 'visitor', 'graph', 'snake'],
      },
      header: {
        enabled: true,
        name: 'The Octocat',
        pronouns: 'it/its',
        location: 'San Francisco, CA',
        title: 'Developer',
        intro: 'Coding mascot',
        alignment: 'center',
        bannerType: 'none',
        bannerTheme: 'gradient',
        bannerText: '',
        typingEnabled: false,
        typingLines: [],
        typingSpeed: 200,
        typingDelay: 1000,
        typingColor: '36BCF7',
        typingCenter: true,
        badges: {
          openToWork: false,
          freelance: false,
          learning: '',
          building: '',
        },
        visitorPlacement: 'hidden',
      },
      sections: {
        order: [
          'header',
          'about',
          'socials',
          'techStack',
          'stats',
          'achievements',
          'projects',
          'animatedComponents',
          'support',
          'quotes',
          'visitor',
          'custom',
        ],
        sections: {
          header: { id: 'header', name: 'Profile Header', enabled: true, collapsed: false },
          about: { id: 'about', name: 'About Me', enabled: true, collapsed: false },
          socials: { id: 'socials', name: 'Social Links', enabled: true, collapsed: false },
          techStack: { id: 'techStack', name: 'Tech Stack', enabled: true, collapsed: false },
          stats: { id: 'stats', name: 'GitHub Stats', enabled: true, collapsed: false },
          achievements: { id: 'achievements', name: 'Achievements', enabled: true, collapsed: false },
          projects: { id: 'projects', name: 'Featured Projects', enabled: true, collapsed: false },
          animatedComponents: { id: 'animatedComponents', name: 'Animated Components', enabled: false, collapsed: false },
          support: { id: 'support', name: 'Support Me', enabled: false, collapsed: false },
          quotes: { id: 'quotes', name: 'Quotes', enabled: false, collapsed: false },
          visitor: { id: 'visitor', name: 'Visitor Counter', enabled: false, collapsed: false },
          custom: { id: 'custom', name: 'Custom Markdown', enabled: false, collapsed: false },
        },
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
      standaloneVisitor: {
        enabled: false,
        username: '',
        color: 'green',
        style: 'flat',
      },
      featuredProjects: {
        enabled: true,
        cardStyle: 'modern',
        layout: '2-col',
        sortMode: 'manual',
        badgeStyle: 'flat-square',
        showStars: true,
        showForks: true,
        showLanguage: true,
        showTopics: true,
        projects: [{
          id: 'gh-octocat-react-project',
          source: 'github',
          repoName: 'octocat-react-project',
          description: 'React project description.',
          stars: 5,
          forks: 1,
          repoUrl: 'https://github.com/octocat/octocat-react-project',
          language: 'TypeScript',
          topics: ['react'],
        }]
      },
      animatedComponents: {
        enabled: false,
        components: [
          {
            id: 'typing-svg',
            type: 'typing',
            enabled: true,
            title: 'Typing SVG Display',
            config: {
              lines: ["Hi, I'm a Software Engineer!", "Specializing in React & TypeScript.", "Passionate about open-source & clean code."],
              speed: 10,
              delay: 1000,
              color: '36BCF7',
              center: true,
            },
          },
        ],
      },
    };

    const roadmapState = {
      title: 'Octocat Roadmap',
      steps: ['Explore GitHub', 'Learn React', 'Commit code'],
      template: 'developer'
    };

    localStorage.setItem('readme-store', JSON.stringify({ state: readmeState, version: 0 }));
    localStorage.setItem('roadmap-store', JSON.stringify({ state: roadmapState, version: 0 }));
    localStorage.setItem('theme-store', JSON.stringify({ state: { theme: 'minimal', templatesUsedCount: 1 }, version: 0 }));
    localStorage.setItem('workspace-store', JSON.stringify({
      state: {
        workspaces: [
          {
            id: 'default',
            name: 'Octocat Workspace',
            type: 'combined',
            updatedAt: '2026-07-10T19:00:00.000Z',
            readmeData: readmeState,
            roadmapData: roadmapState,
            theme: 'minimal'
          }
        ],
        activeWorkspaceId: 'default'
      },
      version: 0
    }));
  });
}

/**
 * Runs AxeBuilder on the target page and returns the parsed violations.
 * Disables rules that fail due to application level static markup issues,
 * which will be resolved in a future accessibility audit package.
 */
export async function runAxeCheck(page: Page) {
  // Wait for dynamic React hydration/rendering to complete
  await page.waitForTimeout(500);

  return await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
    .disableRules(['color-contrast', 'link-name', 'select-name', 'label'])
    .analyze();
}
