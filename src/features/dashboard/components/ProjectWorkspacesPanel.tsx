import Button from '@/components/Button';
import { Plus, Edit2, Copy, Trash2 } from 'lucide-react';
import { Workspace } from '@/stores/workspace-store';

interface ProjectWorkspacesPanelProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  editingWorkspaceId: string | null;
  setEditingWorkspaceId: (id: string | null) => void;
  editingName: string;
  setEditingName: (name: string) => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
  handleRenameSave: (id: string) => void;
  handleDeleteWorkspace: (id: string) => void;
  handleDuplicateWorkspace: (id: string) => void;
  handleLoadWorkspace: (id: string) => void;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const ProjectWorkspacesPanel = ({
  workspaces,
  activeWorkspaceId,
  editingWorkspaceId,
  setEditingWorkspaceId,
  editingName,
  setEditingName,
  confirmDeleteId,
  setConfirmDeleteId,
  handleRenameSave,
  handleDeleteWorkspace,
  handleDuplicateWorkspace,
  handleLoadWorkspace,
  setIsCreateModalOpen,
}: ProjectWorkspacesPanelProps) => {
  return (
    <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-800 mb-4">
        <h2 className="text-xl font-bold">Project Workspaces</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} className="text-xs py-1.5 px-3 flex items-center gap-1" variant="primary">
          <Plus className="h-3.5 w-3.5" /> New Project
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p className="mb-4">No project workspaces found.</p>
          <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" className="text-xs">Create your first project</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {workspaces.map((w) => {
            const isActive = w.id === activeWorkspaceId;
            const isEditing = editingWorkspaceId === w.id;

            return (
              <div
                key={w.id}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/10 dark:bg-blue-950/10'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="px-2 py-0.5 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-black dark:text-white"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSave(w.id);
                            if (e.key === 'Escape') setEditingWorkspaceId(null);
                          }}
                        />
                        <button
                          onClick={() => handleRenameSave(w.id)}
                          className="text-xs text-green-500 hover:underline font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingWorkspaceId(null)}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-base text-gray-800 dark:text-gray-100">{w.name}</h3>
                        <button
                          onClick={() => {
                            setEditingWorkspaceId(w.id);
                            setEditingName(w.name);
                          }}
                          className="text-xs text-gray-400 hover:text-blue-500 transition cursor-pointer"
                          title="Rename project"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}

                    {/* Workspace Type Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide ${
                        w.type === 'readme'
                          ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                          : w.type === 'roadmap'
                          ? 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400'
                          : 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      {w.type}
                    </span>

                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-blue-500 text-white uppercase tracking-wide">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Updated: {new Date(w.updatedAt).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Theme: <span className="capitalize">{w.theme}</span>
                    {w.type !== 'roadmap' && ` | Template: ${w.readmeData.template || 'minimal'}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!isActive && (
                    <Button onClick={() => handleLoadWorkspace(w.id)} className="text-xs py-1.5 px-3 animate-hover" variant="primary">
                      Open
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDuplicateWorkspace(w.id)}
                    className="text-xs py-1.5 px-3 animate-hover"
                    variant="secondary"
                    title="Duplicate project"
                    aria-label={`Duplicate project ${w.name}`}
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  {confirmDeleteId === w.id ? (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-red-500 font-semibold">Delete?</span>
                      <button
                        onClick={() => { handleDeleteWorkspace(w.id); }}
                        className="text-red-500 hover:underline font-bold cursor-pointer"
                        aria-label={`Confirm delete project ${w.name}`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-gray-500 hover:underline cursor-pointer"
                        aria-label="Cancel delete"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setConfirmDeleteId(w.id)}
                      className="text-xs py-1.5 px-3 bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 animate-hover"
                      variant="secondary"
                      title="Delete project"
                      aria-label={`Delete project ${w.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
