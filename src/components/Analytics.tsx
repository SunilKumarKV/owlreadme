/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
"use client";

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

// Global type declarations for analytics integrations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

/**
 * Tracks a custom event in the analytics provider.
 * Logs to the console in development mode.
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Development logger
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Telemetry Event]: ${action} | Cat: ${category} | Lbl: ${label || 'N/A'} | Val: ${value ?? 'N/A'}`);
  }
}

/**
 * Hook to automatically track page navigation views.
 */
function useAnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

    const url = pathname + searchParams.toString();
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);
}

/**
 * Analytics Mounting Component.
 * Automatically injects scripts if an active Google Analytics ID is provided.
 */
export default function Analytics() {
  useAnalyticsPageViews();

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
