import { useCallback } from 'react';
import useWorkspaceStore from '@/stores/workspace-store';

interface WorkspaceActionsOptions {
  addNotification: (msg: string) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setEditingWorkspaceId: (id: string | null) => void;
  setConfirmDeleteId: (id: string | null) => void;
  setNewProjectName: (name: string) => void;
  newProjectName: string;
  newProjectType: 'readme' | 'roadmap' | 'combined';
  editingName: string;
}

export const useWorkspaceActions = (options: WorkspaceActionsOptions) => {
  const {
    workspaces,
    activeWorkspaceId,
    createWorkspace,
    deleteWorkspace,
    renameWorkspace,
    duplicateWorkspace,
    loadWorkspace,
  } = useWorkspaceStore();

  const {
    addNotification,
    setIsCreateModalOpen,
    setEditingWorkspaceId,
    setConfirmDeleteId,
    setNewProjectName,
    newProjectName,
    newProjectType,
    editingName,
  } = options;

  const handleCreateWorkspace = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newProjectName.trim()) {
        createWorkspace(newProjectName.trim(), newProjectType);
        setNewProjectName('');
        setIsCreateModalOpen(false);
        addNotification(`Project "${newProjectName.trim()}" created successfully!`);
      }
    },
    [newProjectName, newProjectType, createWorkspace, setNewProjectName, setIsCreateModalOpen, addNotification]
  );

  const handleRenameSave = useCallback(
    (id: string) => {
      if (editingName.trim()) {
        renameWorkspace(id, editingName.trim());
        setEditingWorkspaceId(null);
        addNotification('Project renamed successfully!');
      }
    },
    [editingName, renameWorkspace, setEditingWorkspaceId, addNotification]
  );

  const handleDeleteWorkspace = useCallback(
    (id: string) => {
      deleteWorkspace(id);
      setConfirmDeleteId(null);
    },
    [deleteWorkspace, setConfirmDeleteId]
  );

  const handleDuplicateWorkspace = useCallback(
    (id: string) => {
      duplicateWorkspace(id);
    },
    [duplicateWorkspace]
  );

  const handleLoadWorkspace = useCallback(
    (id: string) => {
      loadWorkspace(id);
    },
    [loadWorkspace]
  );

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const isReadmeType = activeWorkspace
    ? activeWorkspace.type === 'readme' || activeWorkspace.type === 'combined'
    : true;
  const isRoadmapType = activeWorkspace
    ? activeWorkspace.type === 'roadmap' || activeWorkspace.type === 'combined'
    : true;

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    isReadmeType,
    isRoadmapType,
    handleCreateWorkspace,
    handleRenameSave,
    handleDeleteWorkspace,
    handleDuplicateWorkspace,
    handleLoadWorkspace,
  };
};
