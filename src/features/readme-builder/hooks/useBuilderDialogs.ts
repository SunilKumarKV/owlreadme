/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import useWorkspaceStore from '@/stores/workspace-store';
import useReadmeStore, { SectionId } from '@/stores/readme-store';
import { useHistoryStore, Snapshot } from '@/stores/history-store';
import { parseReadmeMarkdown } from '@/utils/readme-importer';
import { generateREADME } from '@/utils/markdown';
import {
  fetchGithubReadmeByRepo,
  fetchGithubReadmeFromRawUrl,
  parseGithubRepositoryUrl,
  validateGithubUsername,
} from '@/utils/github-api';
import { getCurrentConfig } from '../utils/builder-helpers';
import { TemplateCategory } from '@/stores/template-store';
import type { DiffVisualTab, ConflictResolution, ImportMethod } from '../types/builder-types';

export const useBuilderDialogs = () => {
  // Stores
  const { createWorkspace, setActiveWorkspaceId } = useWorkspaceStore();
  const readmeStore = useReadmeStore();
  const {
    createSnapshot,
    pushUndo,
    undo,
    redo,
  } = useHistoryStore();

  // 1. Publishing template modal
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishForm, setPublishForm] = useState({
    name: '',
    description: '',
    author: '',
    category: 'minimal' as TemplateCategory,
    tagsInput: '',
  });

  // 2. README Import Wizard Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importMethod, setImportMethod] = useState<ImportMethod>('username');
  const [importUsernameInput, setImportUsernameInput] = useState('');
  const [importRepoUrlInput, setImportRepoUrlInput] = useState('');
  const [importRawUrlInput, setImportRawUrlInput] = useState('');
  const [importPasteMarkdown, setImportPasteMarkdown] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'fetching' | 'parsing' | 'summary' | 'success' | 'error'>('idle');
  const [importStatusMessage, setImportStatusMessage] = useState('');
  const [parsedImportResult, setParsedImportResult] = useState<any | null>(null);
  const [selectedImportSections, setSelectedImportSections] = useState<SectionId[]>([]);
  const [conflictResolution, setConflictResolution] = useState<ConflictResolution>('new');

  const executeImportReadme = async (markdownText: string) => {
    try {
      setImportStatus('parsing');
      setImportStatusMessage('Parsing layout structures...');
      
      const parsed = parseReadmeMarkdown(markdownText);
      setParsedImportResult(parsed);
      setSelectedImportSections(parsed.detectedSections);
      
      if (conflictResolution === 'new') {
        const workspaceName = prompt('Enter a name for the imported workspace:', 'Imported GitHub Profile');
        if (workspaceName && workspaceName.trim()) {
          const wsId = createWorkspace(workspaceName.trim(), 'readme');
          setActiveWorkspaceId(wsId);
          readmeStore.importReadmeData(parsed.data, parsed.detectedSections);
          setIsImportModalOpen(false);
          setImportStatus('idle');
          alert(`Successfully imported README into new workspace "${workspaceName.trim()}"!`);
        } else {
          setImportStatus('idle');
        }
      } else if (conflictResolution === 'overwrite') {
        if (confirm('Are you sure you want to overwrite your active workspace? This will replace your current workspace content.')) {
          readmeStore.importReadmeData(parsed.data, parsed.detectedSections);
          setIsImportModalOpen(false);
          setImportStatus('idle');
          alert('Active workspace overwritten with imported README successfully!');
        } else {
          setImportStatus('idle');
        }
      } else if (conflictResolution === 'merge') {
        readmeStore.importReadmeData(parsed.data, parsed.detectedSections);
        setIsImportModalOpen(false);
        setImportStatus('idle');
        alert('README sections merged into active workspace successfully!');
      }
    } catch (err: any) {
      setImportStatus('error');
      setImportStatusMessage(err.message || 'Failed to parse Markdown content.');
    }
  };

  const handleFetchReadme = async () => {
    setImportStatus('fetching');
    setImportStatusMessage('Fetching README content from GitHub...');
    try {
      let markdownText = '';
      if (importMethod === 'username') {
        const username = importUsernameInput.trim();
        if (!username) throw new Error('Please enter a GitHub username.');
        validateGithubUsername(username);
        markdownText = await fetchGithubReadmeByRepo(username, username);
      } else if (importMethod === 'repoUrl') {
        const urlStr = importRepoUrlInput.trim();
        if (!urlStr) throw new Error('Please enter a GitHub repository URL.');
        const { owner, repo } = parseGithubRepositoryUrl(urlStr);
        markdownText = await fetchGithubReadmeByRepo(owner, repo);
      } else if (importMethod === 'rawUrl') {
        markdownText = await fetchGithubReadmeFromRawUrl(importRawUrlInput.trim());
      } else if (importMethod === 'paste') {
        markdownText = importPasteMarkdown;
        if (!markdownText.trim()) throw new Error('Please paste your Markdown content.');
      }

      await executeImportReadme(markdownText);
    } catch (err: any) {
      setImportStatus('error');
      setImportStatusMessage(err.message || 'An error occurred during fetch.');
    }
  };

  const handleFileUploadImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus('fetching');
    setImportStatusMessage('Reading file content...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        await executeImportReadme(text);
      } catch {
        setImportStatus('error');
        setImportStatusMessage('Failed to read upload file.');
      }
    };
    reader.readAsText(file);
  };

  // 3. Snapshot, compare, and version history Sidebar system
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [manualSnapshotForm, setManualSnapshotForm] = useState({ title: '', description: '' });

  const [comparingSnapshot, setComparingSnapshot] = useState<Snapshot | null>(null);
  const [restoringSnapshot, setRestoringSnapshot] = useState<Snapshot | null>(null);
  const [copiedDiffCode, setCopiedDiffCode] = useState(false);
  const [diffVisualTab, setDiffVisualTab] = useState<DiffVisualTab>('visual');

  const [selectedRestoreFields, setSelectedRestoreFields] = useState<Record<string, boolean>>({
    name: true,
    role: true,
    about: true,
    skills: true,
    projects: true,
    socials: true,
    avatarUrl: true,
    githubStats: true,
    techStack: true,
    socialLinks: true,
  });

  const triggerAutoSnapshot = (source: Snapshot['source'], customTitle?: string) => {
    createSnapshot(
      customTitle || `${source.toUpperCase()} Save point`,
      'Automatic version save point',
      source,
      getCurrentConfig()
    );
  };

  const handleUndo = useCallback(() => {
    const prev = undo(getCurrentConfig());
    if (prev) {
      useReadmeStore.setState(prev);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const next = redo(getCurrentConfig());
    if (next) {
      useReadmeStore.setState(next);
    }
  }, [redo]);

  const handleManualSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSnapshotForm.title.trim()) return;
    createSnapshot(
      manualSnapshotForm.title,
      manualSnapshotForm.description || 'Manual backup snapshot',
      'manual',
      getCurrentConfig()
    );
    setManualSnapshotForm({ title: '', description: '' });
  };

  const executeSectionRestore = () => {
    if (!restoringSnapshot) return;
    const restorePayload: Partial<Snapshot['config']> = {};
    const cfg = restoringSnapshot.config;
    
    if (selectedRestoreFields.name) restorePayload.name = cfg.name;
    if (selectedRestoreFields.role) restorePayload.role = cfg.role;
    if (selectedRestoreFields.about) restorePayload.about = cfg.about;
    if (selectedRestoreFields.skills) restorePayload.skills = cfg.skills;
    if (selectedRestoreFields.projects) restorePayload.projects = cfg.projects;
    if (selectedRestoreFields.socials) restorePayload.socials = cfg.socials;
    if (selectedRestoreFields.avatarUrl) restorePayload.avatarUrl = cfg.avatarUrl;
    if (selectedRestoreFields.githubStats) restorePayload.githubStats = cfg.githubStats;
    if (selectedRestoreFields.techStack) restorePayload.techStack = cfg.techStack;
    if (selectedRestoreFields.socialLinks) restorePayload.socialLinks = cfg.socialLinks;
    
    pushUndo(getCurrentConfig());
    useReadmeStore.setState(restorePayload);
    setRestoringSnapshot(null);
  };

  const handleUndoCapture = () => {
    pushUndo(getCurrentConfig());
  };

  const { compareSnapshotMarkdown, compareCurrentMarkdown } = useMemo(() => {
    if (!comparingSnapshot) {
      return { compareSnapshotMarkdown: '', compareCurrentMarkdown: '' };
    }
    try {
      return {
        compareSnapshotMarkdown: generateREADME(comparingSnapshot.config),
        compareCurrentMarkdown: generateREADME(getCurrentConfig())
      };
    } catch (err) {
      console.error('Failed to compile compare markdown', err);
      return { compareSnapshotMarkdown: '', compareCurrentMarkdown: '' };
    }
  }, [comparingSnapshot]);

  // Keyboard shortcut listener for Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (isMeta && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (isMeta && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return {
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
    setImportStatusMessage,
    parsedImportResult,
    setParsedImportResult,
    selectedImportSections,
    setSelectedImportSections,
    conflictResolution,
    setConflictResolution,
    handleFetchReadme,
    handleFileUploadImport,
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
    copiedDiffCode,
    setCopiedDiffCode,
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
  };
};
