import { generateREADME, READMEData, READMEStyleTemplate } from '@/packages/readme-engine';
import { GitHubUserProfile, GitHubRepository } from '@/types/github';
import { validateGeneratedReadme, ReadmeValidationResult } from './ReadmeValidation';

export interface ReadmeGeneratorOptions {
  profile?: GitHubUserProfile | null;
  repositories?: GitHubRepository[];
  storeState?: Partial<READMEData>;
  template?: string;
}

export class ReadmeGenerator {
  /**
   * Transforms live GitHub data and state into a complete READMEData payload.
   */
  public static createPayload(options: ReadmeGeneratorOptions): READMEData {
    const { profile, repositories = [], storeState = {} } = options;

    const username = profile?.login || storeState.githubStats?.username || '';
    const name = profile?.name || profile?.login || storeState.name || '';
    const role = storeState.role || (profile?.company ? `Developer at ${profile.company}` : 'Software Developer');
    const about = profile?.bio || storeState.about || '';
    const avatarUrl = profile?.avatarUrl || storeState.avatarUrl || '';

    // Convert live GitHub repositories into featured project list if not explicitly customized
    const liveProjects = repositories.slice(0, 6).map((repo) => ({
      id: String(repo.id),
      source: 'github' as const,
      repoName: repo.name,
      title: repo.name,
      description: repo.description || '',
      language: repo.language || '',
      stars: repo.stars,
      forks: repo.forks,
      topics: repo.topics,
      repoUrl: repo.htmlUrl,
      updatedAt: repo.updatedAt,
      pinned: repo.isPinned || false,
    }));

    const payload: READMEData = {
      name,
      role,
      about,
      avatarUrl,
      followers: profile?.followers,
      following: profile?.following,
      publicRepos: profile?.publicRepos,
      template: (options.template || storeState.template || 'minimal') as READMEStyleTemplate,
      githubStats: {
        enabled: true,
        username,
        theme: 'dark',
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
        ...storeState.githubStats,
      },
      header: {
        enabled: true,
        name,
        pronouns: '',
        location: profile?.location || '',
        title: role,
        intro: about,
        alignment: 'center',
        bannerType: 'none',
        bannerTheme: 'dark',
        bannerText: '',
        typingEnabled: false,
        typingLines: [],
        typingSpeed: 50,
        typingDelay: 1000,
        typingColor: '#3B82F6',
        typingCenter: true,
        badges: {
          openToWork: false,
          freelance: false,
          learning: '',
          building: '',
        },
        visitorPlacement: 'hidden',
        ...storeState.header,
      },
      featuredProjects: {
        enabled: liveProjects.length > 0,
        projects: storeState.featuredProjects?.projects?.length ? storeState.featuredProjects.projects : liveProjects,
        cardStyle: 'modern',
        layout: '2-col',
        sortMode: 'stars',
        badgeStyle: 'flat',
        showStars: true,
        showForks: true,
        showLanguage: true,
        showTopics: true,
        ...storeState.featuredProjects,
      },
      socialLinks: {
        enabled: true,
        style: 'for-the-badge',
        iconOnly: false,
        platforms: {
          ...(profile?.blog ? { website: { enabled: true, value: profile.blog } } : {}),
          ...(profile?.twitterUsername ? { twitter: { enabled: true, value: profile.twitterUsername } } : {}),
          ...(profile?.email ? { email: { enabled: true, value: profile.email } } : {}),
          ...(storeState.socialLinks?.platforms || {}),
        },
        order: ['website', 'twitter', 'email', 'linkedin', 'github'],
        ...storeState.socialLinks,
      },
      techStack: storeState.techStack,
      sections: storeState.sections,
      support: storeState.support,
      customMarkdown: storeState.customMarkdown,
      animatedComponents: storeState.animatedComponents,
    };

    return payload;
  }

  /**
   * Generates formatted markdown string from options and validates the result.
   */
  public static generate(options: ReadmeGeneratorOptions): { markdown: string; validation: ReadmeValidationResult } {
    const payload = this.createPayload(options);
    const rawMarkdown = generateREADME(payload);
    const validation = validateGeneratedReadme(rawMarkdown);

    return {
      markdown: validation.sanitizedMarkdown,
      validation,
    };
  }
}

export default ReadmeGenerator;
