"use client";

import React from 'react';
import { Terminal } from 'lucide-react';
import { BRANDING } from '@/config/branding';

export const HeroPreviewWindow: React.FC = () => {
  return (
    <div className="flex-1 w-full max-w-lg lg:max-w-none" data-reveal="true">
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80 dark:border-gray-800/80 transition-all duration-500 hover:shadow-blue-500/10">
        
        {/* macOS Editor Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100/90 dark:bg-gray-900/90 border-b border-gray-200/80 dark:border-gray-800 select-none">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/30" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/30" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/30" />
          </div>

          <div className="flex items-center space-x-1.5 bg-gray-200/60 dark:bg-gray-800/60 px-3 py-1 rounded-md text-[11px] font-mono text-gray-600 dark:text-gray-300">
            <Terminal className="h-3 w-3 text-blue-500" />
            <span>README.md — OwlREADME Editor</span>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Sync Ready</span>
          </div>
        </div>

        {/* Editor Body Shell (Clean Markdown Code View - No Fake Statistics) */}
        <div className="p-6 font-mono text-xs leading-relaxed space-y-4 bg-gray-950 text-gray-200 overflow-x-auto min-h-[300px]">
          <div className="space-y-1">
            <span className="text-gray-500">&lt;!-- Profile Header Section --&gt;</span>
            <div>
              <span className="text-blue-400 font-bold"># 🦉 Hi, I&apos;m Sunil Kumar</span>
            </div>
            <p className="text-gray-300 text-[11px]">Senior Full-Stack Engineer passionate about performant web architectures.</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-800/80">
            <span className="text-gray-500">&lt;!-- Tech Stack &amp; Skills --&gt;</span>
            <div className="text-purple-400 font-semibold">## ⚡ Technologies &amp; Tools</div>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-blue-300 font-medium">React</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-indigo-300 font-medium">Next.js</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-purple-300 font-medium">TypeScript</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-emerald-300 font-medium">Node.js</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-amber-300 font-medium">TailwindCSS</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-800/80">
            <span className="text-gray-500">&lt;!-- Featured Projects Section --&gt;</span>
            <div className="text-purple-400 font-semibold">## 🚀 Featured Projects</div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-gray-900/90 border border-gray-800 flex flex-col gap-1">
                <span className="text-white font-bold text-[11px]">📦 owlreadme</span>
                <span className="text-gray-400 text-[10px]">Next-generation profile README and career roadmap generator tool.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-gray-500 italic flex items-center justify-between">
            <span>Ready for live preview rendering &amp; 1-click package export</span>
            <span className="text-blue-400 font-mono font-semibold">v{BRANDING.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPreviewWindow;
