import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { BuilderPage } from '../pages/BuilderPage';
import { ThemePage } from '../pages/ThemePage';
import { ExportPage } from '../pages/ExportPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { GalleryPage } from '../pages/GalleryPage';
import { SharePage } from '../pages/SharePage';
import { listenForConsoleErrors } from '../helpers/utils';
import { MOCK_SHARE_PAYLOADS } from '../helpers/testData';
import ROUTES from '../helpers/routes';

test.describe('OwlReadme Core Route Smoke Tests', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    // Register hooks to intercept exceptions/errors
    consoleErrors = listenForConsoleErrors(page);
  });

  test.afterEach(async () => {
    // Assert absolutely zero console.error or pageerror occurrences happened during runs
    expect(consoleErrors).toEqual([]);
  });

  test('1. Landing Page (/) Loads Successfully', async ({ page, baseURL }) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await expect(page).toHaveURL(baseURL || 'http://localhost:3000/');
    await expect(page).toHaveTitle(/OwlREADME/);
    await expect(landingPage.heroHeading).toBeVisible();
  });

  test('2. Developer Workspace (/dashboard) Loads Successfully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(dashboardPage.heading).toBeVisible();
  });

  test('3. Profile README Builder (/readme-builder) is Usable', async ({ page }) => {
    const builderPage = new BuilderPage(page);
    await builderPage.navigate();
    
    // Renders header logo
    await expect(builderPage.logoText).toBeVisible();
    
    // Verifies selector components render successfully
    await expect(builderPage.templateSelect).toBeVisible();
    await expect(builderPage.themeSelect).toBeVisible();

    // Verify option changes trigger successfully without runtime crashes
    await builderPage.selectTemplate('professional');
    await builderPage.selectTheme('dark');
  });

  test('4. Live Preview (/preview) Renders Successfully', async ({ page }) => {
    await page.goto(ROUTES.PREVIEW);
    const heading = page.locator('h1', { hasText: 'Live Preview' });
    await expect(heading).toBeVisible();
  });

  test('5. Export Studio (/export) is Active', async ({ page }) => {
    const exportPage = new ExportPage(page);
    await exportPage.navigate();
    await expect(exportPage.heading).toBeVisible();
    
    // Verify that individual download trigger buttons are present and interactive
    await expect(exportPage.downloadCombinedButton).toBeVisible();
    await expect(exportPage.downloadBackupButton).toBeVisible();
  });

  test('6. Developer Analytics (/analytics) Metrics Render', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await expect(analyticsPage.heading).toBeVisible();
    
    // Verifies warning cards when profile has not been imported yet
    await expect(analyticsPage.syncWarningCard).toBeVisible();
  });

  test('7. Template Gallery (/gallery) Loads Curtated COMMUNITY Banner', async ({ page }) => {
    const galleryPage = new GalleryPage(page);
    await galleryPage.navigate();
    await expect(galleryPage.heading).toBeVisible();
  });

  test('8. Theme Selection (/theme) Preferences Persistence', async ({ page }) => {
    const themePage = new ThemePage(page);
    await themePage.navigate();
    await expect(themePage.heading).toBeVisible();

    // Verify selecting theme works
    await themePage.selectThemeRadio('terminal');

    // Reload page to assert preference persistence via localStorage
    await page.reload();
    const radio = page.locator('label', { hasText: 'Terminal' }).locator('input[type="radio"]');
    await expect(radio).toBeChecked();
  });

  test('9. Roadmap Builder (/roadmap-builder) Layout loads', async ({ page }) => {
    await page.goto(ROUTES.ROADMAP_BUILDER);
    const heading = page.locator('h1', { hasText: 'Create Your Roadmap' });
    const select = page.locator('#roadmap-template-select');
    await expect(heading).toBeVisible();
    await expect(select).toBeVisible();
  });

  test('10. Share README Page (/share/readme) handles payloads', async ({ page }) => {
    const sharePage = new SharePage(page);
    
    // Scenario A: visits empty link -> triggers warning card layout
    await sharePage.navigateToReadme();
    await expect(sharePage.errorHeading).toBeVisible();

    // Scenario B: visits encoded data payload -> displays content
    await sharePage.navigateToReadme(`data=${MOCK_SHARE_PAYLOADS.README_DATA}`);
    await expect(sharePage.sharedReadmeTitle).toBeVisible();
  });

  test('11. Share Roadmap Page (/share/roadmap) handles payloads', async ({ page }) => {
    const sharePage = new SharePage(page);
    
    // Scenario A: visits empty link -> triggers warning card layout
    await sharePage.navigateToRoadmap();
    await expect(sharePage.errorHeading).toBeVisible();

    // Scenario B: visits encoded data payload -> displays content
    await sharePage.navigateToRoadmap(`data=${MOCK_SHARE_PAYLOADS.ROADMAP_DATA}`);
    await expect(sharePage.sharedRoadmapTitle).toBeVisible();
  });
});
