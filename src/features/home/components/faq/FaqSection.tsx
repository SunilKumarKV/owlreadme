"use client";

import React, { useState } from 'react';
import { Badge, Container, Section } from '@/components/ui';
import { FAQ_ITEMS } from '../../constants/landing.constants';

export const FaqSection: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <Section spacing="md" id="faq">
      <Container size="md">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <Badge variant="outline">FAQ</Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">
            Answers to common questions regarding local browser storage, file imports, and licenses.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isActive = activeFaq === idx;
            return (
              <div
                key={idx}
                data-reveal="true"
                className="glass-card rounded-2xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                  className="w-full px-6 py-4 text-left font-bold text-sm flex justify-between items-center text-gray-900 dark:text-white select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
                  aria-expanded={isActive}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span>{item.question}</span>
                  <span className={`text-blue-500 font-extrabold text-lg transition-transform duration-300 ${isActive ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    maxHeight: isActive ? '360px' : '0',
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200/50 dark:border-gray-800/50 pt-3">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default FaqSection;
