import { Page } from '@playwright/test';

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
