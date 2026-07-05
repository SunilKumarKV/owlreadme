"use client";

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Textarea from '@/components/Textarea';
import { generateRoadmapMarkdown, RoadmapData } from '@/utils/markdown';
import { decodeShareData, validateRoadmapData } from '@/utils/share-utils';
import { Copy, CheckCircle, ArrowRight, ListChecks } from 'lucide-react';
import { BRANDING } from '@/config/branding';

function ShareRoadmapContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data') || '';
  const themeParam = searchParams.get('theme') || 'minimal';

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'source'>('visual');
  
  const decodedData = useMemo(() => {
    if (!dataParam) return null;
    return decodeShareData<RoadmapData>(dataParam, validateRoadmapData);
  }, [dataParam]);

  // Set page title dynamically
  useEffect(() => {
    if (decodedData?.title) {
      document.title = `${decodedData.title} Roadmap | ${BRANDING.name}`;
    } else {
      document.title = `Shared Learning Roadmap | ${BRANDING.name}`;
    }
  }, [decodedData]);

  // Apply theme class to body
  useEffect(() => {
    const originalBodyClasses = Array.from(document.body.classList);
    document.body.classList.remove('theme-minimal', 'theme-dark', 'theme-gradient', 'theme-terminal');
    document.body.classList.add(`theme-${themeParam}`);

    return () => {
      document.body.classList.remove(`theme-${themeParam}`);
      originalBodyClasses.forEach((cls) => document.body.classList.add(cls));
    };
  }, [themeParam]);

  const markdown = decodedData ? generateRoadmapMarkdown(decodedData) : '';

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  if (!decodedData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black/20 p-4">
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-8 rounded-xl max-w-md w-full text-center shadow-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Invalid or Empty Share Data</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            We couldn&apos;t decode the roadmap state from this link. Make sure the share link is complete.
          </p>
          <Button href="/" variant="primary" className="w-full">
            Back to {BRANDING.name}
          </Button>
        </div>
      </div>
    );
  }

  const stepsList = decodedData.steps || [];
  const validSteps = stepsList.filter((step) => step.trim() !== '');

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-[#1e1e1e] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Branding header banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-lg">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-500 block">Shared Learning Roadmap</span>
              <h2 className="font-bold text-sm">Created via {BRANDING.name}</h2>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
            Create Your Own Roadmap
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        {/* Roadmap Title Panel */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Roadmap Title</span>
            <h1 className="text-2xl font-extrabold mt-1">{decodedData.title || 'Custom Learning Roadmap'}</h1>
            <p className="text-xs text-gray-400 mt-1">{validSteps.length} milestones structured</p>
          </div>
          <div className="flex bg-gray-100 dark:bg-black/30 rounded-lg p-1 text-xs shrink-0 self-center">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Visual Flow
            </button>
            <button
              onClick={() => setViewMode('source')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                viewMode === 'source'
                  ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Raw Markdown
            </button>
          </div>
        </div>

        {/* Content Render Panel */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
          {viewMode === 'visual' ? (
            <div className="space-y-8 py-4">
              {validSteps.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No learning steps configured in this shared roadmap.
                </p>
              ) : (
                validSteps.map((step, index) => (
                  <div key={index} className="flex space-x-4 items-start relative group">
                    {/* Visual connecting line */}
                    {index !== validSteps.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
                    )}

                    {/* Milestone bubble */}
                    <div className="z-10 flex items-center justify-center h-12 w-12 rounded-full border-2 border-blue-500 bg-white dark:bg-[#121212] font-bold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                      {index + 1}
                    </div>

                    {/* Milestone block */}
                    <div className="flex-1 bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-gray-900 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                      <div className="text-xs sm:text-sm font-semibold max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-line">
                        {step}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <Textarea
              value={markdown}
              onChange={() => {}}
              className="w-full font-mono text-xs p-4 bg-gray-50 dark:bg-black/20 rounded-lg border-0 resize-none h-[400px]"
              readOnly
              rows={20}
            />
          )}

          <div className="border-t border-gray-100 dark:border-gray-800 mt-6 pt-4 flex justify-between items-center text-xs">
            <span className="text-gray-400">
              Theme Applied: <b className="text-gray-600 dark:text-gray-300 capitalize ml-1">{themeParam}</b>
            </span>
            <Button onClick={handleCopy} variant={copied ? 'secondary' : 'primary'} className="py-1.5 px-4">
              <Copy className="h-3.5 w-3.5 mr-1" />
              {copied ? 'Copied!' : 'Copy Markdown'}
            </Button>
          </div>
        </div>
      </div>

      {/* Local Notification Overlay */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg shadow-lg">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <span className="text-sm font-semibold">Roadmap markdown copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}

export default function ShareRoadmapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1e1e1e]">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
          <p className="text-sm text-gray-500">Loading shared roadmap...</p>
        </div>
      </div>
    }>
      <ShareRoadmapContent />
    </Suspense>
  );
}
