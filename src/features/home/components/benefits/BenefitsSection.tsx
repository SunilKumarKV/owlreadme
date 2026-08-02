"use client";

import React from 'react';
import { Badge, Container, Section } from '@/components/ui';
import { WHY_US_ITEMS } from '../../constants/landing.constants';

export const BenefitsSection: React.FC = () => {
  return (
    <Section spacing="md" className="bg-gray-50/80 dark:bg-[#101014]/60 border-y border-gray-200/60 dark:border-gray-800/60">
      <Container size="lg">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <Badge variant="default">Benefits</Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Why developers choose OwlREADME
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Built specifically to solve developer profile maintenance pains cleanly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US_ITEMS.map((item, idx) => (
            <div
              key={idx}
              data-reveal="true"
              className="glass-card reveal-item opacity-0 translate-y-6 p-6 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-2.5 bg-gray-100 dark:bg-gray-800/60 rounded-xl w-fit">
                {item.icon}
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default BenefitsSection;
