import { READMEStyleTemplate, GitHubStatsConfig } from '@/stores/readme-store';

export interface READMEData {
  name?: string;
  role?: string;
  about?: string;
  skills?: string;
  projects?: string;
  socials?: string;
  avatarUrl?: string;
  followers?: number;
  following?: number;
  publicRepos?: number;
  template?: READMEStyleTemplate;
  githubStats?: GitHubStatsConfig;
}

export interface RoadmapData {
  title?: string;
  steps?: string[];
}

export function generateGithubStatsMarkdown(stats?: GitHubStatsConfig): string {
  if (!stats || !stats.enabled || !stats.username) return '';
  const { username, theme, hideBorder, showIcons, compactMode, layout, cardOrder, cardConfigs } = stats;
  
  const themeParam = theme && theme !== 'default' ? `&theme=${theme}` : '';
  const borderParam = hideBorder ? '&hide_border=true' : '';
  const iconsParam = showIcons ? '&show_icons=true' : '';
  
  const statsMarkdownBlocks: string[] = [];
  cardOrder.forEach((cardId) => {
    if (cardConfigs[cardId]?.enabled) {
      if (cardId === 'stats') {
        const layoutParam = layout === 'compact' ? '&layout=compact' : '';
        statsMarkdownBlocks.push(
          `<img src="https://github-readme-stats.vercel.app/api?username=${username}${themeParam}${borderParam}${iconsParam}${layoutParam}" alt="GitHub Stats" />`
        );
      } else if (cardId === 'languages') {
        const compactParam = compactMode ? '&layout=compact' : '';
        statsMarkdownBlocks.push(
          `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}${themeParam}${borderParam}${compactParam}" alt="Top Languages" />`
        );
      } else if (cardId === 'streak') {
        statsMarkdownBlocks.push(
          `<img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}${themeParam}${borderParam}" alt="GitHub Streak" />`
        );
      }
    }
  });
  
  if (statsMarkdownBlocks.length === 0) return '';
  
  return [
    '### 📊 GitHub Stats',
    '<p align="center">',
    statsMarkdownBlocks.map((block) => `  ${block}`).join('\n  &nbsp;&nbsp;\n'),
    '</p>',
  ].join('\n');
}

export function generateReadmeMarkdown(data: READMEData): string {
  const template = data.template || 'minimal';

  const avatarMarkdown = data.avatarUrl
    ? `<p align="center">\n  <img src="${data.avatarUrl}" alt="Avatar" width="120" height="120" style="border-radius: 50%;" />\n</p>`
    : '';

  const statsMarkdown = (data.followers !== undefined && data.following !== undefined && data.publicRepos !== undefined)
    ? `<p align="center">\n  👥 <b>Followers:</b> ${data.followers} | 👥 <b>Following:</b> ${data.following} | 📦 <b>Repos:</b> ${data.publicRepos}\n</p>`
    : '';

  let body = '';
  switch (template) {
    case 'professional':
      body = [
        avatarMarkdown,
        data.name ? `# ${data.name}` : '',
        data.role ? `### *${data.role}*` : '',
        statsMarkdown,
        '---',
        data.about ? `### 🎯 About Me\n${data.about}` : '',
        data.skills ? `### 🛠️ Skills\n${data.skills}` : '',
        data.projects ? `### 📂 Featured Projects\n${data.projects}` : '',
        data.socials ? `### 🌐 Socials & Contact\n${data.socials}` : '',
      ].filter(Boolean).join('\n\n');
      break;

    case 'developer':
      body = [
        avatarMarkdown,
        data.name ? `# 💻 ${data.name}` : '',
        data.role ? `> ${data.role}` : '',
        statsMarkdown,
        '---',
        data.skills ? `### 🚀 Tech Stack & Skills\n${data.skills}` : '',
        data.about ? `### 🌟 Profile\n${data.about}` : '',
        data.projects ? `### 📂 Projects & Codebases\n${data.projects}` : '',
        data.socials ? `### 📨 Connect with Me\n${data.socials}` : '',
      ].filter(Boolean).join('\n\n');
      break;

    case 'open-source':
      body = [
        avatarMarkdown,
        data.name ? `# 🤝 ${data.name} | Open Source` : '',
        data.role ? `**${data.role}**` : '',
        statsMarkdown,
        '---',
        data.projects ? `### 📦 Open Source Contributions & Repositories\n${data.projects}` : '',
        data.about ? `### 🌟 About Me\n${data.about}` : '',
        data.skills ? `### 🛠️ Core Skills\n${data.skills}` : '',
        data.socials ? `### 💬 Collaboration & Get in touch\n${data.socials}` : '',
      ].filter(Boolean).join('\n\n');
      break;

    case 'portfolio':
      body = [
        avatarMarkdown,
        data.name ? `# ✨ ${data.name} - Portfolio` : '',
        data.role ? `*${data.role}*` : '',
        statsMarkdown,
        '---',
        data.projects ? `### 🌐 Featured Work\n${data.projects}` : '',
        data.about || data.skills ? `### 🎨 About & Skills\n${[data.about, data.skills].filter(Boolean).join('\n\n')}` : '',
        data.socials ? `### 🔗 Links & Contact\n${data.socials}` : '',
      ].filter(Boolean).join('\n\n');
      break;

    case 'minimal':
    default:
      body = [
        avatarMarkdown,
        data.name ? `# ${data.name}` : '',
        data.role ? `## ${data.role}` : '',
        statsMarkdown,
        data.about ? data.about : '',
        data.skills ? `### Skills\n${data.skills}` : '',
        data.projects ? `### Projects\n${data.projects}` : '',
        data.socials ? `### Socials\n${data.socials}` : '',
      ].filter(Boolean).join('\n\n');
      break;
  }

  const githubStatsMarkdown = generateGithubStatsMarkdown(data.githubStats);
  if (githubStatsMarkdown) {
    return [body, githubStatsMarkdown].filter(Boolean).join('\n\n');
  }

  return body;
}

export function generateRoadmapMarkdown(data: RoadmapData): string {
  const steps = data.steps || [];
  const validSteps = steps.filter((step) => step.trim() !== '');
  return [
    data.title ? `# ${data.title}` : '',
    validSteps.length ? validSteps.map((step, index) => `${index + 1}. ${step}`).join('\n') : '',
  ].filter(Boolean).join('\n\n');
}

export function combineMarkdown(readme: string, roadmap: string): string {
  return [readme, roadmap].filter(Boolean).join('\n\n');
}
