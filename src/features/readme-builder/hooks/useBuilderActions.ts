/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { useEffect, useState } from 'react';
import useWorkspaceStore from '@/stores/workspace-store';
import useReadmeStore from '@/stores/readme-store';
import type { MarketplaceTemplate } from '@/utils/template-registry';
import type { AnimatedCategory, TechCategory } from '../types/builder-types';

export const useBuilderActions = () => {
  const { createWorkspace, setActiveWorkspaceId } = useWorkspaceStore();
  const { applyTemplate } = useReadmeStore();

  const [activeBuilderTab, setActiveBuilderTab] = useState<'editor' | 'marketplace' | 'community' | 'analyzer' | 'improver'>('editor');
  
  // Search input for filtering README section builders
  const [sectionsSearchQuery, setSectionsSearchQuery] = useState('');

  // Tech Stack searches
  const [techSearch, setTechSearch] = useState('');
  const [activeTechCategory, setActiveTechCategory] = useState<TechCategory>('All');
  
  // Social links search
  const [socialSearch, setSocialSearch] = useState('');

  // Template Marketplace States
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [selectedMarketplaceCategory, setSelectedMarketplaceCategory] = useState<string>('all');
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const favs = localStorage.getItem('owlreadme-fav-templates');
      return favs ? JSON.parse(favs) : [];
    }
    return [];
  });
  const [recentlyUsedTemplates, setRecentlyUsedTemplates] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const recents = localStorage.getItem('owlreadme-recent-templates');
      return recents ? JSON.parse(recents) : [];
    }
    return [];
  });
  const [previewingTemplate, setPreviewingTemplate] = useState<any | null>(null);

  // Community Templates States
  const [communitySearch, setCommunitySearch] = useState('');
  const [selectedCommunityCategory, setSelectedCommunityCategory] = useState<string>('all');
  const [activeCollection, setActiveCollection] = useState<'all' | 'trending' | 'picks' | 'favorites' | 'recents'>('all');
  const [previewingCommunityTemplate, setPreviewingCommunityTemplate] = useState<any | null>(null);

  // Animated README Components States
  const [animatedSearch, setAnimatedSearch] = useState('');
  const [animatedCategory, setAnimatedCategory] = useState<AnimatedCategory>('all');
  const [activeEditingCompId, setActiveEditingCompId] = useState<string | null>(null);

  useEffect(() => {

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

  const applyMarketplaceTemplate = (tpl: MarketplaceTemplate) => {
    applyTemplate(tpl);
    const updatedRecents = [tpl.id, ...recentlyUsedTemplates.filter((id) => id !== tpl.id)].slice(0, 4);
    setRecentlyUsedTemplates(updatedRecents);
    localStorage.setItem('owlreadme-recent-templates', JSON.stringify(updatedRecents));
  };

  const duplicateTemplateToWorkspace = (tpl: MarketplaceTemplate) => {
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
