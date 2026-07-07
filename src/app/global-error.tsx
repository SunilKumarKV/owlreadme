'use client';

import React, { useEffect } from 'react';
import { trackEvent } from '@/components/Analytics';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log full error details only on server — never expose stack traces to end users
    console.error('Critical Layout Error:', error);
    trackEvent('critical_global_error', 'error', error.digest ?? 'unknown');
  }, [error]);

  // Only surface internal error messages in development to prevent
  // information leakage of server internals to end users in production.
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#1e1e1e] text-black dark:text-white p-4 font-sans">

        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-8 rounded-xl max-w-md w-full text-center shadow-md space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full w-fit mx-auto">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Critical Error Encountered</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A critical layout error has occurred. Please reset the layout or reload the page.
            </p>
            {isDev && error.message && (
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-md text-left font-mono text-xs text-red-600 dark:text-red-400 border border-gray-100 dark:border-gray-800 break-all">
                {error.message}
              </div>
            )}
            {!isDev && error.digest && (
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">Error ID: {error.digest}</p>
            )}
          </div>
          <button
            onClick={reset}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold text-sm transition cursor-pointer"
          >
            Reset Layout & Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
