import React from 'react';
import LoadingParticles from './LoadingParticles';

export interface LoadingBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoadingBackground: React.FC<LoadingBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-[#090b10] dark:via-[#0c101d] dark:to-[#110e20] text-gray-900 dark:text-gray-100 transition-colors duration-500 ${className}`}
    >
      {/* Animated Light Beams & Glow Blobs */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl pointer-events-none animate-glow-bubble-1 transform-gpu" 
      />
      <div 
        className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none animate-glow-bubble-2 transform-gpu" 
      />
      <div 
        className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-3xl pointer-events-none animate-glow-bubble-3 transform-gpu" 
      />

      {/* Glossy Grid Mesh Overlay */}
      <LoadingParticles />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-2xl px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default LoadingBackground;
