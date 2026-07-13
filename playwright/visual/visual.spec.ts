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

        // Navigate to the target page
        await page.goto(pageInfo.path);

        // Wait for dynamic React hydration/rendering to complete
        const loader = page.locator('text=Loading');
        if (await loader.count() > 0) {
          await loader.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        }
        
        // Wait a small moment for animations and images to settle
        await page.waitForTimeout(1000);

        // Define elements to mask (like SVG charts and loading pulse blocks) to avoid flakiness
        const masks = [
          page.locator('svg'),
          page.locator('.animate-pulse'),
        ];

        // Verify page layout via screenshot matching
        await expect(page).toHaveScreenshot(`${pageInfo.name}-${vp.name}.png`, {
          mask: masks,
          fullPage: true,
          animations: 'disabled', // disable CSS animations
          timeout: 15000,
          maxDiffPixelRatio: 0.05, // Allow up to 5% pixel difference
        });
      });
    }
  }
});
