import React from 'react';
import { Button } from '@/design-system';
import { Icon } from '@/design-system/icons';
import { ExportFormat } from '@/types/export';

export interface ExportButtonProps {
  format?: ExportFormat;
  label?: string;
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  format = 'markdown',
  label,
  onClick,
  isLoading = false,
  isDisabled = false,
  className = '',
}) => {
  const iconName = format === 'zip' ? 'folder' : 'file';
  const defaultLabel = format === 'zip' ? 'Export ZIP Package' : 'Export README.md';

  return (
    <Button
      variant="primary"
      size="md"
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      aria-label={label || defaultLabel}
    >
      <Icon name={iconName} size="sm" />
      <span>{isLoading ? 'Exporting...' : label || defaultLabel}</span>
    </Button>
  );
};

export default ExportButton;
