import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, Button, Typography } from '@/design-system';
import { Icon } from '@/design-system/icons';
import { ExportFormat } from '@/types/export';

export interface ExportMenuProps {
  onSelectFormat: (format: ExportFormat) => void;
  isDisabled?: boolean;
  className?: string;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  onSelectFormat,
  isDisabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (format: ExportFormat) => {
    onSelectFormat(format);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      <Button
        variant="primary"
        size="md"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isDisabled}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2"
      >
        <Icon name="external-link" size="sm" />
        <span>Export Document</span>
        <Icon name="chevron-down" size="xs" />
      </Button>

      {isOpen && (
        <GlassCard className="absolute right-0 mt-2 w-56 p-2 space-y-1 shadow-xl z-50 border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleSelect('markdown')}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Icon name="file" size="sm" className="text-purple-500" />
              <Typography variant="body-sm" className="font-semibold">
                README.md
              </Typography>
            </div>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              Markdown
            </Typography>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('zip')}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Icon name="folder" size="sm" className="text-purple-500" />
              <Typography variant="body-sm" className="font-semibold">
                ZIP Package
              </Typography>
            </div>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              Archive
            </Typography>
          </button>
        </GlassCard>
      )}
    </div>
  );
};

export default ExportMenu;
