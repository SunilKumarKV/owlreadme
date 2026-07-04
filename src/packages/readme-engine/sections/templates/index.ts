import type { READMEData } from '../../types';

export const renderTemplates = (data: READMEData): string => {
  const template = data.template || 'minimal';

  const avatarMarkdown = data.avatarUrl
    ? `<p align="center">\n  <img src="${data.avatarUrl}" alt="Avatar" width="120" height="120" style="border-radius: 50%;" />\n</p>`
    : '';

  const statsMarkdown = (data.followers !== undefined && data.following !== undefined && data.publicRepos !== undefined)
    ? `<p align="center">\n  👥 <b>Followers:</b> ${data.followers} | 👥 <b>Following:</b> ${data.following} | 📦 <b>Repos:</b> ${data.publicRepos}\n</p>`
    : '';

  switch (template) {
    case 'professional':
      return [
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

    case 'developer':
      return [
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

    case 'open-source':
      return [
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

    case 'portfolio':
      return [
        avatarMarkdown,
        data.name ? `# ✨ ${data.name} - Portfolio` : '',
        data.role ? `*${data.role}*` : '',
        statsMarkdown,
        '---',
        data.projects ? `### 🌐 Featured Work\n${data.projects}` : '',
        data.about || data.skills ? `### 🎨 About & Skills\n${[data.about, data.skills].filter(Boolean).join('\n\n')}` : '',
        data.socials ? `### 🔗 Links & Contact\n${data.socials}` : '',
      ].filter(Boolean).join('\n\n');

    case 'minimal':
    default:
      return [
        avatarMarkdown,
        data.name ? `# ${data.name}` : '',
        data.role ? `## ${data.role}` : '',
        statsMarkdown,
        data.about ? data.about : '',
        data.skills ? `### Skills\n${data.skills}` : '',
        data.projects ? `### Projects\n${data.projects}` : '',
        data.socials ? `### Socials\n${data.socials}` : '',
      ].filter(Boolean).join('\n\n');
  }
};
