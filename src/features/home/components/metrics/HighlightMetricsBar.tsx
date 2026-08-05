"use client";

import React from 'react';
import { Container } from '@/components/ui';
import { GlassCard, Typography } from '@/design-system';

export const HighlightMetricsBar: React.FC = () => {
  return (
    <section className="bg-gray-100/80 dark:bg-[#101014] border-y border-gray-200/80 dark:border-gray-800/80 py-6 sm:py-8 transition-colors select-none">
      <Container size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <GlassCard className="p-4 border border-gray-200/60 dark:border-gray-800/60">
            <Typography variant="heading-lg" className="block font-black text-blue-600 dark:text-blue-400">
              100%
            </Typography>
            <Typography variant="caption" className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 block">
              Client-Side Logic
            </Typography>
          </GlassCard>

          <GlassCard className="p-4 border border-gray-200/60 dark:border-gray-800/60">
            <Typography variant="heading-lg" className="block font-black text-indigo-600 dark:text-indigo-400">
              0
            </Typography>
            <Typography variant="caption" className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 block">
              Remote Databases
            </Typography>
          </GlassCard>

          <GlassCard className="p-4 border border-gray-200/60 dark:border-gray-800/60">
            <Typography variant="heading-lg" className="block font-black text-purple-600 dark:text-purple-400">
              1-Click
            </Typography>
            <Typography variant="caption" className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 block">
              Package Export
            </Typography>
          </GlassCard>

          <GlassCard className="p-4 border border-gray-200/60 dark:border-gray-800/60">
            <Typography variant="heading-lg" className="block font-black text-emerald-600 dark:text-emerald-400">
              MIT
            </Typography>
            <Typography variant="caption" className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 block">
              Open Source License
            </Typography>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
};

export default HighlightMetricsBar;
