"use client";

import React from 'react';
import { WindowControlsProps } from '../../types/preview';

export const WindowControls: React.FC<WindowControlsProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        type="button"
        onClick={onClose}
        className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-label="Close window"
      />
      <button
        type="button"
        onClick={onMinimize}
        className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
        aria-label="Minimize window"
      />
      <button
        type="button"
        onClick={onMaximize}
        className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Maximize window"
      />
    </div>
  );
};

export default WindowControls;
