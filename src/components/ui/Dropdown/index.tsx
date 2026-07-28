import React, { useState, useRef, useEffect, type FC, type ReactNode } from 'react';

export interface DropdownItem {
  id: string;
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown: FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left z-[1000]">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 ring-1 ring-black/5 divide-y divide-gray-100 dark:divide-gray-800 focus:outline-none ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={`flex items-center gap-2 w-full px-4 py-2 text-2xs text-left font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none cursor-pointer`}
                role="menuitem"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
