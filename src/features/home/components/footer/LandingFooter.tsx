"use client";

import React from 'react';
import { Container } from '@/components/ui';
import { GitHubIcon } from '@/components/Icons';
import { BRANDING } from '@/config/branding';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50/90 dark:bg-[#0a0a0c] border-t border-gray-200/80 dark:border-gray-800/80 py-12 px-4 transition-colors">
      <Container size="lg" className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 select-none">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/branding/owlreadme-icon.svg" className="h-5 w-5" alt="OwlREADME Icon" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white block">
              {BRANDING.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
              © 2026. Licensed under MIT. Version {BRANDING.version}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          <a
            href={BRANDING.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1.5"
          >
            <GitHubIcon className="h-4 w-4" /> Repository
          </a>
          <a
            href={BRANDING.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Documentation
          </a>
          <a
            href={`mailto:${BRANDING.supportEmail}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Contact Support
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default LandingFooter;
