import { useCallback, KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';

export interface UseCardOptions {
  clickable?: boolean;
  disabled?: boolean;
  onClick?: (event: SyntheticEvent<HTMLDivElement>) => void;
}

export function useCard({ clickable, disabled, onClick }: UseCardOptions = {}) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!clickable || disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (onClick) {
          onClick(event);
        }
      }
    },
    [clickable, disabled, onClick]
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!clickable || disabled) return;
      if (onClick) {
        onClick(event);
      }
    },
    [clickable, disabled, onClick]
  );

  return {
    tabIndex: clickable && !disabled ? 0 : undefined,
    role: clickable ? 'button' : undefined,
    handleKeyDown,
    handleClick,
  };
}

export default useCard;
