"use client";

import React from 'react';
import { PreviewWindowControlsProps } from '../../types/preview';

export const PreviewWindowControls: React.FC<PreviewWindowControlsProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close window"
        className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400 cursor-pointer"
      />
      <button
        type="button"
        onClick={onMinimize}
        aria-label="Minimize window"
        className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400 cursor-pointer"
      />
      <button
        type="button"
        onClick={onMaximize}
        aria-label="Maximize window"
        className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-green-400 cursor-pointer"
      />
    </div>
  );
};

export default PreviewWindowControls;
