import { test, expect } from '@playwright/test';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';
import { seedA11yWorkspace } from '../helpers/a11y-helpers';

test.describe('OwlReadme Visual Regression Testing', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);

    // Freeze Date.now to a fixed deterministic timestamp across all visual tests
    await page.addInitScript(() => {
      const fixedTime = new Date('2026-07-10T12:00:00.000Z').getTime();
      Date.now = () => fixedTime;
    });

    // Intercept external dynamic badge and counter requests with static SVG fixtures
    await page.route('**/github-readme-stats.vercel.app/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150"><rect width="100%" height="100%" fill="#141321"/><text x="20" y="40" fill="#fe428e" font-family="sans-serif" font-size="14">GitHub Stats (Mocked)</text></svg>`,
      });
    });

    await page.route('**/komarev.com/ghpvc/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="20"><rect width="100%" height="100%" fill="#050505"/><text x="10" y="14" fill="#00c950" font-family="sans-serif" font-size="11">Profile Views: 100</text></svg>`,
      });
    });

    await page.route('**/img.shields.io/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="20"><rect width="100%" height="100%" fill="#2b7fff"/><text x="10" y="14" fill="#ffffff" font-family="sans-serif" font-size="11">Badge</text></svg>`,
      });
    });

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
