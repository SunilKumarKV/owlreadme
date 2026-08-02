"use client";

import React from 'react';
import { Container } from '@/components/ui';

export const HighlightMetricsBar: React.FC = () => {
  return (
    <section className="bg-gray-100/80 dark:bg-[#101014] border-y border-gray-200/80 dark:border-gray-800/80 py-8 transition-colors select-none">
      <Container size="lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl glass-card border border-gray-200/60 dark:border-gray-800/60">
            <span className="block text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">100%</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 block">Client-Side Logic</span>
          </div>
          <div className="p-4 rounded-xl glass-card border border-gray-200/60 dark:border-gray-800/60">
            <span className="block text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">0</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 block">Remote Databases</span>
          </div>
          <div className="p-4 rounded-xl glass-card border border-gray-200/60 dark:border-gray-800/60">
            <span className="block text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">1-Click</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 block">Package Export</span>
          </div>
          <div className="p-4 rounded-xl glass-card border border-gray-200/60 dark:border-gray-800/60">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">MIT</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 block">Open Source License</span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HighlightMetricsBar;
