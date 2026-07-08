/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
"use client";

import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { BRANDING } from '@/config/branding';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import {
  Clock,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  ArrowLeftRight,
  Save,
  Search,
} from 'lucide-react';
import { Reorder } from 'framer-motion';
import { useTemplateStore, CommunityTemplate, TemplateCategory } from '@/stores/template-store';
import usePanelStore from '@/stores/panel-store';
import useThemeStore from '@/stores/theme-store';
import { getAIService } from '@/utils/ai/ai-service';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import FocusTrap from '@/components/FocusTrap';
import useReadmeStore, { SectionId } from '@/stores/readme-store';
import { useHistoryStore, computeConfigDiff } from '@/stores/history-store';
import { TEMPLATE_MARKETPLACE } from '@/utils/template-registry';

import BuilderHeader from './components/BuilderHeader';
import BuilderSidebar from './components/BuilderSidebar';
import BuilderPreview from './components/BuilderPreview';
import BuilderLayout from './components/BuilderLayout';
const HeaderPanel = dynamic(() => import('./panels/HeaderPanel'), { ssr: false });
const AboutPanel = dynamic(() => import('./panels/AboutPanel'), { ssr: false });
const SocialLinksPanel = dynamic(() => import('./panels/SocialLinksPanel'), { ssr: false });
const TechStackPanel = dynamic(() => import('./panels/TechStackPanel'), { ssr: false });
const GitHubStatsPanel = dynamic(() => import('./panels/GitHubStatsPanel'), { ssr: false });
const ProjectsPanel = dynamic(() => import('./panels/ProjectsPanel'), { ssr: false });
const AchievementsPanel = dynamic(() => import('./panels/AchievementsPanel'), { ssr: false });
const AIImproverPanel = dynamic(() => import('./panels/AIImproverPanel'), { ssr: false });
const TemplateMarketplacePanel = dynamic(() => import('./panels/TemplateMarketplacePanel'), { ssr: false });
const CommunityTemplatesPanel = dynamic(() => import('./panels/CommunityTemplatesPanel'), { ssr: false });
const QualityAnalyzerPanel = dynamic(() => import('./panels/QualityAnalyzerPanel'), { ssr: false });
const SupportPanel = dynamic(() => import('./panels/SupportPanel'), { ssr: false });
const QuotesPanel = dynamic(() => import('./panels/QuotesPanel'), { ssr: false });
const VisitorCounterPanel = dynamic(() => import('./panels/VisitorCounterPanel'), { ssr: false });
const CustomMarkdownPanel = dynamic(() => import('./panels/CustomMarkdownPanel'), { ssr: false });
const AnimatedComponentsPanel = dynamic(() => import('./panels/AnimatedComponentsPanel'), { ssr: false });

import { useBuilderWorkspace } from './hooks/useBuilderWorkspace';
import { useBuilderPreview } from './hooks/useBuilderPreview';
import { useBuilderDialogs } from './hooks/useBuilderDialogs';
import { useBuilderActions } from './hooks/useBuilderActions';
import { useExportActions } from './hooks/useExportActions';
import { calculatePanelWidths, getCurrentConfig } from './utils/builder-helpers';

// Dynamically import the Markdown preview component to disable SSR
const MDMarkdown = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800/40 rounded-md h-[400px] flex items-center justify-center text-xs text-gray-400">
        Loading markdown preview...
      </div>
    ),
  }
) as any;

