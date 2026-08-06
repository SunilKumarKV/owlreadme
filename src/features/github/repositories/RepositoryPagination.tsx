import React from 'react';
import { Button, Typography } from '@/design-system';

export interface RepositoryPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const RepositoryPagination: React.FC<RepositoryPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between pt-4 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 font-medium">
        Page {page} of {totalPages}
      </Typography>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default RepositoryPagination;
