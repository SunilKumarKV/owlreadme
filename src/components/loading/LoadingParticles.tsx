import React from 'react';

export const LoadingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Subtle particle grid dots */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      {/* Floating neon particle dots */}
      <div className="absolute top-1/6 left-1/5 w-2 h-2 rounded-full bg-blue-500/40 blur-[1px] animate-float-slow" />
      <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 rounded-full bg-purple-500/30 blur-[1px] animate-float-slow style={{ animationDelay: '1.5s' }}" />
      <div className="absolute top-1/4 right-1/4 w-2.5 h-2.5 rounded-full bg-indigo-500/40 blur-[1px] animate-float-slow style={{ animationDelay: '3s' }}" />
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-blue-400/30 blur-[1px] animate-float-slow style={{ animationDelay: '4.5s' }}" />
    </div>
  );
};

export default LoadingParticles;
