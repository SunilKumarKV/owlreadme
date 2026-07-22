'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { CommunityTemplate, TemplateCategory } from '@/stores/template-store';
import { CATEGORIES_LIST } from '@/utils/template-registry';

interface TemplateEditorModalProps {
  isOpen: boolean;
  template: CommunityTemplate | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<CommunityTemplate>) => void;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  template,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('Developer');
  const [tagsInput, setTagsInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'draft'>('private');

  useEffect(() => {
    if (template) {
      setName(template.name || '');
      setDescription(template.description || '');
      setCategory(template.category || 'Developer');
      setTagsInput((template.tags || []).join(', '));
      setTechInput((template.technologies || []).join(', '));
      setDifficulty(template.difficulty || 'Beginner');
      setVisibility(template.visibility || 'private');
    }
  }, [template, isOpen]);

  if (!isOpen || !template) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const technologies = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave(template.id, {
      name: name.trim(),
      description: description.trim(),
      category,
      tags,
      technologies,
      difficulty,
      visibility,
    });

    onClose();
  };

  const categories = CATEGORIES_LIST.filter((cat) => cat.id !== 'All');

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 select-none">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-500" />
            <h2 className="font-extrabold text-sm text-gray-900 dark:text-white">Edit Template Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 block">Template Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none transition text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none transition resize-none text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none cursor-pointer text-gray-900 dark:text-gray-100"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 block">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none cursor-pointer text-gray-900 dark:text-gray-100"
              >
                <option value="Beginner">⭐ Beginner</option>
                <option value="Intermediate">⭐⭐ Intermediate</option>
                <option value="Advanced">⭐⭐⭐ Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 block">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'private' | 'draft')}
                className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none cursor-pointer text-gray-900 dark:text-gray-100"
              >
                <option value="private">🔒 Private (Local only)</option>
                <option value="public">🌐 Public (Shareable)</option>
                <option value="draft">📝 Draft</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 block">Technologies</label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="react, typescript, nodejs"
                className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none transition text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 block">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. clean, minimal, dynamic"
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:outline-none transition text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 select-none">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TemplateEditorModal;
