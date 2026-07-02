import { useState } from 'react';
import useReadmeStore from '@/stores/readme-store';

export const useExportActions = (localMarkdown: string) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      useReadmeStore.getState().incrementReadmeExports();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([localMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    useReadmeStore.getState().incrementReadmeExports();
  };

  const handleExportConfig = () => {
    const state = useReadmeStore.getState();
    const configData = {
      name: state.name,
      role: state.role,
      about: state.about,
      skills: state.skills,
      projects: state.projects,
      socials: state.socials,
      avatarUrl: state.avatarUrl,
      template: state.template,
      githubStats: state.githubStats,
      techStack: state.techStack,
      socialLinks: state.socialLinks,
      achievements: state.achievements,
      header: state.header,
      sections: state.sections,
      support: state.support,
      quotes: state.quotes,
      customMarkdown: state.customMarkdown,
      standaloneVisitor: state.standaloneVisitor,
      featuredProjects: state.featuredProjects,
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owlreadme-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.sections || !parsed.sections.sections) {
          alert('Invalid config file format.');
          return;
        }
        useReadmeStore.setState({
          ...parsed,
        });
        alert('Configuration imported successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to parse config file.');
      }
    };
    reader.readAsText(file);
  };

  return {
    copied,
    handleCopy,
    handleDownload,
    handleExportConfig,
    handleImportConfig,
  };
};
