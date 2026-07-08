import React, { useEffect, useRef, type FC, type ReactNode } from 'react';
import FocusTrap from '@/components/FocusTrap';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title-id"
    >
      <FocusTrap active={isOpen}>
        <div
          ref={modalRef}
          className={`bg-white dark:bg-[#121212] border border-gray-250 dark:border-gray-800 rounded-xl shadow-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 ${widths[maxWidth]}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex-shrink-0">
            <h2 id="modal-title-id" className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition font-bold cursor-pointer text-sm"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto custom-editor-scrollbar flex-1 text-xs">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </FocusTrap>
    </div>
  );
};

export default Modal;
