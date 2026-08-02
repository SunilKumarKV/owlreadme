"use client";

import React from 'react';
import { Badge, Card, Container, Section } from '@/components/ui';
import { PRODUCT_HIGHLIGHTS } from '../../constants/landing.constants';

export const ProductHighlightsSection: React.FC = () => {
  return (
    <Section spacing="md" id="features">
      <Container size="lg">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <Badge variant="info">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Everything you need to build your brand
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            OwlREADME packages simple profile forms, dynamic statistics interfaces, and AI bios synthesis under a single unified workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_HIGHLIGHTS.map((item, idx) => (
            <Card
              key={idx}
              hoverable
              data-reveal="true"
              className="glass-card reveal-item opacity-0 translate-y-6 flex flex-col gap-4 text-left p-6 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="p-3 bg-blue-50/80 dark:bg-gray-800/60 border border-blue-200/50 dark:border-gray-700/60 rounded-xl w-fit transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ProductHighlightsSection;
