"use client";

import React from 'react';
import { Badge, Container, Section } from '@/components/ui';
import { PROCESS_STEPS } from '../../constants/landing.constants';

export const ProcessSection: React.FC = () => {
  return (
    <Section spacing="md" id="how-it-works" className="bg-gray-50/80 dark:bg-[#101014]/60 border-y border-gray-200/60 dark:border-gray-800/60">
      <Container size="lg">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <Badge variant="warning">Process</Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Build your profile page in minutes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            A simple four-step workflow that fetches public metrics and lets you export clean markdown structures instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, idx) => (
            <div
              key={idx}
              data-reveal="true"
              className="glass-card reveal-item opacity-0 translate-y-6 flex flex-col gap-3 p-6 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {step.number}
              </span>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ProcessSection;
