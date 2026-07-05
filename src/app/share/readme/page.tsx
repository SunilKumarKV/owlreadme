"use client";

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Button from '@/components/Button';
import Textarea from '@/components/Textarea';
import { generateREADME, READMEData } from '@/utils/markdown';
import { decodeShareData, validateREADMEData } from '@/utils/share-utils';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@uiw/react-md-editor/markdown-editor.css';
import { Sparkles, Copy, CheckCircle, ArrowRight } from 'lucide-react';
import { BRANDING } from '@/config/branding';

const MDMarkdown = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
);

function ShareReadmeContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data') || '';
  const themeParam = searchParams.get('theme') || 'minimal';

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');
  
  const decodedData = useMemo(() => {
    if (!dataParam) return null;
    return decodeShareData<READMEData>(dataParam, validateREADMEData);
  }, [dataParam]);

  // Set the dynamic document title for SEO
  useEffect(() => {
    if (decodedData?.name) {
      document.title = `${decodedData.name}'s Profile README | ${BRANDING.name}`;
    } else {
      document.title = `Shared Profile README | ${BRANDING.name}`;
    }
  }, [decodedData]);

  // Handle temporary share page body theme class override
  useEffect(() => {
    const originalBodyClasses = Array.from(document.body.classList);
    document.body.classList.remove('theme-minimal', 'theme-dark', 'theme-gradient', 'theme-terminal');
    document.body.classList.add(`theme-${themeParam}`);

    return () => {
      document.body.classList.remove(`theme-${themeParam}`);
      originalBodyClasses.forEach((cls) => document.body.classList.add(cls));
    };
  }, [themeParam]);

  const markdown = decodedData ? generateREADME(decodedData) : '';

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
            We couldn&apos;t decode the workspace state from this link. Make sure the share link is complete.
          </p>
          <Button href="/" variant="primary" className="w-full">
            Back to {BRANDING.name}
          </Button>
        </div>
      </div>
    );
  }

  const colorMode = (themeParam === 'dark' || themeParam === 'gradient' || themeParam === 'terminal') ? 'dark' : 'light';

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-[#1e1e1e] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Branding header banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-500 block">Shared Profile Workspace</span>
              <h2 className="font-bold text-sm">Created via {BRANDING.name}</h2>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
            Create Your Own Profile
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        {/* Profile Card Summary */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6">
          {decodedData.avatarUrl && (
            <img
              src={decodedData.avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-blue-500/50 shadow-sm shrink-0"
            />
          )}
          <div className="text-center md:text-left flex-1 space-y-1">
            <h1 className="text-2xl font-extrabold">{decodedData.name}</h1>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{decodedData.role}</p>
            {decodedData.followers !== undefined && (
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-400 pt-2">
                <span>👥 <b>Followers:</b> {decodedData.followers}</span>
                <span>📦 <b>Repos:</b> {decodedData.publicRepos}</span>
              </div>
            )}
          </div>
          <div className="flex bg-gray-100 dark:bg-black/30 rounded-lg p-1 text-xs shrink-0 self-center">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Rendered
            </button>
            <button
              onClick={() => setViewMode('source')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                viewMode === 'source'
                  ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Raw Source
            </button>
          </div>
        </div>

        {/* Content Render Panel */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
          <div className="overflow-auto max-h-[700px] min-h-[400px]">
            {viewMode === 'preview' ? (
              <div data-color-mode={colorMode} className="theme-preview-container">
                <ErrorBoundary name="README Preview Renderer" fallback={<div className="p-4 text-sm text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">Failed to render preview. The markdown content may be malformed.</div>}>
                  <MDMarkdown source={markdown} style={{ background: 'transparent', color: 'inherit' }} />
                </ErrorBoundary>
              </div>
            ) : (
              <Textarea
                value={markdown}
                onChange={() => {}}
                className="w-full font-mono text-xs p-4 bg-gray-50 dark:bg-black/20 rounded-lg border-0 resize-none h-[450px]"
                readOnly
                rows={20}
              />
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 mt-6 pt-4 flex justify-between items-center text-xs">
            <span className="text-gray-400 flex items-center">
              Theme Applied: <b className="text-gray-600 dark:text-gray-300 capitalize ml-1">{themeParam}</b>
            </span>
            <Button onClick={handleCopy} variant={copied ? 'secondary' : 'primary'} className="py-1.5 px-4">
              <Copy className="h-3.5 w-3.5 mr-1" />
              {copied ? 'Copied!' : 'Copy Markdown'}
            </Button>
          </div>
        </div>
      </div>

      {/* Local Notification Toast Overlay */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg shadow-lg">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <span className="text-sm font-semibold">README markdown copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}

export default function ShareReadmePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1e1e1e]">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
          <p className="text-sm text-gray-500">Loading shared README...</p>
        </div>
      </div>
    }>
      <ShareReadmeContent />
    </Suspense>
  );
}
