import { useState, useCallback } from 'react';

export interface UseButtonOptions {
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function useButton({ onClick, disabled, loading }: UseButtonOptions = {}) {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (disabled || loading || internalLoading) {
        event.preventDefault();
        return;
      }
      if (onClick) {
        onClick(event);
      }
    },
    [onClick, disabled, loading, internalLoading]
  );

  return {
    isDisabled: disabled || loading || internalLoading,
    isLoading: loading || internalLoading,
    setInternalLoading,
    handleClick,
  };
}

export default useButton;
