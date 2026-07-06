import { useState } from 'react';

export const useDialogState = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<'readme' | 'roadmap' | 'combined'>('combined');
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    newProjectName,
    setNewProjectName,
    newProjectType,
    setNewProjectType,
    editingWorkspaceId,
    setEditingWorkspaceId,
    editingName,
    setEditingName,
    confirmDeleteId,
    setConfirmDeleteId,
  };
};
