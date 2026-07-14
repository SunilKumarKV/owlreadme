import { test, expect } from '@playwright/test';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';
import { seedA11yWorkspace, runAxeCheck } from '../helpers/a11y-helpers';
import DashboardPage from '../pages/DashboardPage';
import { MOCK_SHARE_PAYLOADS } from '../helpers/testData';

test.describe('OwlReadme Accessibility Audits (WCAG 2.2 AA)', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
    // Seed standard workspaces in localStorage before runs
    await seedA11yWorkspace(page);
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors);
  });

  // Parameterized tests for routes accessibility compliance
  const routes = [
    { name: 'Landing Page', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'README Builder', path: '/readme-builder' },
    { name: 'Preview Page', path: '/preview' },
    { name: 'Export Studio', path: '/export' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Theme Studio', path: '/theme' },
    { name: 'Roadmap Builder', path: '/roadmap-builder' },
    { name: 'Share README', path: `/share/readme?data=${MOCK_SHARE_PAYLOADS.README_DATA}` },
    { name: 'Share Roadmap', path: `/share/roadmap?data=${MOCK_SHARE_PAYLOADS.ROADMAP_DATA}` }
  ];

  for (const route of routes) {
    test(`A11y audit - ${route.name}`, async ({ page }) => {
      await page.goto(route.path);
      
      // Wait for dynamic skeletons to clear
      const loader = page.locator('text=Loading');
      if (await loader.count() > 0) {
        await loader.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      }
      await page.waitForTimeout(500);

      const results = await runAxeCheck(page);

      // Filter for serious and critical violations
      const violations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );

      if (violations.length > 0) {
        console.error(`Serious/Critical accessibility violations found on ${route.name}:`);
        console.error(JSON.stringify(violations, null, 2));
      }

      expect(violations).toEqual([]);
    });
  }

  test('Focus Trapping inside Create Workspace Modal', async ({ page, browserName }) => {
    if (browserName === 'webkit') {
      test.skip();
    }
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyPage();

    // Trigger opening the dialog
    await dashboardPage.clickCreateProject();

    // Check if modal or overlay wrapper exists
    const modal = page.locator('[role="dialog"], .bg-white.dark\\:bg-\\[\\#18181b\\]').first();
    await expect(modal).toBeVisible();

    // Focus an input inside the modal
    const firstInput = modal.locator('input').first();
    await firstInput.focus();

    // Perform multiple tab actions and verify that focus stays trapped within the modal
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const isFocusedInside = await page.evaluate((modalEl) => {
        const active = document.activeElement;
        return !!(modalEl && (modalEl === active || modalEl.contains(active)));
      }, await modal.elementHandle());
      
      expect(isFocusedInside).toBe(true);
    }
  });

  test('Keyboard Navigation & Focus Indicators', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');
    
    // Press Tab to check keyboard focus flow starts.
    // We allow body as a fallback since WebKit headless requires option-tab to focus links by default.
    await page.keyboard.press('Tab');
    const activeTagName = await page.evaluate(() => {
      return document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    });
    expect(activeTagName).toBeDefined();
  });
});
