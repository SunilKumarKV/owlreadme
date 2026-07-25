import { test, expect } from '@playwright/test';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';
import { seedA11yWorkspace } from '../helpers/a11y-helpers';

test.describe('OwlReadme Visual Regression Testing', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
    // Seed standard mock workspaces to guarantee identical visual data
    await seedA11yWorkspace(page);
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors);
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 }
  ];

  const pagesToTest = [
    { name: 'Landing-Page', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'README-Builder', path: '/readme-builder' },
    { name: 'Preview', path: '/preview' },
    { name: 'Export', path: '/export' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Theme', path: '/theme' },
    { name: 'Roadmap-Builder', path: '/roadmap-builder' }
  ];

  for (const vp of viewports) {
    for (const pageInfo of pagesToTest) {
      test(`Visual snapshot - ${pageInfo.name} on ${vp.name}`, async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: vp.width, height: vp.height });

        // Navigate to target page and wait for load
        await page.goto(pageInfo.path, { waitUntil: 'load' });

        // Wait for fonts to be ready
        await page.evaluate(() => document.fonts.ready).catch(() => {});

        // Inject global CSS to disable animations, transitions, caret, and scroll behavior
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation: none !important;
              transition: none !important;
              caret-color: transparent !important;
              scroll-behavior: auto !important;
            }
          `
        });

        // Wait for dynamic React loading skeletons to disappear
        const loader = page.locator('text=Loading');
        if (await loader.count() > 0) {
          await loader.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        }

        // Wait for all images to complete loading (with 1.5s max fallback per image)
        await page.evaluate(async () => {
          const images = Array.from(document.querySelectorAll('img'));
          await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              const timer = setTimeout(resolve, 1500);
              img.addEventListener('load', () => { clearTimeout(timer); resolve(true); }, { once: true });
              img.addEventListener('error', () => { clearTimeout(timer); resolve(true); }, { once: true });
            });
          }));
        }).catch(() => {});

        // Wait a short moment for final rendering stability
        await page.waitForTimeout(500);

        // Define elements to mask (like SVG charts and pulse blocks) to avoid flakiness
        const masks = [
          page.locator('svg.recharts-surface'),
          page.locator('.animate-pulse'),
        ];

        // Verify page layout via screenshot matching
        await expect(page).toHaveScreenshot(`${pageInfo.name}-${vp.name}.png`, {
          mask: masks,
          fullPage: true,
          animations: 'disabled',
          timeout: 15000,
          maxDiffPixelRatio: 0.03,
        });
      });
    }
  }
});
