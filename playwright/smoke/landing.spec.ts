import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { listenForConsoleErrors } from '../helpers/utils';

test.describe('Landing Page Smoke Tests', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    // Intercept console errors before navigation
    consoleErrors = listenForConsoleErrors(page);
  });

  test('should load the landing page successfully with correct metadata and zero console errors', async ({ page, baseURL }) => {
    const landingPage = new LandingPage(page);
    
    // Visit page
    await landingPage.navigate();

    // Assert URL
    await expect(page).toHaveURL(baseURL || 'http://localhost:3000/');

    // Assert Title
    await expect(page).toHaveTitle(/OwlREADME/);

    // Assert Hero Header visibility
    await expect(landingPage.heroHeading).toBeVisible();

    // Verify there were no console errors emitted
    expect(consoleErrors).toEqual([]);
  });
});
