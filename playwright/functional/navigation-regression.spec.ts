import { test, expect } from '@playwright/test';
import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import ReadmeBuilderPage from '../pages/ReadmeBuilderPage';
import ExportPage from '../pages/ExportPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import GalleryPage from '../pages/GalleryPage';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';

test.describe('Navigation & Regression Scenarios E2E Suite', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors, [
      /Failed to connect/i,
      /Network error/i,
      /TypeError: Failed to fetch/i,
      /TypeError: Load failed/i,
      /Load failed/i,
      /API CLIENT ERROR/i,
      /Failed to import/i,
      /ChunkLoadError/i,
      /Failed to load chunk/i,
      /ERR_INTERNET_DISCONNECTED/i,
    ]);
  });

  test('1. Full Navigation Path Flow', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const dashboardPage = new DashboardPage(page);
    const builderPage = new ReadmeBuilderPage(page);
    const exportPage = new ExportPage(page);
    const analyticsPage = new AnalyticsPage(page);
    const galleryPage = new GalleryPage(page);

    // Landing -> Dashboard -> README Builder -> Export Studio -> Analytics -> Gallery
    await landingPage.navigate();
    await landingPage.verifyPage();

    await dashboardPage.navigate();
    await dashboardPage.verifyPage();

    await builderPage.navigate();
    await builderPage.verifyPage();

    await exportPage.navigate();
    await exportPage.verifyPage();

    await analyticsPage.navigate();
    await analyticsPage.verifyPage();

    await galleryPage.navigate();
    await galleryPage.verifyPage();
  });

  test('2. State Retention across History back/forward navigation', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyPage();

    // Create a new custom project workspace
    await dashboardPage.createWorkspace('History Project Workspace', 'readme');
    await expect(page.locator('h3', { hasText: 'History Project Workspace' })).toBeVisible();

    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();
    
    // Type Bio
    await builderPage.fillAboutBio('History verification bio.');

    // Wait for the state to sync to the markdown editor preview before going back
    await expect(builderPage.rawMarkdownEditor).toHaveValue(/History verification bio\./);
    
    // Wait for the debounced store save to write to localStorage before navigating
    await page.waitForTimeout(2000);
    
    // Go back to dashboard
    await page.goBack();
    await dashboardPage.verifyPage();
    await expect(page.locator('h3', { hasText: 'History Project Workspace' })).toBeVisible();

    // Go forward to builder
    await page.goForward();
    await builderPage.verifyPage();
    await expect(builderPage.aboutBioInput).toHaveValue('History verification bio.');
  });

  test('3. LocalStorage Synchronization between Multiple Tabs', async ({ page, context }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyPage();

    // Create project in Tab 1
    await dashboardPage.createWorkspace('Shared Tab Project', 'readme');
    await expect(page.locator('h3', { hasText: 'Shared Tab Project' })).toBeVisible();

    // Open Tab 2
    const page2 = await context.newPage();
    const dashboard2 = new DashboardPage(page2);
    await dashboard2.navigate();
    await dashboard2.verifyPage();

    // Verify workspace is synced to Tab 2 via shared localStorage
    await expect(page2.locator('h3', { hasText: 'Shared Tab Project' })).toBeVisible();
    await page2.close();
  });

  test('4. Graceful Error Handling in Offline Mode', async ({ page, context }) => {
    // Mock the profile API call so we have github data loaded (prerequisite for AI assistant panel)
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
          followers: 10,
          following: 10,
          public_repos: 5,
        }),
      });
    });

    await page.route('https://api.github.com/users/octocat/repos?sort=updated&per_page=100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            name: 'octocat-react-project',
            html_url: 'https://github.com/octocat/octocat-react-project',
            description: 'React project description.',
            stargazers_count: 5,
            forks_count: 1,
            fork: false,
            language: 'TypeScript',
          },
        ]),
      });
    });

    const dashboardPage = new DashboardPage(page);
    
    await page.goto('/dashboard?username=octocat');
    await page.locator('h3', { hasText: 'The Octocat' }).waitFor({ state: 'visible' });
    
    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(1000); // Wait for offline state to propagate in browser context

    // Mock the AI API request to fail during offline simulation
    await page.route('**/api/ai', async (route) => {
      await route.abort('internetdisconnected');
    });

    // Trigger AI consulting - should fail gracefully with network error in offline mode
    await dashboardPage.consultOwlAI();

    await dashboardPage.verifyErrorMsg(/Failed to fetch|Network error|Error|Load failed/i);

    // Restore network online
    await context.setOffline(false);
    await page.waitForTimeout(1000);
  });

  test('5. Slow Network Loading State Overlays', async ({ page }) => {
    // Add artificial delay to the GitHub API mock calls
    await page.route('https://api.github.com/users/slow-user', async (route) => {
      await new Promise<void>(resolve => setTimeout(resolve, 3000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          login: 'slow-user',
          name: 'Slow Loader Profile',
          avatar_url: 'https://avatars.githubusercontent.com/u/5832347?v=4',
          followers: 1,
          public_repos: 1,
        }),
      });
    });
    await page.route('https://api.github.com/users/slow-user/repos?sort=updated&per_page=100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await landingPage.startBuilding('slow-user');

    // Confirm that the loading profile skeleton/indicator is displayed before page renders profile card
    await expect(page.locator('.animate-pulse').first()).toBeVisible();

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyPage();
    await expect(page.locator('h3', { hasText: 'Slow Loader Profile' })).toBeVisible({ timeout: 10000 });
  });

  test('6. Duplicate Click Protection and Stability', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyPage();

    // Click "New Project" trigger button
    await dashboardPage.clickCreateProject();
    await dashboardPage.newProjectNameInput.fill('Single Instance project');
    await dashboardPage.newProjectTypeSelect.selectOption('readme');

    // Double-click submit button rapidly
    await dashboardPage.submitCreateProjectButton.dblclick();

    // Only one instance of the project card should be created/visible in the workspaces grid
    await dashboardPage.verifyPage();
    const count = await page.locator('h3', { hasText: 'Single Instance project' }).count();
    expect(count).toBe(1);
  });
});
