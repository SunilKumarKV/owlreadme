import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface WorkspaceDialogsProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  newProjectName: string;
  setNewProjectName: (name: string) => void;
  newProjectType: 'readme' | 'roadmap' | 'combined';
  setNewProjectType: (type: 'readme' | 'roadmap' | 'combined') => void;
  handleCreateWorkspace: (e: React.FormEvent) => void;
}

export const WorkspaceDialogs = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  newProjectName,
  setNewProjectName,
  newProjectType,
  setNewProjectType,
  handleCreateWorkspace,
}: WorkspaceDialogsProps) => {
  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      title="Create New Project"
      maxWidth="md"
    >
      <form onSubmit={handleCreateWorkspace} className="space-y-4">
        <Input
          id="new-project-name"
          label="Project Name"
          required
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="e.g., Portfolio README, Node curriculum"
        />

        <Select
          id="new-project-type"
          label="Workspace Type"
          value={newProjectType}
          onChange={(e) => setNewProjectType(e.target.value as 'readme' | 'roadmap' | 'combined')}
          options={[
            { value: 'combined', label: 'Combined (README + Roadmap)' },
            { value: 'readme', label: 'README Profile Only' },
            { value: 'roadmap', label: 'Learning Roadmap Only' },
          ]}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            onClick={() => setIsCreateModalOpen(false)}
            type="button"
            variant="secondary"
            className="text-xs py-1.5 px-4"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="text-xs py-1.5 px-4">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WorkspaceDialogs;
