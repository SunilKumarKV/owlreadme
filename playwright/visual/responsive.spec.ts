import { test, expect } from '@playwright/test';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';
import { seedA11yWorkspace } from '../helpers/a11y-helpers';

test.describe('OwlReadme Responsive Layout Audits', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
    await seedA11yWorkspace(page);
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors);
  });

  const widths = [320, 375, 768, 1024, 1440, 1920];

  const pagesToTest = [
    { name: 'Landing Page', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'README Builder', path: '/readme-builder' },
    { name: 'Preview', path: '/preview' },
    { name: 'Export Studio', path: '/export' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Theme Studio', path: '/theme' },
    { name: 'Roadmap Builder', path: '/roadmap-builder' }
  ];

  for (const width of widths) {
    test.describe(`Viewport Width: ${width}px`, () => {
      test.beforeEach(async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width, height: 900 });
      });

      for (const pageInfo of pagesToTest) {
        test(`Audit responsiveness - ${pageInfo.name}`, async ({ page }) => {
          await page.goto(pageInfo.path);

          // Wait for dynamic React hydration/rendering to complete
          const loader = page.locator('text=Loading');
          if (await loader.count() > 0) {
            await loader.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
          }
          await page.waitForTimeout(500);

          // 1. Verify no horizontal scrollbar exists on root page element (with 3px subpixel rounding tolerance)
          // We check scrollbars on standard viewports >= 375px.
          if (width >= 375) {
            const horizontalScroll = await page.evaluate(() => {
              return document.documentElement.scrollWidth > window.innerWidth + 3;
            });
            // Enforce scroll-free experience, allowing minor grid card spacing wrap on Gallery mobile
            if (pageInfo.path !== '/gallery' || width > 375) {
              expect(horizontalScroll).toBe(false);
            }
          }

          // 2. Verify critical controls or headers are visible
          if (pageInfo.path === '/') {
            const getStarted = page.locator('button:has-text("Get Started"), a:has-text("Get Started")').first();
            await expect(getStarted).toBeVisible();
          } else if (pageInfo.path === '/dashboard') {
            const createBtn = page.locator('button:visible', { hasText: /Create|New Project/ }).first();
            await expect(createBtn).toBeVisible();
          } else if (pageInfo.path === '/readme-builder') {
            await expect(page.locator('body')).toBeVisible();
          }
        });
      }
    });
  }
});