const READMEBuilderPage = () => {
  // ── Zustand Stores ────────────────────────────────────────────────────────
  const {
    name,
    role,
    about,
    skills,
    projects,
    socials,
    template,
    githubStats,
    techStack,
    socialLinks,
    achievements,
    header,
    sections,
    support,
    quotes,
    customMarkdown,
    standaloneVisitor,
    setName,
    setRole,
    setAbout,
    setSkills,
    setProjects,
    setSocials,
    setTemplate,
    setGithubStats,
    setTechStack,
    setSocialLinks,
    setAchievements,
    setHeader,
    setSections,
    setSupport,
    setQuotes,
    setCustomMarkdown,
    setStandaloneVisitor,
    featuredProjects,
    setFeaturedProjects,
    animatedComponents,
    setAnimatedComponents,
    updateAnimatedComponentItem,
    applyPreset,
    applyTemplate,
    reset,
  } = useReadmeStore(
    useShallow((state) => ({
      name: state.name,
      role: state.role,
      about: state.about,
      skills: state.skills,
      projects: state.projects,
      socials: state.socials,
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
      setName: state.setName,
      setRole: state.setRole,
      setAbout: state.setAbout,
      setSkills: state.setSkills,
      setProjects: state.setProjects,
      setSocials: state.setSocials,
      setTemplate: state.setTemplate,
      setGithubStats: state.setGithubStats,
      setTechStack: state.setTechStack,
      setSocialLinks: state.setSocialLinks,
      setAchievements: state.setAchievements,
      setHeader: state.setHeader,
      setSections: state.setSections,
      setSupport: state.setSupport,
      setQuotes: state.setQuotes,
      setCustomMarkdown: state.setCustomMarkdown,
      setStandaloneVisitor: state.setStandaloneVisitor,
      featuredProjects: state.featuredProjects,
      setFeaturedProjects: state.setFeaturedProjects,
      animatedComponents: state.animatedComponents,
      setAnimatedComponents: state.setAnimatedComponents,
      updateAnimatedComponentItem: state.updateAnimatedComponentItem,
      applyPreset: state.applyPreset,
      applyTemplate: state.applyTemplate,
      reset: state.reset,
    }))
  );

  const {
    templates: communityTemplates,
    favorites: templateFavorites,
    recentlyUsed: templateRecentlyUsed,
    publishTemplate,
    deleteTemplate,
    toggleLike,
    incrementDownloads,
    toggleFavorite: toggleCommunityFavorite,
    addRecentlyUsed,
    importTemplate,
  } = useTemplateStore(
    useShallow((state) => ({
      templates: state.templates,
      favorites: state.favorites,
      recentlyUsed: state.recentlyUsed,
      publishTemplate: state.publishTemplate,
      deleteTemplate: state.deleteTemplate,
      toggleLike: state.toggleLike,
      incrementDownloads: state.incrementDownloads,
      toggleFavorite: state.toggleFavorite,
      addRecentlyUsed: state.addRecentlyUsed,
      importTemplate: state.importTemplate,
    }))
  );

  const {
    builderCollapsed,
    previewCollapsed,
    markdownCollapsed,
    builderSize,
    previewSize,
    markdownSize,
    fullscreenPanel,
    mobileViewMode,
    setBuilderCollapsed,
    setPreviewCollapsed,
    setMarkdownCollapsed,
    setSizes,
    setFullscreenPanel,
    setMobileViewMode,
    resetLayout,
  } = usePanelStore(
    useShallow((state) => ({
      builderCollapsed: state.builderCollapsed,
      previewCollapsed: state.previewCollapsed,
      markdownCollapsed: state.markdownCollapsed,
      builderSize: state.builderSize,
      previewSize: state.previewSize,
      markdownSize: state.markdownSize,
      fullscreenPanel: state.fullscreenPanel,
      mobileViewMode: state.mobileViewMode,
      setBuilderCollapsed: state.setBuilderCollapsed,
      setPreviewCollapsed: state.setPreviewCollapsed,
      setMarkdownCollapsed: state.setMarkdownCollapsed,
      setSizes: state.setSizes,
      setFullscreenPanel: state.setFullscreenPanel,
      setMobileViewMode: state.setMobileViewMode,
      resetLayout: state.resetLayout,
    }))
  );

  const { theme, setTheme } = useThemeStore(
    useShallow((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
    }))
  );

  const { past, future, snapshots, deleteSnapshot, clearHistory, pushUndo } = useHistoryStore(
    useShallow((state) => ({
      past: state.past,
      future: state.future,
      snapshots: state.snapshots,
      deleteSnapshot: state.deleteSnapshot,
      clearHistory: state.clearHistory,
      pushUndo: state.pushUndo,
    }))
  );

  // ── Initialize Custom Hooks ───────────────────────────────────────────────
  const {
    loading,
    error,
    setError,
    workspaces,
    activeWorkspaceId,
    createWorkspace,
    setActiveWorkspaceId,
  } = useBuilderWorkspace();

  const {
    localMarkdown,
    setLocalMarkdown,
    analysisResult,
    handleExportAnalysisReport,
    editorScrollRef,
    previewScrollRef,
    handleEditorScroll,
    handlePreviewScroll,
  } = useBuilderPreview();

  const {
    isPublishModalOpen,
    setIsPublishModalOpen,
    publishForm,
    setPublishForm,
    isImportModalOpen,
    setIsImportModalOpen,
    importMethod,
    setImportMethod,
    importUsernameInput,
    setImportUsernameInput,
    importRepoUrlInput,
    setImportRepoUrlInput,
    importRawUrlInput,
    setImportRawUrlInput,
    importPasteMarkdown,
    setImportPasteMarkdown,
    importStatus,
    setImportStatus,
    importStatusMessage,
    parsedImportResult,
    selectedImportSections,
    setSelectedImportSections,
    conflictResolution,
    setConflictResolution,
    handleFetchReadme,
    handleFileUploadImport,
    handleResolveImport,
    isHistorySidebarOpen,
    setIsHistorySidebarOpen,
    historySearchQuery,
    setHistorySearchQuery,
    manualSnapshotForm,
    setManualSnapshotForm,
    comparingSnapshot,
    setComparingSnapshot,
    restoringSnapshot,
    setRestoringSnapshot,

    diffVisualTab,
    setDiffVisualTab,
    selectedRestoreFields,
    setSelectedRestoreFields,
    triggerAutoSnapshot,
    handleUndo,
    handleRedo,
    handleManualSnapshot,
    executeSectionRestore,
    handleUndoCapture,
    compareSnapshotMarkdown,
    compareCurrentMarkdown,
  } = useBuilderDialogs();

  const {
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
  } = useBuilderActions();

  const {
    copied,
    handleCopy,
    handleDownload,
    handleExportConfig,
    handleImportConfig,
  } = useExportActions(localMarkdown);

  // ── Panel Resizing mouse/pointer drag handler ─────────────────────────────
  const startResizing = (e: React.PointerEvent<HTMLDivElement>, handle: 'left' | 'right') => {
    e.preventDefault();
    const startX = e.clientX;
    const startBuilderSize = builderSize;
    const startPreviewSize = previewSize;
    const startMarkdownSize = markdownSize;
    const container = e.currentTarget.parentElement;
    if (!container) return;
    const containerWidth = container.getBoundingClientRect().width;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPct = (deltaX / containerWidth) * 100;

      if (handle === 'left') {
        const newBuilder = Math.max(15, Math.min(60, startBuilderSize + deltaPct));
        const newPreview = Math.max(15, startPreviewSize - (newBuilder - startBuilderSize));
        setSizes(newBuilder, newPreview, startMarkdownSize);
      } else {
        const newPreview = Math.max(15, Math.min(60, startPreviewSize + deltaPct));
        const newMarkdown = Math.max(15, startMarkdownSize - (newPreview - startPreviewSize));
        setSizes(startBuilderSize, newPreview, newMarkdown);
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const panelWidths = calculatePanelWidths({
    fullscreenPanel,
    builderCollapsed,
    previewCollapsed,
    markdownCollapsed,
    builderSize,
    previewSize,
    markdownSize,
  });

  // ── Community Templates Handlers ──────────────────────────────────────────
  const applyCommunityTemplate = (tpl: CommunityTemplate) => {
    applyTemplate(tpl);
    incrementDownloads(tpl.id);
    addRecentlyUsed(tpl.id);
  };

  const handleExportTemplate = (tpl: CommunityTemplate) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tpl, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${tpl.name.toLowerCase().replace(/\s+/g, '-')}-template.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportTemplateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importTemplate(content);
      if (res.success) {
        alert('Template imported successfully!');
      } else {
        alert(`Failed to import: ${res.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePublishActiveConfig = () => {
    const state = useReadmeStore.getState();
    const config = {
      header: state.header,
      githubStats: state.githubStats,
      techStack: state.techStack,
      socialLinks: state.socialLinks,
      achievements: state.achievements,
      quotes: state.quotes,
      customMarkdown: state.customMarkdown,
      support: state.support,
      standaloneVisitor: state.standaloneVisitor,
      featuredProjects: state.featuredProjects,
      animatedComponents: state.animatedComponents,
    };

    publishTemplate({
      name: publishForm.name || 'My Custom Template',
      description: publishForm.description || `Custom template created in ${BRANDING.name}`,
      author: publishForm.author || 'Developer',
      category: publishForm.category,
      tags: publishForm.tagsInput ? publishForm.tagsInput.split(',').map((t) => t.trim()).filter(Boolean) : [],
      sections: state.sections.order.filter(id => state.sections.sections[id].enabled),
      theme: state.template === 'minimal' ? 'minimal' : 'dark',
      config,
    });

    setPublishForm({
      name: '',
      description: '',
      author: '',
      category: 'minimal',
      tagsInput: '',
    });
    setIsPublishModalOpen(false);
  };

  // ── AI Improver helper variables ──────────────────────────────────────────
  const getCurrentImproverText = () => {
    switch (improverSection) {
      case 'aboutMe':
        return about || '';
      case 'headerName':
        return name || '';
      case 'headerTitle':
        return role || '';
      case 'headerSubtitle':
        return header.intro || '';
      case 'skills':
        return skills || '';
      case 'projects':
        return projects || '';
      default:
        return '';
    }
  };

  const handleRequestImprove = async () => {
    const text = getCurrentImproverText();
    if (!text.trim()) return;
    setIsImproving(true);
    try {
      const service = getAIService();
      const res = await service.improveText(text, improverTone, improverSection.startsWith('header') ? 'title' : 'body');
      setImproverAlternatives(res.alternatives);
    } catch (e: any) {
      console.error(e);
      alert('Failed to get improvements: ' + e.message);
    } finally {
      setIsImproving(false);
    }
  };

  const handleApplyImprove = (improvedText: string) => {
    const originalText = getCurrentImproverText();
    setImproverHistory([...improverHistory, { section: improverSection, originalText, improvedText }]);
    
    switch (improverSection) {
      case 'aboutMe':
        setAbout(improvedText);
        break;
      case 'headerName':
        setName(improvedText);
        break;
      case 'headerTitle':
        setRole(improvedText);
        break;
      case 'headerSubtitle':
        setHeader({ intro: improvedText });
        break;
      case 'skills':
        setSkills(improvedText);
        break;
      case 'projects':
        setProjects(improvedText);
        break;
    }
  };

  const handleUndoImprove = () => {
    if (improverHistory.length === 0) return;
    const last = improverHistory[improverHistory.length - 1];
    setImproverHistory(improverHistory.slice(0, -1));
    
    switch (last.section) {
      case 'aboutMe':
        setAbout(last.originalText);
        break;
      case 'headerName':
        setName(last.originalText);
        break;
      case 'headerTitle':
        setRole(last.originalText);
        break;
      case 'headerSubtitle':
        setHeader({ intro: last.originalText });
        break;
      case 'skills':
        setSkills(last.originalText);
        break;
      case 'projects':
        setProjects(last.originalText);
        break;
    }
  };

  const [improverSection, setImproverSection] = useState<'headerName' | 'headerTitle' | 'headerSubtitle' | 'aboutMe' | 'skills' | 'projects'>('aboutMe');
  const [improverTone, setImproverTone] = useState<string>('More professional');
  const [isImproving, setIsImproving] = useState(false);
  const [improverAlternatives, setImproverAlternatives] = useState<string[]>([]);
  const [improverHistory, setImproverHistory] = useState<{ section: string; originalText: string; improvedText: string }[]>([]);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);



  // ── Render section helper configurations ───────────────────────────────────
  const renderSectionConfigForm = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <HeaderPanel
            sectionId={sectionId}
            header={header}
            setHeader={setHeader}
            template={template}
            setTemplate={setTemplate}
            triggerAutoSnapshot={triggerAutoSnapshot}
            pushUndo={pushUndo}
            getCurrentConfig={getCurrentConfig}
            handleUndoCapture={handleUndoCapture}
            name={name}
            setName={setName}
            role={role}
            setRole={setRole}
            about={about}
            setAbout={setAbout}
            skills={skills}
            setSkills={setSkills}
            projects={projects}
            setProjects={setProjects}
            socials={socials}
            setSocials={setSocials}
            loading={loading}
          />
        );

      case 'about':
        return (
          <AboutPanel
            sectionId={sectionId}
            about={about}
            setAbout={setAbout}
            skills={skills}
            setSkills={setSkills}
            loading={loading}
          />
        );

      case 'socials':
        return (
          <SocialLinksPanel
            sectionId={sectionId}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            socialSearch={socialSearch}
            setSocialSearch={setSocialSearch}
            socials={socials}
            setSocials={setSocials}
            loading={loading}
          />
        );

      case 'techStack':
        return (
          <TechStackPanel
            sectionId={sectionId}
            techStack={techStack}
            setTechStack={setTechStack}
            techSearch={techSearch}
            setTechSearch={setTechSearch}
            activeTechCategory={activeTechCategory}
            setActiveTechCategory={setActiveTechCategory}
          />
        );

      case 'stats':
        return (
          <GitHubStatsPanel
            sectionId={sectionId}
            githubStats={githubStats}
            setGithubStats={setGithubStats}
          />
        );

      case 'achievements':
        return (
          <AchievementsPanel
            sectionId={sectionId}
            achievements={achievements}
            setAchievements={setAchievements}
          />
        );

      case 'projects':
        return (
          <ProjectsPanel
            sectionId={sectionId}
            featuredProjects={featuredProjects}
            setFeaturedProjects={setFeaturedProjects}
            projects={projects}
            setProjects={setProjects}
            loading={loading}
          />
        );

      case 'support':
        return (
          <SupportPanel
            sectionId={sectionId}
            support={support}
            setSupport={setSupport}
          />
        );

      case 'quotes':
        return (
          <QuotesPanel
            sectionId={sectionId}
            quotes={quotes}
            setQuotes={setQuotes}
          />
        );

      case 'visitor':
        return (
          <VisitorCounterPanel
            sectionId={sectionId}
            standaloneVisitor={standaloneVisitor}
            setStandaloneVisitor={setStandaloneVisitor}
            defaultUsername={githubStats.username}
          />
        );

      case 'custom':
        return (
          <CustomMarkdownPanel
            sectionId={sectionId}
            customMarkdown={customMarkdown}
            setCustomMarkdown={setCustomMarkdown}
          />
        );

      case 'animatedComponents':
        return (
          <AnimatedComponentsPanel
            sectionId={sectionId}
            animatedComponents={animatedComponents}
            setAnimatedComponents={setAnimatedComponents}
            updateAnimatedComponentItem={updateAnimatedComponentItem}
            animatedSearch={animatedSearch}
            setAnimatedSearch={setAnimatedSearch}
            animatedCategory={animatedCategory}
            setAnimatedCategory={setAnimatedCategory}
            activeEditingCompId={activeEditingCompId}
            setActiveEditingCompId={setActiveEditingCompId}
          />
        );

      default:
        return null;
    }
  };

  const renderQualityAnalyzerPanel = () => {
    return (
      <QualityAnalyzerPanel
        analysisResult={analysisResult}
        setActiveBuilderTab={setActiveBuilderTab}
        setMarketplaceSearch={setMarketplaceSearch}
        handleExportAnalysisReport={handleExportAnalysisReport}
      />
    );
  };

  const renderCommunityTemplatesPanel = () => {
    return (
      <CommunityTemplatesPanel
        communityTemplates={communityTemplates}
        communitySearch={communitySearch}
        setCommunitySearch={setCommunitySearch}
        selectedCommunityCategory={selectedCommunityCategory}
        setSelectedCommunityCategory={setSelectedCommunityCategory}
        activeCollection={activeCollection}
        setActiveCollection={setActiveCollection}
        templateFavorites={templateFavorites}
        toggleCommunityFavorite={toggleCommunityFavorite}
        templateRecentlyUsed={templateRecentlyUsed}
        setIsPublishModalOpen={setIsPublishModalOpen}
        handleImportTemplateFile={handleImportTemplateFile}
        deleteTemplate={deleteTemplate}
        toggleLike={toggleLike}
        applyCommunityTemplate={applyCommunityTemplate}
        setPreviewingCommunityTemplate={setPreviewingCommunityTemplate}
        handleExportTemplate={handleExportTemplate}
      />
    );
  };

  const renderAIImprovePanel = () => {
    return (
      <AIImproverPanel
        improverHistory={improverHistory}
        handleUndoImprove={handleUndoImprove}
        improverSection={improverSection}
        setImproverSection={setImproverSection}
        setImproverAlternatives={setImproverAlternatives}
        getCurrentImproverText={getCurrentImproverText}
        improverTone={improverTone}
        setImproverTone={setImproverTone}
        handleRequestImprove={handleRequestImprove}
        isImproving={isImproving}
        improverAlternatives={improverAlternatives}
        setSelectedAlternative={setSelectedAlternative}
        setIsComparing={setIsComparing}
        handleApplyImprove={handleApplyImprove}
      />
    );
  };

  // Tab contents render helpers (to keep main return small and modular)
  const renderTabContent = () => {
    return (
      <>
        {activeBuilderTab === 'editor' && (
          <>
            {/* Section list (Section Manager) */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/25 border border-gray-200/80 dark:border-gray-800/80 rounded-lg space-y-3.5">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-2xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-555">Section Manager</h4>
                <div className="relative flex-1 max-w-44">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter sections..."
                    value={sectionsSearchQuery}
                    onChange={(e) => setSectionsSearchQuery(e.target.value)}
                    className="pl-7 pr-2 py-1 w-full text-[11px] rounded border border-gray-200 dark:bg-[#1e1e1e] dark:border-gray-700 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Presets Grid */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Layout Presets</span>
                <div className="flex flex-wrap gap-1">
                  {['minimal', 'modern', 'developer', 'open-source', 'gprm-style'].map((pres) => (
                    <button
                      key={pres}
                      type="button"
                      onClick={() => applyPreset(pres)}
                      aria-label={`Apply ${pres.replace('-style', '').replace('gprm', 'GPRM')} layout preset`}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded bg-gray-155 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-755 text-gray-655 dark:text-gray-300 transition capitalize cursor-pointer"
                    >
                      {pres.replace('-style', '').replace('gprm', 'GPRM')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reorder sections */}
              <Reorder.Group
                axis="y"
                values={sections.order}
                onReorder={(newOrder) => setSections({ order: newOrder })}
                className="space-y-1"
              >
                {sections.order
                  .filter(id => {
                    const config = sections.sections[id];
                    return !sectionsSearchQuery || (config && config.name.toLowerCase().includes(sectionsSearchQuery.toLowerCase()));
                  })
                  .map((sectionId) => {
                    const sectionConfig = sections.sections[sectionId];
                    if (!sectionConfig) return null;

                    return (
                      <Reorder.Item
                        key={sectionId}
                        value={sectionId}
                        className={`flex items-center justify-between p-2 rounded border text-xs select-none transition cursor-grab active:cursor-grabbing ${
                          sectionConfig.enabled
                            ? 'border-blue-105 dark:border-blue-900 bg-blue-500/5'
                            : 'border-gray-200 dark:border-gray-800 opacity-60 bg-gray-55/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-bold">⋮⋮</span>
                          <input
                            type="checkbox"
                            checked={sectionConfig.enabled}
                            onChange={() => setSections({
                              sections: {
                                ...sections.sections,
                                [sectionId]: { ...sectionConfig, enabled: !sectionConfig.enabled }
                              }
                            })}
                            className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-855 cursor-pointer"
                          />
                          <span className="font-semibold text-gray-750 dark:text-gray-200">{sectionConfig.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSections({
                            sections: {
                              ...sections.sections,
                              [sectionId]: { ...sectionConfig, collapsed: !sectionConfig.collapsed }
                            }
                          })}
                          className="text-[10px] text-blue-500 hover:text-blue-600 font-semibold cursor-pointer"
                        >
                          {sectionConfig.collapsed ? 'Expand' : 'Collapse'}
                        </button>
                      </Reorder.Item>
                    );
                  })}
              </Reorder.Group>
            </div>

            {/* Section forms lists */}
            <div className="space-y-4">
              {sections.order.map((sectionId) => {
                const sectionConfig = sections.sections[sectionId];
                if (!sectionConfig) return null;

                // Search filter matching
                if (sectionsSearchQuery && !sectionConfig.name.toLowerCase().includes(sectionsSearchQuery.toLowerCase())) {
                  return null;
                }

                // Render collapsed panel placeholder
                if (sectionConfig.collapsed) {
                  return (
                    <div
                      key={sectionId}
                      className="p-3 bg-gray-50/50 dark:bg-[#151518] border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700 dark:text-gray-305">{sectionConfig.name} Configuration Panel</span>
                        {!sectionConfig.enabled && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-150 dark:bg-gray-800 text-gray-400 uppercase tracking-wide">Disabled</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSections({
                          sections: {
                            ...sections.sections,
                            [sectionId]: { ...sectionConfig, collapsed: false }
                          }
                        })}
                        className="text-2xs text-blue-500 hover:text-blue-655 font-bold cursor-pointer"
                      >
                        Expand Panel
                      </button>
                    </div>
                  );
                }

                // Render builder forms
                return (
                  <div key={sectionId} className="relative">
                    {renderSectionConfigForm(sectionId)}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeBuilderTab === 'marketplace' && (
          <TemplateMarketplacePanel
            marketplaceSearch={marketplaceSearch}
            setMarketplaceSearch={setMarketplaceSearch}
            selectedMarketplaceCategory={selectedMarketplaceCategory}
            setSelectedMarketplaceCategory={setSelectedMarketplaceCategory}
            handleImportConfig={handleImportConfig}
            handleExportConfig={handleExportConfig}
            favoriteTemplates={favoriteTemplates}
            toggleFavorite={toggleFavorite}
            recentlyUsedTemplates={recentlyUsedTemplates}
            applyMarketplaceTemplate={applyMarketplaceTemplate}
            setPreviewingTemplate={setPreviewingTemplate}
            duplicateTemplateToWorkspace={duplicateTemplateToWorkspace}
          />
        )}

        {activeBuilderTab === 'community' && renderCommunityTemplatesPanel()}
        {activeBuilderTab === 'analyzer' && renderQualityAnalyzerPanel()}
        {activeBuilderTab === 'improver' && renderAIImprovePanel()}
      </>
    );
  };

  return (
    <>
      <BuilderLayout
        header={
          <BuilderHeader
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
            createWorkspace={createWorkspace}
            setActiveWorkspaceId={setActiveWorkspaceId}
            template={template}
            setTemplate={setTemplate}
            theme={theme}
            setTheme={setTheme}
            resetLayout={resetLayout}
            setIsImportModalOpen={setIsImportModalOpen}
          />
        }
        mobileTabsHeader={
          <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] z-40 flex-shrink-0 select-none">
            <button
              onClick={() => setMobileViewMode('builder')}
              className={`flex-1 py-2.5 text-center text-xs font-semibold border-b-2 cursor-pointer transition-all ${
                mobileViewMode === 'builder'
                  ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              ✏️ Section Builder
            </button>
            <button
              onClick={() => setMobileViewMode('preview')}
              className={`flex-1 py-2.5 text-center text-xs font-semibold border-b-2 cursor-pointer transition-all ${
                mobileViewMode === 'preview'
                  ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              👁️ Live Preview
            </button>
            <button
              onClick={() => setMobileViewMode('markdown')}
              className={`flex-1 py-2.5 text-center text-xs font-semibold border-b-2 cursor-pointer transition-all ${
                mobileViewMode === 'markdown'
                  ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              📝 Markdown Output
            </button>
          </div>
        }
        builderCollapsed={builderCollapsed}
        previewCollapsed={previewCollapsed}
        markdownCollapsed={markdownCollapsed}
        fullscreenPanel={fullscreenPanel}
        panelWidths={panelWidths}
        startResizing={startResizing}
        desktopBuilderPanel={
          <BuilderSidebar
            mode="desktop"
            builderCollapsed={builderCollapsed}
            setBuilderCollapsed={setBuilderCollapsed}
            fullscreenPanel={fullscreenPanel}
            setFullscreenPanel={setFullscreenPanel}
            panelWidth={panelWidths.builder}
            activeBuilderTab={activeBuilderTab}
            setActiveBuilderTab={setActiveBuilderTab}
            marketplaceLength={TEMPLATE_MARKETPLACE.length}
          >
            {renderTabContent()}
          </BuilderSidebar>
        }
        desktopPreviewPanel={
          <BuilderPreview
            mode="desktop-preview"
            localMarkdown={localMarkdown}
            setLocalMarkdown={setLocalMarkdown}
            theme={theme}
            copied={copied}
            handleCopy={handleCopy}
            handleDownload={handleDownload}
            previewScrollRef={previewScrollRef}
            handlePreviewScroll={handlePreviewScroll}
            previewCollapsed={previewCollapsed}
            setPreviewCollapsed={setPreviewCollapsed}
            fullscreenPanel={fullscreenPanel}
            setFullscreenPanel={setFullscreenPanel}
            panelWidth={panelWidths.preview}
          />
        }
        desktopMarkdownPanel={
          <BuilderPreview
            mode="desktop-markdown"
            localMarkdown={localMarkdown}
            setLocalMarkdown={setLocalMarkdown}
            theme={theme}
            copied={copied}
            handleCopy={handleCopy}
            handleDownload={handleDownload}
            editorScrollRef={editorScrollRef}
            handleEditorScroll={handleEditorScroll}
            markdownCollapsed={markdownCollapsed}
            setMarkdownCollapsed={setMarkdownCollapsed}
            fullscreenPanel={fullscreenPanel}
            setFullscreenPanel={setFullscreenPanel}
            panelWidth={panelWidths.markdown}
          />
        }
        mobileViewMode={mobileViewMode}
        mobileBuilderPanel={
          <BuilderSidebar
            mode="mobile"
            activeBuilderTab={activeBuilderTab}
            setActiveBuilderTab={setActiveBuilderTab}
            marketplaceLength={TEMPLATE_MARKETPLACE.length}
          >
            {renderTabContent()}
          </BuilderSidebar>
        }
        mobilePreviewPanel={
          <BuilderPreview
            mode="mobile-preview"
            localMarkdown={localMarkdown}
            setLocalMarkdown={setLocalMarkdown}
            theme={theme}
            copied={copied}
            handleCopy={handleCopy}
            handleDownload={handleDownload}
          />
        }
        mobileMarkdownPanel={
          <BuilderPreview
            mode="mobile-markdown"
            localMarkdown={localMarkdown}
            setLocalMarkdown={setLocalMarkdown}
            theme={theme}
            copied={copied}
            handleCopy={handleCopy}
            handleDownload={handleDownload}
          />
        }
        error={error}
        setError={setError}
      />
      {/* ── Detailed Preview Modal Overlay (Escape Key Supported) ── */}
      {previewingTemplate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-preview-title"
        >
          <FocusTrap active={!!previewingTemplate}>
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Template Details</span>
                <button
                  onClick={() => setPreviewingTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 transition font-bold cursor-pointer text-sm"
                  aria-label="Close template preview"
                >
                  ✕
                </button>
              </div>
              {/* Modal Content */}
              <div className="p-6 space-y-5 flex-1 overflow-y-auto custom-editor-scrollbar text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {previewingTemplate.category}
                  </span>
                  <h3 id="template-preview-title" className="text-base font-bold text-black dark:text-white mt-1.5">{previewingTemplate.name}</h3>
                <p className="text-gray-400 dark:text-gray-550 leading-relaxed mt-0.5">{previewingTemplate.description}</p>
              </div>

              <div className="space-y-2 border-t border-gray-100 dark:border-gray-850 pt-4">
                <span className="font-semibold text-gray-500 dark:text-gray-450 block">Layout Configuration:</span>
                <div className="flex flex-wrap gap-1.5">
                  {previewingTemplate.sections.map((id: SectionId) => (
                    <span key={id} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-300 font-medium">
                      📂 {id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 dark:border-gray-850 pt-4">
                <span className="font-semibold text-gray-500 dark:text-gray-450 block">Theme Styling:</span>
                <span className="inline-block capitalize px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20">
                  🎨 {previewingTemplate.theme} Theme
                </span>
              </div>
            </div>
            {/* Footer actions */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 select-none">
              <button
                onClick={() => setPreviewingTemplate(null)}
                className="px-4 py-2 rounded text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  applyMarketplaceTemplate(previewingTemplate);
                  setPreviewingTemplate(null);
                }}
                className="px-4 py-2 rounded text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Apply Template
              </button>
            </div>
          </div>
        </FocusTrap>
        </div>
      )}
      {/* ── README Import Wizard Modal ── */}
      {isImportModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="readme-import-title"
        >
          <FocusTrap active={isImportModalOpen}>
            <div className="bg-white dark:bg-[#121212] border border-gray-205 dark:border-gray-800 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0 select-none">
                <h2 id="readme-import-title" className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Import Existing README
                </h2>
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportStatus('idle');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition font-bold cursor-pointer text-sm"
                  aria-label="Close import wizard"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto custom-editor-scrollbar flex-1 text-xs space-y-4">
                {importStatus === 'idle' || importStatus === 'fetching' || importStatus === 'parsing' || importStatus === 'error' ? (
                  <div className="space-y-4">
                    {/* Step 1: Input source selector tabs */}
                    <div className="flex border-b border-gray-150 dark:border-gray-800 flex-shrink-0 select-none">
                      {(['username', 'repoUrl', 'rawUrl', 'paste', 'upload'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setImportMethod(method)}
                          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
                            importMethod === method
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {method === 'username' && '👤 Username'}
                          {method === 'repoUrl' && '📦 Repo URL'}
                          {method === 'rawUrl' && '🔗 Raw URL'}
                          {method === 'paste' && '📝 Paste MD'}
                          {method === 'upload' && '📤 Upload'}
                        </button>
                      ))}
                    </div>

                    {/* Input Form Fields */}
                    <div className="space-y-3 pt-2">
                      {importMethod === 'username' && (
                        <div className="space-y-1.5">
                          <label className="font-semibold text-gray-550 block">GitHub Username</label>
                          <input
                            type="text"
                            placeholder="e.g. octocat"
                            value={importUsernameInput}
                            onChange={(e) => setImportUsernameInput(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded border border-gray-200 dark:bg-[#1e1e1e] dark:border-gray-700 focus:border-blue-500 focus:outline-none"
                          />
                          <p className="text-[10px] text-gray-400">Fetches the README from your personal profile repository (e.g. username/username).</p>
                        </div>
                      )}

                      {importMethod === 'repoUrl' && (
                        <div className="space-y-1.5">
                          <label className="font-semibold text-gray-550 block">GitHub Repository URL</label>
                          <input
                            type="text"
                            placeholder="e.g. https://github.com/octocat/hello-world"
                            value={importRepoUrlInput}
                            onChange={(e) => setImportRepoUrlInput(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded border border-gray-200 dark:bg-[#1e1e1e] dark:border-gray-700 focus:border-blue-500 focus:outline-none"
                          />
                           <p className="text-[10px] text-gray-400">Fetches the README.md file directly from the repository&apos;s root directory.</p>
                        </div>
                      )}

                      {importMethod === 'rawUrl' && (
                        <div className="space-y-1.5">
                          <label className="font-semibold text-gray-550 block">Raw Markdown URL</label>
                          <input
                            type="text"
                            placeholder="e.g. https://raw.githubusercontent.com/..."
                            value={importRawUrlInput}
                            onChange={(e) => setImportRawUrlInput(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded border border-gray-200 dark:bg-[#1e1e1e] dark:border-gray-700 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {importMethod === 'paste' && (
                        <div className="space-y-1.5">
                          <label className="font-semibold text-gray-550 block">Paste Markdown</label>
                          <textarea
                            placeholder="Paste raw markdown content here..."
                            value={importPasteMarkdown}
                            onChange={(e) => setImportPasteMarkdown(e.target.value)}
                            className="w-full h-44 px-3 py-2 text-xs rounded border border-gray-200 dark:bg-[#1e1e1e] dark:border-gray-700 focus:border-blue-500 focus:outline-none font-mono resize-none custom-editor-scrollbar"
                          />
                        </div>
                      )}

                      {importMethod === 'upload' && (
                        <div className="space-y-2 select-none">
                          <label className="font-semibold text-gray-550 block">Upload README.md File</label>
                          <label className="h-32 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg flex flex-col items-center justify-center gap-2 bg-gray-50/20 hover:bg-gray-55/35 cursor-pointer transition">
                            <span className="text-xl">📂</span>
                            <span className="text-2xs font-bold text-gray-400">Click or drop README.md file here</span>
                            <input type="file" accept=".md" onChange={handleFileUploadImport} className="hidden" />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Status Indicator */}
                    {(importStatus === 'fetching' || importStatus === 'parsing') && (
                      <div className="flex items-center gap-3 p-3 rounded bg-blue-500/5 text-blue-600 dark:text-blue-400 font-semibold select-none border border-blue-500/10">
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-blue-500" />
                        <span>{importStatusMessage}</span>
                      </div>
                    )}

                    {importStatus === 'error' && (
                      <div className="p-3 rounded bg-red-500/5 text-red-600 dark:text-red-400 font-semibold border border-red-500/10">
                        ⚠️ {importStatusMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Step 2: Summary Checkboxes & Conflict Selection */
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">Section Detection Summary</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">We scanned the markdown layout and identified these sections. Select which ones you want to import:</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 select-none">
                      {parsedImportResult?.detectedSections.map((sectionId: SectionId) => {
                        const isSelected = selectedImportSections.includes(sectionId);
                        return (
                          <label
                            key={sectionId}
                            className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition ${
                              isSelected
                                ? 'border-blue-200 dark:border-blue-900 bg-blue-500/5 text-blue-600 dark:text-blue-450 font-bold'
                                : 'border-gray-200 dark:border-gray-800 text-gray-550'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                const updated = isSelected
                                  ? selectedImportSections.filter((id) => id !== sectionId)
                                  : [...selectedImportSections, sectionId];
                                setSelectedImportSections(updated);
                              }}
                              className="rounded text-blue-600 cursor-pointer focus:ring-0"
                            />
                            <span className="capitalize">{sectionId.replace(/([A-Z])/g, ' $1')}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-850 pt-4 space-y-3">
                      <div>
                        <h4 className="text-2xs font-extrabold uppercase tracking-wider text-gray-400">Conflict Resolution</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">How should we apply these sections to your workspace layout?</p>
                      </div>

                      <div className="space-y-2 select-none">
                        <label className="flex items-start gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer bg-gray-50/10 hover:bg-gray-50/30">
                          <input
                            type="radio"
                            name="conflict"
                            value="new"
                            checked={conflictResolution === 'new'}
                            onChange={() => setConflictResolution('new')}
                            className="mt-0.5 text-blue-600 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-gray-700 dark:text-gray-300 block">✨ (Recommended) Create new workspace</span>
                            <span className="text-[10px] text-gray-400">Imports into a clean workspace, keeping your active workspace completely safe.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer bg-gray-50/10 hover:bg-gray-55/30">
                          <input
                            type="radio"
                            name="conflict"
                            value="merge"
                            checked={conflictResolution === 'merge'}
                            onChange={() => setConflictResolution('merge')}
                            className="mt-0.5 text-blue-600 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-gray-700 dark:text-gray-300 block">⚡ Merge into active workspace</span>
                            <span className="text-[10px] text-gray-400">Updates settings for selected sections, leaving other sections untouched.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer bg-gray-50/10 hover:bg-gray-55/30">
                          <input
                            type="radio"
                            name="conflict"
                            value="overwrite"
                            checked={conflictResolution === 'overwrite'}
                            onChange={() => setConflictResolution('overwrite')}
                            className="mt-0.5 text-blue-600 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-gray-700 dark:text-gray-300 block">⚠️ Overwrite active workspace</span>
                            <span className="text-[10px] text-gray-400">Replaces layout. Unselected sections will be disabled.</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 flex-shrink-0 select-none">
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportStatus('idle');
                  }}
                  className="px-4 py-2 rounded text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>

                {importStatus !== 'summary' ? (
                  <button
                    onClick={handleFetchReadme}
                    disabled={importStatus === 'fetching' || importStatus === 'parsing'}
                    className="px-4 py-2 rounded text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleResolveImport}
                    disabled={selectedImportSections.length === 0}
                    className="px-4 py-2 rounded text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50"
                  >
                    Import Selected Sections
                  </button>
                )}
              </div>
            </div>
          </FocusTrap>
        </div>
      )}
      {/* ── AI Side-by-Side Comparison Dialog ── */}
      {isComparing && selectedAlternative && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-comparison-title"
        >
          <FocusTrap active={isComparing}>
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0">
                <h2 id="ai-comparison-title" className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">AI Suggested Comparison</h2>
              <button
                onClick={() => {
                  setIsComparing(false);
                  setSelectedAlternative(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition font-bold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-editor-scrollbar flex-1 text-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-red-600 dark:text-red-400 uppercase text-[10px] tracking-wider select-none text-left">Original Content</h4>
                  <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-red-800 dark:text-red-300 font-mono text-[10px] whitespace-pre-wrap leading-relaxed h-64 overflow-y-auto custom-editor-scrollbar text-left">
                    {getCurrentImproverText()}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-green-600 dark:text-green-455 uppercase text-[10px] tracking-wider select-none text-left">AI Suggested Rewrite</h4>
                  <div className="p-4 rounded-xl border border-green-500/10 bg-green-500/5 text-green-800 dark:text-green-300 font-mono text-[10px] whitespace-pre-wrap leading-relaxed h-64 overflow-y-auto custom-editor-scrollbar text-left">
                    {selectedAlternative}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 select-none text-left">
                💡 Review the proposed rephrased alternative. Click Accept to write changes directly to your active workspace config.
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 flex-shrink-0 select-none">
              <button
                onClick={() => {
                  setIsComparing(false);
                  setSelectedAlternative(null);
                }}
                className="px-4 py-2 rounded text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleApplyImprove(selectedAlternative);
                  setIsComparing(false);
                  setSelectedAlternative(null);
                }}
                className="px-4 py-2 rounded text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Accept & Apply Changes
              </button>
            </div>
          </div>
        </FocusTrap>
        </div>
      )}

      {/* ── Community Template Preview Modal Overlay ── */}
      {previewingCommunityTemplate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="community-template-title"
        >
          <FocusTrap active={!!previewingCommunityTemplate}>
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-left">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10">
                <h2 id="community-template-title" className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-555">Community Template Preview</h2>
                <button
                  onClick={() => setPreviewingCommunityTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 transition font-bold cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>
              {/* Modal Content */}
              <div className="p-6 space-y-5 flex-1 overflow-y-auto custom-editor-scrollbar text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {previewingCommunityTemplate.category}
                    </span>
                    <span className="text-[10px] text-gray-405 font-mono">By @{previewingCommunityTemplate.author}</span>
                  </div>
                  <h3 className="text-base font-bold text-black dark:text-white mt-1.5">{previewingCommunityTemplate.name}</h3>
                  <p className="text-gray-400 dark:text-gray-550 leading-relaxed mt-0.5">{previewingCommunityTemplate.description}</p>
                </div>

                {previewingCommunityTemplate.tags.length > 0 && (
                  <div className="space-y-2 border-t border-gray-100 dark:border-gray-850 pt-4">
                    <span className="font-semibold text-gray-500 dark:text-gray-450 block">Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {previewingCommunityTemplate.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-300 font-mono text-[10px]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 border-t border-gray-100 dark:border-gray-850 pt-4">
                  <span className="font-semibold text-gray-500 dark:text-gray-450 block">Included Sections:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewingCommunityTemplate.sections.map((id: SectionId) => (
                      <span key={id} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-300 font-medium">
                        📂 {id}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-100 dark:border-gray-850 pt-4">
                  <span className="font-semibold text-gray-500 dark:text-gray-450 block">Theme:</span>
                  <span className="inline-block capitalize px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20">
                    🎨 {previewingCommunityTemplate.theme} Theme
                  </span>
                </div>
              </div>
              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 select-none">
                <button
                  onClick={() => setPreviewingCommunityTemplate(null)}
                  className="px-4 py-2 rounded text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    applyCommunityTemplate(previewingCommunityTemplate);
                    setPreviewingCommunityTemplate(null);
                  }}
                  className="px-4 py-2 rounded text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Apply Template
                </button>
              </div>
            </div>
          </FocusTrap>
        </div>
      )}

      {/* ── Publish Active Config Form Modal Overlay ── */}
      {isPublishModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-modal-title"
        >
          <FocusTrap active={isPublishModalOpen}>
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-left">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10">
                <h2 id="publish-modal-title" className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-555">Publish Active Profile</h2>
                <button
                  onClick={() => setIsPublishModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition font-bold cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>
              {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed mb-1">
                Save and share your current README configurations in the local community gallery.
              </p>

              <div className="space-y-1.5">
                <label className="block text-2xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Template Name</label>
                <Input
                  value={publishForm.name}
                  onChange={(e) => setPublishForm({ ...publishForm, name: e.target.value })}
                  placeholder="e.g. Creative Neon Portfolio"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-2xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author Username</label>
                <Input
                  value={publishForm.author}
                  onChange={(e) => setPublishForm({ ...publishForm, author: e.target.value })}
                  placeholder="e.g. dev_jane"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-2xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</label>
                <Textarea
                  value={publishForm.description}
                  onChange={(e) => setPublishForm({ ...publishForm, description: e.target.value })}
                  placeholder="Describe your template layout, choice of widgets, styling themes..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-2xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</label>
                  <select
                    value={publishForm.category}
                    onChange={(e) => setPublishForm({ ...publishForm, category: e.target.value as TemplateCategory })}
                    className="w-full px-3 py-2 text-xs rounded border border-gray-350 dark:bg-gray-850 dark:text-white dark:border-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="minimal">Minimal</option>
                    <option value="modern">Modern</option>
                    <option value="frontend">Frontend</option>
                    <option value="full-stack">Full Stack</option>
                    <option value="open-source">Open Source</option>
                    <option value="ai">AI Engineer</option>
                    <option value="anime">Anime</option>
                    <option value="gprm">GPRM Style</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-2xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags (comma separated)</label>
                  <Input
                    value={publishForm.tagsInput}
                    onChange={(e) => setPublishForm({ ...publishForm, tagsInput: e.target.value })}
                    placeholder="react, css, simple"
                  />
                </div>
              </div>
            </div>
            {/* Footer actions */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-850 flex items-center justify-end gap-3 select-none">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 rounded text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishActiveConfig}
                disabled={!publishForm.name || !publishForm.author}
                className="px-4 py-2 rounded text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publish Template
              </button>
            </div>
          </div>
        </FocusTrap>
        </div>
      )}
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <Button href="/theme" variant="secondary">Theme Studio</Button>
        <Button href="/roadmap-builder" variant="secondary">Create Roadmap</Button>
        <Button href="/preview" variant="primary">Preview Markdown</Button>
        <Button onClick={reset} variant="secondary">Clear</Button>
      </div>
      {/* ── Version History Floating Trigger ── */}
      <div className="fixed right-6 bottom-24 z-40 select-none">
        <button
          onClick={() => setIsHistorySidebarOpen(true)}
          className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer text-xs"
        >
          🕒 Version History
        </button>
      </div>

      {/* ── History Sidebar Overlay ── */}
      {isHistorySidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div onClick={() => setIsHistorySidebarOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-3xs transition-opacity" />

          {/* Sidebar Body */}
          <div className="relative w-full max-w-sm bg-white dark:bg-[#121215] border-l border-gray-200 dark:border-gray-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200 text-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-850 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Version Timeline</h3>
              </div>
              <button
                onClick={() => setIsHistorySidebarOpen(false)}
                className="text-gray-400 hover:text-gray-650 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Undo/Redo & Manual Snapshot Controls */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0 space-y-4 select-none">
              {/* Undo/Redo stack buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={past.length === 0}
                  className="flex-1 px-3 py-2 text-2xs font-bold rounded-lg border border-gray-250 dark:border-gray-700 bg-white dark:bg-[#18181c] text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Undo last change (Ctrl+Z)"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Undo ({past.length})
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={future.length === 0}
                  className="flex-1 px-3 py-2 text-2xs font-bold rounded-lg border border-gray-250 dark:border-gray-700 bg-white dark:bg-[#18181c] text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Redo last change (Ctrl+Y)"
                >
                  <RotateCw className="h-3.5 w-3.5" /> Redo ({future.length})
                </button>
              </div>

              {/* Create Manual Snapshot form */}
              <form onSubmit={handleManualSnapshot} className="space-y-2">
                <div className="space-y-1">
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400">Save Current State</label>
                  <Input
                    value={manualSnapshotForm.title}
                    onChange={(e) => setManualSnapshotForm({ ...manualSnapshotForm, title: e.target.value })}
                    placeholder="e.g. Added tech badges"
                    className="text-xs py-1 px-2.5 rounded border-gray-300 bg-white"
                    required
                  />
                  <input
                    type="text"
                    value={manualSnapshotForm.description}
                    onChange={(e) => setManualSnapshotForm({ ...manualSnapshotForm, description: e.target.value })}
                    placeholder="Optional description (e.g. finished basic bio)"
                    className="w-full px-2.5 py-1 text-4xs rounded border border-gray-200 dark:bg-[#18181c] dark:border-gray-750 text-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-2xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Save className="h-3 w-3" /> Save Snapshot
                </button>
              </form>
            </div>

            {/* List Header Search */}
            <div className="px-4 py-2 flex-shrink-0 select-none">
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search version snapshots..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="pl-7 pr-3 py-1.5 w-full text-4xs rounded border border-gray-200 dark:bg-[#18181c] dark:border-gray-700 focus:outline-none focus:border-blue-500 text-gray-700 dark:text-gray-300 transition"
                />
              </div>
            </div>

            {/* Snapshots Scrollable timeline */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-editor-scrollbar">
              {snapshots.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                  No snapshot versions saved yet. Auto-snapshots are generated on templates and import changes.
                </div>
              ) : (
                snapshots
                  .filter((snap) =>
                    snap.title.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                    snap.description.toLowerCase().includes(historySearchQuery.toLowerCase())
                  )
                  .map((snap) => {
                    const sourceBadgeColors = {
                      ai: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
                      import: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
                      template: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
                      manual: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                      auto: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20',
                    };

                    return (
                      <div
                        key={snap.id}
                        className="group p-3 bg-gray-50/50 dark:bg-[#16161a] hover:bg-gray-50/80 dark:hover:bg-[#1c1c22] border border-gray-200 dark:border-gray-800 rounded-xl transition duration-150 relative text-left"
                      >
                        <div className="flex items-center justify-between mb-1.5 select-none">
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${sourceBadgeColors[snap.source] || sourceBadgeColors.auto}`}>
                            {snap.source}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-gray-850 dark:text-gray-200 mb-0.5">{snap.title}</h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal mb-2">{snap.description}</p>

                        {/* List of detected changes */}
                        {snap.changes && snap.changes.length > 0 && (
                          <div className="space-y-0.5 mb-3 border-l border-gray-200 dark:border-gray-800 pl-2 select-none">
                            {snap.changes.map((change, cIdx) => (
                              <div key={cIdx} className="text-4xs text-gray-450 dark:text-gray-500 flex items-center gap-1 font-medium">
                                <span className="text-blue-500">•</span> {change}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Card actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-150/40 dark:border-gray-850/60 select-none">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setRestoringSnapshot(snap)}
                              className="px-2 py-0.8 text-3xs font-extrabold rounded bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => setComparingSnapshot(snap)}
                              className="px-1.5 py-0.8 text-3xs font-bold rounded bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition cursor-pointer flex items-center gap-0.5"
                            >
                              <ArrowLeftRight className="h-2.5 w-2.5" /> Compare
                            </button>
                          </div>

                          <button
                            onClick={() => deleteSnapshot(snap.id)}
                            className="p-1 text-gray-450 hover:text-red-500 transition cursor-pointer"
                            title="Delete this snapshot version"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Sidebar actions footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0 select-none">
              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshots, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', 'readme-version-history.json');
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                disabled={snapshots.length === 0}
                className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181c] text-3xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-650 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3 w-3" /> Export JSON
              </button>

              <button
                onClick={() => {
                  if (confirm('Clear entire snapshot history? This cannot be undone.')) {
                    clearHistory();
                  }
                }}
                disabled={snapshots.length === 0}
                className="px-3 py-1.5 text-3xs font-bold text-red-500 hover:bg-red-500/10 rounded transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Version Comparison Dialog Overlay ── */}
      {comparingSnapshot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <ArrowLeftRight className="h-4.5 w-4.5 text-blue-500" /> Compare: {comparingSnapshot.title} vs Current Editor
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">Snapshot save time: {new Date(comparingSnapshot.timestamp).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setComparingSnapshot(null)}
                className="text-gray-400 hover:text-gray-600 transition font-bold cursor-pointer text-sm"
                aria-label="Close compare view"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex border-b border-gray-105 dark:border-gray-850 px-6 bg-gray-50/30 dark:bg-[#15151b]/40 flex-shrink-0 select-none">
              {[
                { id: 'visual', label: '👁️ Visual Rendering Compare' },
                { id: 'code', label: '📄 Markdown Code Diff' },
                { id: 'summary', label: '⚙️ Changed Fields Summary' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDiffVisualTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-bold border-b-2 cursor-pointer transition ${
                    diffVisualTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-450 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Frame Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-editor-scrollbar text-xs">
              {diffVisualTab === 'visual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-stretch">
                  <div className="flex flex-col border border-red-500/10 rounded-xl overflow-hidden bg-red-500/[0.01]">
                    <h4 className="text-[10px] font-extrabold uppercase px-4 py-2 border-b border-red-500/10 text-red-500 bg-red-500/5 select-none">Snapshot Version</h4>
                    <div className="p-4 overflow-y-auto flex-1 custom-editor-scrollbar bg-white dark:bg-[#101012]">
                      <div data-color-mode={comparingSnapshot.config.template === 'minimal' ? 'light' : 'dark'} className="theme-preview-container">
                        <ErrorBoundary name="Snapshot Preview Renderer" fallback={<p className="text-red-500 p-2">Failed to render snapshot version.</p>}>
                          <MDMarkdown source={compareSnapshotMarkdown} style={{ background: 'transparent', color: 'inherit' }} />
                        </ErrorBoundary>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col border border-green-500/10 rounded-xl overflow-hidden bg-green-500/[0.01]">
                    <h4 className="text-[10px] font-extrabold uppercase px-4 py-2 border-b border-green-500/10 text-green-600 dark:text-green-400 bg-green-500/5 select-none">Current Editor State</h4>
                    <div className="p-4 overflow-y-auto flex-1 custom-editor-scrollbar bg-white dark:bg-[#101012]">
                      <div data-color-mode={template === 'minimal' ? 'light' : 'dark'} className="theme-preview-container">
                        <ErrorBoundary name="Current Editor Preview" fallback={<p className="text-red-500 p-2">Failed to render current state.</p>}>
                          <MDMarkdown source={compareCurrentMarkdown} style={{ background: 'transparent', color: 'inherit' }} />
                        </ErrorBoundary>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {diffVisualTab === 'code' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-stretch font-mono text-[11px]">
                  <div className="flex flex-col border border-red-500/10 rounded-xl overflow-hidden">
                    <h4 className="text-[10px] font-extrabold uppercase px-4 py-2 border-b border-red-500/10 text-red-500 bg-red-500/5 select-none">Snapshot Raw MD</h4>
                    <textarea
                      readOnly
                      value={compareSnapshotMarkdown}
                      className="w-full flex-1 p-4 bg-gray-900 text-red-400 font-mono text-xs focus:outline-none resize-none leading-relaxed custom-editor-scrollbar"
                    />
                  </div>

                  <div className="flex flex-col border border-green-500/10 rounded-xl overflow-hidden">
                    <h4 className="text-[10px] font-extrabold uppercase px-4 py-2 border-b border-green-500/10 text-green-600 dark:text-green-400 bg-green-500/5 select-none">Active Workspace MD</h4>
                    <textarea
                      readOnly
                      value={compareCurrentMarkdown}
                      className="w-full flex-1 p-4 bg-gray-900 text-green-400 font-mono text-xs focus:outline-none resize-none leading-relaxed custom-editor-scrollbar"
                    />
                  </div>
                </div>
              )}

              {diffVisualTab === 'summary' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-3">Field level modifications list</h4>
                    <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-250 dark:border-gray-800 space-y-2 select-none">
                      {computeConfigDiff(comparingSnapshot.config, getCurrentConfig()).map((diff, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                          <span className="text-amber-550">⚠</span> {diff}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-105 dark:border-gray-850 pt-4 space-y-3">
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs select-none">Snapshot Metadata properties</h4>
                    <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-gray-500">
                      <div>
                        <span>Snapshot Source:</span>
                        <span className="font-bold text-blue-500 uppercase ml-1.5">{comparingSnapshot.source}</span>
                      </div>
                      <div>
                        <span>Snapshot ID:</span>
                        <span className="font-bold ml-1.5">{comparingSnapshot.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 flex-shrink-0 select-none">
              <button
                onClick={() => setComparingSnapshot(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Close Comparison
              </button>
              <button
                onClick={() => {
                  setRestoringSnapshot(comparingSnapshot);
                  setComparingSnapshot(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Restore Specific Sections
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Section-Level Restore Selection dialog ── */}
      {restoringSnapshot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 select-none">Confirm Restore</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1">Select sections to load:</h3>
              </div>
              <button
                onClick={() => setRestoringSnapshot(null)}
                className="text-gray-400 hover:text-gray-650 transition font-bold cursor-pointer text-sm"
                aria-label="Close restore dialog"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed mb-2 select-none">
                Select which profile configurations you wish to restore from <b>{restoringSnapshot.title}</b> snapshot. Unchecked fields will remain untouched in your active editor workspace.
              </p>

              <div className="space-y-2.5 max-h-[40vh] overflow-y-auto custom-editor-scrollbar bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-250 dark:border-gray-800 select-none">
                {[
                  { id: 'name', label: '👤 Developer Name' },
                  { id: 'role', label: '💼 Professional Title/Role' },
                  { id: 'about', label: '🎯 About Me/Bio text' },
                  { id: 'skills', label: '🛠️ Skills checklist text' },
                  { id: 'projects', label: '📂 Projects Showcase text' },
                  { id: 'socials', label: '🌐 Social Contact links' },
                  { id: 'avatarUrl', label: '🖼️ Profile Avatar Image' },
                  { id: 'githubStats', label: '📊 GitHub Stats Cards' },
                  { id: 'techStack', label: '⚙️ Tech Badges List' },
                  { id: 'socialLinks', label: '🛡️ Social shields Badges' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2.5 cursor-pointer text-gray-700 dark:text-gray-300 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedRestoreFields[item.id]}
                      onChange={(e) =>
                        setSelectedRestoreFields({
                          ...selectedRestoreFields,
                          [item.id]: e.target.checked,
                        })
                      }
                      className="rounded text-blue-650 focus:ring-blue-500 dark:bg-gray-850 dark:border-gray-700"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 select-none">
              <button
                onClick={() => setRestoringSnapshot(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeSectionRestore}
                disabled={!Object.values(selectedRestoreFields).some(Boolean)}
                className="px-4 py-2 rounded-lg text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50"
              >
                Confirm Restore
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default READMEBuilderPage;
