"use client";

import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  /** Whether the trap is currently active. */
  active: boolean;
  /** Content to render inside the trap. */
  children: React.ReactNode;
  /** Called when the Escape key is pressed. */
  onEscape?: () => void;
}

/**
 * FocusTrap — keeps keyboard focus inside a modal or dialog while active.
 *
 * Behaviour:
 * - On mount (when active=true): moves focus to the first focusable element inside.
 * - Tab / Shift+Tab cycle focus within the container, never leaving it.
 * - Pressing Escape calls onEscape() if provided.
 * - On unmount / deactivation: restores focus to the element that was focused before
 *   the trap was activated.
 *
 * Usage:
 *   <FocusTrap active={isOpen} onEscape={() => setIsOpen(false)}>
 *     <div role="dialog" aria-modal="true">...</div>
 *   </FocusTrap>
 */
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function FocusTrap({ active, children, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the element that was focused before the trap opened
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Move focus to the first focusable element inside the trap
    const focusable = containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    const first = focusable?.[0];
    let rafId: number | null = null;
    if (first) {
      // Use rAF to ensure the DOM is fully painted before focusing
      rafId = requestAnimationFrame(() => first.focus());
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      // Restore focus to the previously focused element when trap deactivates
      previouslyFocusedRef.current?.focus();
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter((el) => !el.closest('[hidden]') && el.offsetParent !== null);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, onEscape]);

  return (
    <div ref={containerRef} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
