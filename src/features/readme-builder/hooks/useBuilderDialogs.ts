import React, { useEffect, useState } from 'react';
import useWorkspaceStore from '@/stores/workspace-store';
import useReadmeStore, { SectionId } from '@/stores/readme-store';
import { useHistoryStore, Snapshot } from '@/stores/history-store';
import { parseReadmeMarkdown } from '@/utils/readme-importer';
import { generateReadmeMarkdown } from '@/utils/markdown';
import { getCurrentConfig } from '../utils/builder-helpers';
import { TemplateCategory } from '@/stores/template-store';

export const useBuilderDialogs = () => {
  // Stores
  const { createWorkspace, setActiveWorkspaceId } = useWorkspaceStore();
  const readmeStore = useReadmeStore();
  const {
    snapshots,
    past,
    future,
    createSnapshot,
    deleteSnapshot,
    clearHistory,
    importSnapshots,
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
  const [importMethod, setImportMethod] = useState<'username' | 'repoUrl' | 'rawUrl' | 'paste' | 'upload'>('username');
  const [importUsernameInput, setImportUsernameInput] = useState('');
  const [importRepoUrlInput, setImportRepoUrlInput] = useState('');
  const [importRawUrlInput, setImportRawUrlInput] = useState('');
  const [importPasteMarkdown, setImportPasteMarkdown] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'fetching' | 'parsing' | 'summary' | 'success' | 'error'>('idle');
  const [importStatusMessage, setImportStatusMessage] = useState('');
  const [parsedImportResult, setParsedImportResult] = useState<any | null>(null);
  const [selectedImportSections, setSelectedImportSections] = useState<SectionId[]>([]);
  const [conflictResolution, setConflictResolution] = useState<'new' | 'overwrite' | 'merge'>('new');

  const executeImportReadme = async (markdownText: string) => {
    try {
      setImportStatus('parsing');
      setImportStatusMessage('Parsing layout structures...');
      
      const parsed = parseReadmeMarkdown(markdownText);
      setParsedImportResult(parsed);
      setSelectedImportSections(parsed.detectedSections);
      
      setImportStatus('summary');
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
        
        const rawRes = await fetch(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`);
        if (rawRes.ok) {
          markdownText = await rawRes.text();
        } else {
          const masterRes = await fetch(`https://raw.githubusercontent.com/${username}/${username}/master/README.md`);
          if (masterRes.ok) {
            markdownText = await masterRes.text();
          } else {
            const apiRes = await fetch(`https://api.github.com/repos/${username}/${username}/contents/README.md`, {
              headers: { Accept: 'application/vnd.github.v3.raw' }
            });
            if (!apiRes.ok) throw new Error(`Could not find profile README for user "${username}".`);
            markdownText = await apiRes.text();
          }
        }
      } else if (importMethod === 'repoUrl') {
        const urlStr = importRepoUrlInput.trim();
        if (!urlStr) throw new Error('Please enter a GitHub repository URL.');
        
        const match = urlStr.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
        if (!match) throw new Error('Invalid GitHub repository URL format.');
        const owner = match[1];
        const repo = match[2].replace(/\.git$/, '');

        const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
          headers: { Accept: 'application/vnd.github.v3.raw' }
        });
        if (!apiRes.ok) {
          const rawMain = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`);
          if (rawMain.ok) {
            markdownText = await rawMain.text();
          } else {
            const rawMaster = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`);
            if (rawMaster.ok) {
              markdownText = await rawMaster.text();
            } else {
              throw new Error(`Failed to locate README.md file in repository "${owner}/${repo}".`);
            }
          }
        } else {
          markdownText = await apiRes.text();
        }
      } else if (importMethod === 'rawUrl') {
        const urlStr = importRawUrlInput.trim();
        if (!urlStr) throw new Error('Please enter a raw URL.');
        const res = await fetch(urlStr);
        if (!res.ok) throw new Error('Failed to fetch content from the specified URL.');
        markdownText = await res.text();
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
      } catch (err: any) {
        setImportStatus('error');
        setImportStatusMessage('Failed to read upload file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResolveImport = () => {
    if (!parsedImportResult) return;

    if (conflictResolution === 'new') {
      const workspaceName = prompt('Enter a name for the imported workspace:', 'Imported GitHub Profile');
      if (workspaceName && workspaceName.trim()) {
        const wsId = createWorkspace(workspaceName.trim(), 'readme');
        setActiveWorkspaceId(wsId);
        readmeStore.importReadmeData(parsedImportResult.data, selectedImportSections);
        setIsImportModalOpen(false);
        setImportStatus('idle');
        alert(`Successfully imported README into new workspace "${workspaceName.trim()}"!`);
      }
    } else if (conflictResolution === 'overwrite') {
      if (confirm('Are you sure you want to overwrite your active workspace? All unselected sections will be disabled.')) {
        readmeStore.importReadmeData(parsedImportResult.data, selectedImportSections);
        setIsImportModalOpen(false);
        setImportStatus('idle');
        alert('Active workspace overwritten with imported README sections successfully!');
      }
    } else if (conflictResolution === 'merge') {
      readmeStore.importReadmeData(parsedImportResult.data, selectedImportSections);
      setIsImportModalOpen(false);
      setImportStatus('idle');
      alert('Selected README sections merged into active workspace successfully!');
    }
  };

  // 3. Snapshot, compare, and version history Sidebar system
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [manualSnapshotForm, setManualSnapshotForm] = useState({ title: '', description: '' });

  const [comparingSnapshot, setComparingSnapshot] = useState<Snapshot | null>(null);
  const [restoringSnapshot, setRestoringSnapshot] = useState<Snapshot | null>(null);
  const [copiedDiffCode, setCopiedDiffCode] = useState(false);
  const [diffVisualTab, setDiffVisualTab] = useState<'visual' | 'code' | 'summary'>('visual');

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

  const handleUndo = () => {
    const prev = undo(getCurrentConfig());
    if (prev) {
      useReadmeStore.setState(prev);
    }
  };

  const handleRedo = () => {
    const next = redo(getCurrentConfig());
    if (next) {
      useReadmeStore.setState(next);
    }
  };

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
    const restorePayload: any = {};
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

  const [compareSnapshotMarkdown, setCompareSnapshotMarkdown] = useState('');
  const [compareCurrentMarkdown, setCompareCurrentMarkdown] = useState('');

  useEffect(() => {
    if (comparingSnapshot) {
      try {
        setCompareSnapshotMarkdown(generateReadmeMarkdown(comparingSnapshot.config));
        setCompareCurrentMarkdown(generateReadmeMarkdown(getCurrentConfig()));
      } catch (err) {
        console.error('Failed to compile compare markdown', err);
      }
    } else {
      setCompareSnapshotMarkdown('');
      setCompareCurrentMarkdown('');
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
  }, [past, future]);

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
