import Button from '@/components/Button';

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
  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in text-black dark:text-white">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="e.g., Portfolio README, Node curriculum"
              className="w-full px-3 py-2 border rounded-md bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Workspace Type
            </label>
            <select
              value={newProjectType}
              onChange={(e) => setNewProjectType(e.target.value as 'readme' | 'roadmap' | 'combined')}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
            >
              <option value="combined">Combined (README + Roadmap)</option>
              <option value="readme">README Profile Only</option>
              <option value="roadmap">Learning Roadmap Only</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => setIsCreateModalOpen(false)}
              type="button"
              variant="secondary"
              className="text-xs py-1.5 px-4 animate-hover"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="text-xs py-1.5 px-4 animate-hover">
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
