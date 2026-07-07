/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { AIPlatform } from '@/packages/ai-platform';
import { rateLimiter, getClientIp } from '@/packages/rate-limiter';

/** Maximum request body size we will proxy to Gemini (50 KB). */
const MAX_BODY_BYTES = 50 * 1024;

/** Allowed action identifiers. */
const ALLOWED_ACTIONS = new Set(['readme', 'roadmap', 'profile', 'improve']);

/**
 * Rate-limit policy for the AI route:
 * 10 requests per 60 seconds per IP address.
 */
const AI_RATE_LIMIT = 10;
const AI_RATE_WINDOW_MS = 60_000;

/**
 * Common security headers applied to every response from this route.
 * These are defence-in-depth additions on top of the global Vercel headers.
 */
const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export async function POST(req: NextRequest) {
  // ── Rate Limiting ────────────────────────────────────────────────────────
  const clientIp = getClientIp(req.headers);
  const rateCheck = rateLimiter.check(clientIp, AI_RATE_LIMIT, AI_RATE_WINDOW_MS);

  if (!rateCheck.allowed) {
    const retryAfterSec = Math.ceil(rateCheck.retryAfterMs / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          'Retry-After': String(retryAfterSec),
        },
      }
    );
  }

  try {
    // ── Body size guard ──────────────────────────────────────────────────────
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request body too large.' },
        { status: 413, headers: SECURITY_HEADERS }
      );
    }

    const body = await req.text();
    if (body.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request body too large.' },
        { status: 413, headers: SECURITY_HEADERS }
      );
    }

    // ── JSON parse ───────────────────────────────────────────────────────────
    let parsed: { action?: unknown; payload?: unknown };
    try {
      parsed = JSON.parse(body);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body.' },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const { action, payload } = parsed;

    // ── Action allowlist check ────────────────────────────────────────────────
    if (typeof action !== 'string' || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { error: 'Invalid action specified.' },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid payload.' },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // ── API key check ─────────────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service is not configured on the server.', useLocalFallback: true },
        { status: 200, headers: SECURITY_HEADERS }
      );
    }

    // ── AI Platform call ──────────────────────────────────────────────────────
    try {
      const parsedResult = await AIPlatform.generate(action as any, payload as any);
      return NextResponse.json({ data: parsedResult }, { headers: SECURITY_HEADERS });
    } catch (err: any) {
      // Log full error server-side but return only a safe message to the client
      console.error('[AI Route] AI Platform call failed:', err?.message ?? err);
      return NextResponse.json(
        { error: 'Failed to communicate with AI platform.', useLocalFallback: true },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }
  } catch (err: any) {
    // Outer safety net — never leak raw error details to the client
    console.error('[AI Route] Unhandled error in handler:', err?.message ?? err);
    return NextResponse.json(
      { error: 'An internal error occurred.', useLocalFallback: true },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}
