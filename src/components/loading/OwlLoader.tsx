import React from 'react';

export interface OwlLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  progress?: number;
  className?: string;
}

export const OwlLoader: React.FC<OwlLoaderProps> = ({ size = 'md', progress, className = '' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const strokeWidth = size === 'lg' ? 3 : 2.5;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient Pulsing Glow Circle */}
      <div className="absolute inset-0 rounded-full bg-blue-500/20 dark:bg-blue-500/30 blur-xl animate-pulse" />

      {/* Outer Dashed Progress Ring */}
      <svg className={`${sizeMap[size]} animate-spin-reverse transform-gpu`} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray="6 8"
          className="text-blue-500/25 dark:text-blue-400/30"
        />
      </svg>

      {/* Main SVG Progress Ring (if progress provided) */}
      <svg className={`absolute inset-0 ${sizeMap[size]} -rotate-90 transform-gpu`} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-800"
        />
        {progress !== undefined && (
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#owl-loader-gradient)"
            strokeWidth={strokeWidth + 0.5}
            strokeDasharray="276.46"
            strokeDashoffset={276.46 - (276.46 * Math.min(100, Math.max(0, progress))) / 100}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        )}
        <defs>
          <linearGradient id="owl-loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Animated Owl Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-lg border border-blue-500/20 backdrop-blur-sm">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Owl Body & Eyes */}
            <path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9z" className="opacity-20" fill="currentColor" />
            <circle cx="9" cy="9" r="2" />
            <circle cx="15" cy="9" r="2" />
            <path d="M12 12l1 2h-2l1-2z" fill="currentColor" />
            <path d="M7 16c1.5 1 3.5 1 5 0s3.5-1 5 0" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OwlLoader;
