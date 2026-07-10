import { test, expect } from '@playwright/test';
import AnalyticsPage from '../pages/AnalyticsPage';
import ThemePage from '../pages/ThemePage';
import GalleryPage from '../pages/GalleryPage';
import RoadmapBuilderPage from '../pages/RoadmapBuilderPage';
import ShareReadmePage from '../pages/ShareReadmePage';
import ShareRoadmapPage from '../pages/ShareRoadmapPage';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';
import { MOCK_SHARE_PAYLOADS } from '../helpers/testData';

test.describe('OwlReadme Core Functional Flows E2E Suite', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors);
  });

  test('1. Analytics Sync Warnings & Metrics Toggling', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Scenario A: Without profile loaded -> verify sync warning displays
    await analyticsPage.navigate();
    await analyticsPage.verifyPage();
    await expect(analyticsPage.syncWarningCard).toBeVisible();

    // Scenario B: With profile loaded -> verify sync warning hidden and analytics show up
    // Let's mock a valid github import by navigating to dashboard with query param
    await page.route('https://api.github.com/users/octocat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          login: 'octocat',
          name: 'The Octocat',
          bio: 'GitHub mascot',
          avatar_url: 'https://avatars.githubusercontent.com/u/5832347?v=4',
          html_url: 'https://github.com/octocat',
          followers: 100,
          following: 10,
          public_repos: 5,
        }),
      });
    });
    await page.route('https://api.github.com/users/octocat/repos?sort=updated&per_page=100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/dashboard?username=octocat');
    
    // Now return to analytics page
    await analyticsPage.navigate();
    await analyticsPage.isLoaded();
    
    // The sync warning card should be hidden
    await expect(analyticsPage.syncWarningCard).not.toBeVisible();
  });

  test('2. Theme Selection Preferences & LocalStorage Persistence', async ({ page }) => {
    const themePage = new ThemePage(page);
    await themePage.navigate();
    await themePage.verifyPage();

    // Select the retro "Terminal" theme
    await themePage.selectThemeRadio('terminal');

    // Reload page to verify persistence via localStorage
    await page.reload();
    await themePage.verifyPage();

    // Confirm that the class is applied to the page body or HTML container
    const bodyClass = await page.locator('body').getAttribute('class');
    expect(bodyClass).toContain('theme-terminal');
  });

  test('3. Template Gallery Search and Discovery', async ({ page }) => {
    const galleryPage = new GalleryPage(page);
    await galleryPage.navigate();
    await galleryPage.verifyPage();

    // Search for a template by name (e.g. "Minimal")
    await galleryPage.fillSearch('Minimal');

    // Verify search results filter the items in the grid
    await expect(page.locator('h3', { hasText: 'Minimalist Bio' }).first()).toBeVisible();
  });

  test('4. Roadmap Steps CRUD & Select Template', async ({ page }) => {
    const roadmapPage = new RoadmapBuilderPage(page);
    await roadmapPage.navigate();
    await roadmapPage.verifyPage();

    // Select Backend Roadmap template
    await roadmapPage.selectTemplate('backend');

    // Title should automatically fill
    await expect(roadmapPage.titleInput).toHaveValue('Backend Development Roadmap');

    // Add step
    const countBefore = await roadmapPage.getStepsCount();
    await roadmapPage.addStep('Learn Docker containers deployment');
    const countAfter = await roadmapPage.getStepsCount();
    expect(countAfter).toBe(countBefore + 1);

    // Edit step title
    await roadmapPage.fillStep(0, 'Advanced Systems Architecture');

    // Remove step
    await roadmapPage.removeStep(0);
    const countFinal = await roadmapPage.getStepsCount();
    expect(countFinal).toBe(countAfter - 1);
  });

  test('5. Share Pages Parameter Validation & Error Toggles', async ({ page }) => {
    const shareReadme = new ShareReadmePage(page);
    
    // Navigate with empty query params -> verify error
    await shareReadme.navigate();
    await shareReadme.verifyError();

    // Navigate with valid query params -> verify loaded successfully
    await shareReadme.navigate(`data=${MOCK_SHARE_PAYLOADS.README_DATA}`);
    await shareReadme.verifyPage();

    const shareRoadmap = new ShareRoadmapPage(page);
    
    // Navigate with empty query params -> verify error
    await shareRoadmap.navigate();
    await shareRoadmap.verifyError();

    // Navigate with valid query params -> verify loaded successfully
    await shareRoadmap.navigate(`data=${MOCK_SHARE_PAYLOADS.ROADMAP_DATA}`);
    await shareRoadmap.verifyPage();
  });
});
