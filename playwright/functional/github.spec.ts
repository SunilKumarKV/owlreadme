import { test, expect } from '@playwright/test';
import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';

test.describe('GitHub Integration E2E Tests', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors);
  });

  test('1. Valid GitHub Profile & Repo Import', async ({ page }) => {
    // Mock the profile API call
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
          followers: 1337,
          following: 42,
          public_repos: 5,
        }),
      });
    });

    // Mock the repos API call
    await page.route('https://api.github.com/users/octocat/repos?sort=updated&per_page=100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            name: 'octocat-react-project',
            html_url: 'https://github.com/octocat/octocat-react-project',
            description: 'A beautiful React component workspace.',
            stargazers_count: 15,
            forks_count: 3,
            fork: false,
            language: 'TypeScript',
            topics: ['react', 'next.js', 'typescript'],
          },
        ]),
      });
    });

    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await landingPage.startBuilding('octocat');

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyPage();

    // Verify profile info loaded into UI
    await expect(page.locator('h3', { hasText: 'The Octocat' })).toBeVisible();
    await expect(page.locator('span', { hasText: '1337' })).toBeVisible(); // Followers
    
    // Verify repository insights and suggestions loaded
    await expect(page.locator('h3', { hasText: 'octocat-react-project' })).toBeVisible();
  });

  test('2. Invalid Username Syntax Validation Checks', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    // Starting with a hyphen is invalid according to validators/index.ts
    await landingPage.startBuilding('-invalid-username');

    const dashboardPage = new DashboardPage(page);
    // Should display validation error alert on the dashboard
    await dashboardPage.verifyErrorMsg(/Usernames cannot start or end with a hyphen/);
  });

  test('3. Empty Repository List State', async ({ page }) => {
    // Mock the profile API call
    await page.route('https://api.github.com/users/octocat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          login: 'octocat',
          name: 'Empty Dev',
          bio: null,
          avatar_url: 'https://avatars.githubusercontent.com/u/5832347?v=4',
          html_url: 'https://github.com/octocat',
          followers: 10,
          following: 10,
          public_repos: 0,
        }),
      });
    });

    // Mock empty repos list
    await page.route('https://api.github.com/users/octocat/repos?sort=updated&per_page=100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await landingPage.startBuilding('octocat');

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyPage();

    // The profile should render but we should see empty state insights or no repos listed
    await expect(page.locator('h3', { hasText: 'Empty Dev' })).toBeVisible();
    await expect(page.locator('p', { hasText: 'No languages recorded' }).or(page.locator('div', { hasText: 'No project languages' }))).toBeVisible();
  });

  test('4. Large Repository List Analysis', async ({ page }) => {
    await page.route('https://api.github.com/users/octocat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          login: 'octocat',
          name: 'Big Dev',
          avatar_url: 'https://avatars.githubusercontent.com/u/5832347?v=4',
          html_url: 'https://github.com/octocat',
          followers: 120,
          following: 80,
          public_repos: 4,
        }),
      });
    });

    // Mock 4 repos with different languages to test language percentages/list
    await page.route('https://api.github.com/users/octocat/repos?sort=updated&per_page=100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { name: 'repo1', stargazers_count: 10, language: 'TypeScript', fork: false },
          { name: 'repo2', stargazers_count: 20, language: 'TypeScript', fork: false },
          { name: 'repo3', stargazers_count: 5, language: 'Python', fork: false },
          { name: 'repo4', stargazers_count: 2, language: 'Go', fork: false },
        ]),
      });
    });

    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await landingPage.startBuilding('octocat');

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyPage();

    // Verify Repository Insights renders TypeScript, Python, Go
    await expect(page.locator('span', { hasText: 'TypeScript' }).first()).toBeVisible();
    await expect(page.locator('span', { hasText: 'Python' }).first()).toBeVisible();
    await expect(page.locator('span', { hasText: 'Go' }).first()).toBeVisible();
  });

  test('5. Network Failure & API Error Handling', async ({ page }) => {
    // Fail the profile fetch with status 500
    await page.route('https://api.github.com/users/octocat', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await landingPage.startBuilding('octocat');

    const dashboardPage = new DashboardPage(page);
    // Verify warning notification/alert box contains the API failure notice
    await dashboardPage.verifyErrorMsg(/Internal Server Error/);
  });
});
