import { useEffect, useState } from 'react';
import useWorkspaceStore from '@/stores/workspace-store';
import useReadmeStore from '@/stores/readme-store';

export const useBuilderActions = () => {
  const { createWorkspace, setActiveWorkspaceId } = useWorkspaceStore();
  const { applyTemplate } = useReadmeStore();

  const [activeBuilderTab, setActiveBuilderTab] = useState<'editor' | 'marketplace' | 'community' | 'analyzer' | 'improver'>('editor');
  
  // Search input for filtering README section builders
  const [sectionsSearchQuery, setSectionsSearchQuery] = useState('');

  // Tech Stack searches
  const [techSearch, setTechSearch] = useState('');
  const [activeTechCategory, setActiveTechCategory] = useState<'All' | 'Languages' | 'Frontend' | 'Backend' | 'Database' | 'DevOps & Cloud' | 'Tools'>('All');
  
  // Social links search
  const [socialSearch, setSocialSearch] = useState('');

  // Template Marketplace States
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [selectedMarketplaceCategory, setSelectedMarketplaceCategory] = useState<string>('all');
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  const [recentlyUsedTemplates, setRecentlyUsedTemplates] = useState<string[]>([]);
  const [previewingTemplate, setPreviewingTemplate] = useState<any | null>(null);

  // Community Templates States
  const [communitySearch, setCommunitySearch] = useState('');
  const [selectedCommunityCategory, setSelectedCommunityCategory] = useState<string>('all');
  const [activeCollection, setActiveCollection] = useState<'all' | 'trending' | 'picks' | 'favorites' | 'recents'>('all');
  const [previewingCommunityTemplate, setPreviewingCommunityTemplate] = useState<any | null>(null);

  // Animated README Components States
  const [animatedSearch, setAnimatedSearch] = useState('');
  const [animatedCategory, setAnimatedCategory] = useState<'all' | 'headers' | 'dividers' | 'widgets'>('all');
  const [activeEditingCompId, setActiveEditingCompId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favs = localStorage.getItem('owlreadme-fav-templates');
      if (favs) setFavoriteTemplates(JSON.parse(favs));
      
      const recents = localStorage.getItem('owlreadme-recent-templates');
      if (recents) setRecentlyUsedTemplates(JSON.parse(recents));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewingTemplate(null);
        setPreviewingCommunityTemplate(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = favoriteTemplates.includes(id)
      ? favoriteTemplates.filter((fid) => fid !== id)
      : [...favoriteTemplates, id];
    setFavoriteTemplates(updated);
    localStorage.setItem('owlreadme-fav-templates', JSON.stringify(updated));
  };

  const applyMarketplaceTemplate = (tpl: any) => {
    applyTemplate(tpl);
    const updatedRecents = [tpl.id, ...recentlyUsedTemplates.filter((id) => id !== tpl.id)].slice(0, 4);
    setRecentlyUsedTemplates(updatedRecents);
    localStorage.setItem('owlreadme-recent-templates', JSON.stringify(updatedRecents));
  };

  const duplicateTemplateToWorkspace = (tpl: any) => {
    const name = prompt(`Enter name for duplicated template workspace:`, `${tpl.name} Workspace`);
    if (name && name.trim()) {
      const wsId = createWorkspace(name.trim(), 'readme');
      setActiveWorkspaceId(wsId);
      applyTemplate(tpl);
      alert(`Duplicated template to new workspace "${name.trim()}" successfully!`);
    }
  };

  return {
    activeBuilderTab,
    setActiveBuilderTab,
    sectionsSearchQuery,
    setSectionsSearchQuery,
    techSearch,
    setTechSearch,
    activeTechCategory,
    setActiveTechCategory,
    socialSearch,
    setSocialSearch,
    marketplaceSearch,
    setMarketplaceSearch,
    selectedMarketplaceCategory,
    setSelectedMarketplaceCategory,
    favoriteTemplates,
    recentlyUsedTemplates,
    previewingTemplate,
    setPreviewingTemplate,
    toggleFavorite,
    applyMarketplaceTemplate,
    duplicateTemplateToWorkspace,
    communitySearch,
    setCommunitySearch,
    selectedCommunityCategory,
    setSelectedCommunityCategory,
    activeCollection,
    setActiveCollection,
    previewingCommunityTemplate,
    setPreviewingCommunityTemplate,
    animatedSearch,
    setAnimatedSearch,
    animatedCategory,
    setAnimatedCategory,
    activeEditingCompId,
    setActiveEditingCompId,
  };
};
