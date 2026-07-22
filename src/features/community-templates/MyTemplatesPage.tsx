'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  Edit2,
  Eye,
  Search,
  FolderGit2,
} from 'lucide-react';
import { useTemplateStore, CommunityTemplate } from '@/stores/template-store';
import useReadmeStore from '@/stores/readme-store';
import { useWorkspaceStore } from '@/stores/workspace-store';
import TemplateEditorModal from './components/TemplateEditorModal';
import TemplatePreviewModal from './components/TemplatePreviewModal';

export const MyTemplatesPage: React.FC = () => {
  const router = useRouter();
  const {
    templates,
    createTemplate,
    deleteTemplate,
    duplicateTemplate,
    updateTemplate,
    importTemplate,
  } = useTemplateStore();

  const applyTemplate = useReadmeStore((state) => state.applyTemplate);
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const setActiveWorkspaceId = useWorkspaceStore((state) => state.setActiveWorkspaceId);

  // Modals & States
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunityTemplate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showToast = (success: string | null, error: string | null = null) => {
    setSuccessMessage(success);
    setErrorMessage(error);
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 4000);
  };

  // Only display user-created or imported templates (isCustom: true)
  const myTemplatesList = useMemo(() => {
    return templates.filter((tpl) => {
      const isUserCustom = tpl.isCustom;
      if (!isUserCustom) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(q);
        const matchesDesc = (tpl.description || '').toLowerCase().includes(q);
        return matchesName || matchesDesc;
      }
      return true;
    });
  }, [templates, searchQuery]);

  const handleCreateBlank = () => {
    const id = createTemplate('My Blank Template', 'Developer');
    const created = useTemplateStore.getState().templates.find((t) => t.id === id);
    if (created) {
      setSelectedTemplate(created);
      setIsEditorOpen(true);
      showToast('Created new template successfully!');
    }
  };

  const handleUseTemplate = (template: CommunityTemplate) => {
    const wsName = `${template.name} Workspace`;
    const newWsId = createWorkspace(wsName, 'readme');
    setActiveWorkspaceId(newWsId);
    
    // We map category to the appropriate legacy/registry structure if necessary
    applyTemplate(template);
    
    showToast(`Loaded "${template.name}" into builder successfully!`);
    router.push('/readme-builder');
  };

  const handleDuplicate = (id: string) => {
    const newId = duplicateTemplate(id);
    if (newId) {
      showToast('Template duplicated successfully!');
    }
  };

  const handleExportJSON = (template: CommunityTemplate) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${template.name.toLowerCase().replace(/\s+/g, '-')}.template.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast(`Exported "${template.name}" as JSON file.`);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importTemplate(content);
      if (res.success) {
        showToast('Template imported & validated successfully!');
      } else {
        showToast(null, res.error || 'Import failed validation.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      {/* Toasts */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2">
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
          >
            ← Dashboard
          </button>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-2 select-none">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">📁</span>
              <span>My Templates</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 select-none">
          <label className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Import JSON (.template.json)
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={handleCreateBlank}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Template
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 space-y-6 w-full">
        {/* Search Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your custom templates by name or description..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-xl focus:outline-none transition text-gray-900 dark:text-gray-100"
            />
          </div>
          <span className="text-2xs font-bold uppercase tracking-wider text-gray-400">
            Total custom templates: {myTemplatesList.length}
          </span>
        </div>

        {/* Templates Grid */}
        {myTemplatesList.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-4">
            <FolderGit2 className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
            <h3 className="font-extrabold text-sm text-gray-700 dark:text-gray-300">No Custom Templates</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Save your current README builder states as templates or import a `.template.json` file to get started.
            </p>
            <button
              onClick={handleCreateBlank}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              Create Blank Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTemplatesList.map((tpl) => (
              <div
                key={tpl.id}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  {/* Category & Visibility Header */}
                  <div className="flex items-center justify-between text-2xs font-bold text-gray-400">
                    <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
                      {tpl.category}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                      {tpl.visibility}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {tpl.tags && tpl.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-2xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex items-center justify-between flex-wrap gap-2 select-none">
                  {/* Left Side Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setIsPreviewOpen(true);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
                      title="Preview Template"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setIsEditorOpen(true);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-lg transition cursor-pointer"
                      title="Edit Template Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(tpl.id)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-500/10 rounded-lg transition cursor-pointer"
                      title="Duplicate Template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExportJSON(tpl)}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-500/10 rounded-lg transition cursor-pointer"
                      title="Export as JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() => deleteTemplate(tpl.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUseTemplate(tpl)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-2xs font-bold rounded-lg shadow-sm transition cursor-pointer"
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      <TemplateEditorModal
        isOpen={isEditorOpen}
        template={selectedTemplate}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedTemplate(null);
        }}
        onSave={(id, updates) => {
          updateTemplate(id, updates);
          showToast('Template details updated successfully!');
        }}
      />

      {/* Preview Modal */}
      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        template={selectedTemplate}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedTemplate(null);
        }}
        onUse={handleUseTemplate}
      />
    </div>
  );
};

export default MyTemplatesPage;
