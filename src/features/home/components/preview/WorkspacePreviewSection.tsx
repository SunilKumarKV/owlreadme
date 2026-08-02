"use client";

import React from 'react';
import Link from 'next/link';
import { Badge, Container, Section } from '@/components/ui';
import { MousePointerClick, Terminal, Code2 } from 'lucide-react';

export const WorkspacePreviewSection: React.FC = () => {
  return (
    <Section spacing="md" id="preview-showcase">
      <Container size="lg">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 text-left">
            <Badge variant="success">Visual Editor</Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Direct feedback with a live preview builder
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              OwlREADME provides a complete side-by-side workspace split. Write descriptions on the left, review formatted HTML output live in the center, and edit raw markdown codes directly on the right.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300 pt-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                <MousePointerClick className="h-4 w-4" /> Interactive controls
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40">
                <Terminal className="h-4 w-4" /> Syntax-highlighted output
              </span>
            </div>
          </div>

          {/* Realistic CSS Preview Grid of the actual split view */}
          <div className="flex-1 w-full" data-reveal="true">
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80 dark:border-gray-800/80 flex flex-col h-[340px] reveal-item opacity-0 translate-y-6 transition-all duration-500">
              
              {/* Top Editor Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/80 dark:border-gray-800 bg-gray-100/90 dark:bg-gray-900/90 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-blue-500" />
                  OwlREADME Builder Workspace
                </span>
                <span className="text-emerald-500 font-mono text-[11px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Syncing Active
                </span>
              </div>

              {/* Splits Mock Shell */}
              <div className="flex flex-1 overflow-hidden">
                
                {/* Left Panel: Section Manager */}
                <div className="w-1/3 border-r border-gray-200/80 dark:border-gray-800/80 p-4 space-y-2.5 bg-gray-50/50 dark:bg-gray-950/50 overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                    Section Manager
                  </span>
                  <div className="h-7 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center px-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 select-none">
                    ✓ Header Profile
                  </div>
                  <div className="h-7 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center px-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 select-none">
                    ✓ Tech Stack
                  </div>
                  <div className="h-7 bg-gray-200/60 dark:bg-gray-800/60 rounded-lg flex items-center px-2.5 text-xs select-none text-gray-600 dark:text-gray-400">
                    ⚙ Projects Showcase
                  </div>
                </div>

                {/* Right Panel: Live Preview */}
                <div className="flex-1 p-5 bg-white dark:bg-[#0c0c0e] flex flex-col justify-between overflow-hidden">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                      Live Preview Output
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs text-white font-bold shadow-sm select-none">
                        SK
                      </div>
                      <div className="space-y-1">
                        <div className="h-2.5 bg-gray-300 dark:bg-gray-700 rounded w-28" />
                        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-gray-200/60 dark:border-gray-800/60 pt-3 text-gray-500 dark:text-gray-400">
                    <span>Theme: Minimal</span>
                    <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                      Launch Editor &rarr;
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default WorkspacePreviewSection;
