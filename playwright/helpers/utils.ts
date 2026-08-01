import { Page, expect } from '@playwright/test';

/**
 * Registers listeners on the page to intercept console errors and page errors.
 * Returns a list of collected error messages.
 */
export function listenForConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  
  return errors;
}

/**
 * Forces clearing of localStorage variables.
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Helper to wait for toast messages to render.
 */
export async function waitForToast(page: Page, message?: string): Promise<void> {
  const locator = page.locator('.fixed.bottom-6.flex.items-center, .fixed.bottom-6');
  await locator.first().waitFor({ state: 'visible', timeout: 10000 });
  if (message) {
    await expect(locator.first()).toContainText(message);
  }
}

/**
 * Helper to wait for standard text-based loading fallbacks to finish.
 */
export async function waitForLoadingToFinish(page: Page): Promise<void> {
  const loader = page.locator('text=Loading');
  if (await loader.count() > 0) {
    await loader.first().waitFor({ state: 'hidden', timeout: 10000 });
  }
}

/**
 * Helper to wait for API request responses.
 */
export async function waitForApi(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.waitForResponse(urlPattern);
}

export function expectNoErrors(consoleErrors: string[] = [], ignoredPatterns: (string | RegExp)[] = []): void {
  if (!consoleErrors || !Array.isArray(consoleErrors)) return;
  const defaultIgnored = [
    /Failed to load resource/i,
    /the server responded with a status of/i,
    /favicon\.ico/i,
    /due to access control checks/i,
    /Failed to connect to GitHub/i,
    /Network error/i,
    /ChunkLoadError/i,
    /Failed to load chunk/i,
    /API request failed/i,
    /React does not recognize the .* prop on a DOM element/i,
    /Received .* for a non-boolean attribute/i,
    /non-boolean attribute/i,
    /ErrorBoundaryHandler/i,
    /ErrorBoundary caught an error/i,
    /handled by the <ErrorBoundary>/i,
    /App Router Root Error Caught/i,
    /vAlign/i,
    /caret-color/i,
    /Style property/i,
    /Invalid DOM property/i,
    /extra attributes/i,
    /did not match/i,
  ];
  const allIgnored = [...defaultIgnored, ...ignoredPatterns];
  const filtered = consoleErrors.filter((err) => {
    return !allIgnored.some((pattern) => {
      if (typeof pattern === 'string') {
        return err.includes(pattern);
      }
      return pattern.test(err);
    });
  });
  expect(filtered).toEqual([]);
}

/**
 * Helper function that polls document.documentElement.scrollHeight and waits until
 * page height remains identical for at least stableDurationMs (default 500ms)
 * before taking screenshots.
 */
export async function waitForScrollHeightToStabilize(
  page: Page,
  stableDurationMs = 500,
  timeoutMs = 15000
): Promise<void> {
  const startTime = Date.now();
  let lastHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  let lastChangeTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    const currentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const now = Date.now();

    if (currentHeight !== lastHeight) {
      lastHeight = currentHeight;
      lastChangeTime = now;
    } else if (now - lastChangeTime >= stableDurationMs) {
      return;
    }
  }
}

