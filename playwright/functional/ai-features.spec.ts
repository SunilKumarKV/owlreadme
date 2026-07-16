import { test, expect } from '@playwright/test';
import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';

test.describe('AI Features E2E Tests', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
    
    // Mock the profile API call so we have github data loaded (prerequisite for AI consultant panel)
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
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors, [
      /Secure AI/i,
      /Falling back to local analyzer/i,
      /FALLBACK_TRIGGERED/i,
      /API CLIENT ERROR/i,
      /API Request Failure/i,
    ]);
  });

  test('1. Successful AI Consulting & Suggestions Applying', async ({ page }) => {
    let callCount = 0;
    // Intercept /api/ai POST requests and return mock suggestions sequentially
    await page.route('**/api/ai', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        callCount++;
        if (callCount === 1) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                introduction: 'AI Suggested bio introduction text.',
                aboutMe: 'AI Suggested about me paragraph text.',
                skills: 'AI core skills list.',
                projects: 'AI projects list.',
              },
            }),
          });
        } else if (callCount === 2) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                roadmapSteps: ['AI Step One', 'AI Step Two'],
                nextTopics: ['AI Topic A'],
                technologies: ['AI Tech B'],
              },
            }),
          });
        } else if (callCount === 3) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                improvedBio: 'AI Improved Bio description.',
                portfolioDescription: 'AI Portfolio description.',
                githubImprovements: ['AI GitHub Imp 1'],
              },
            }),
          });
        }
      }
    });

    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await landingPage.startBuilding('octocat');

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyPage();

    // Consult Owl AI
    await dashboardPage.consultOwlAI();

    // Verify notifications toast
    await dashboardPage.waitForToast('Owl AI suggestions generated successfully!');

    // Apply Bio Intro
    await dashboardPage.applyReadmeSuggestion('Bio Intro');
    await dashboardPage.waitForToast('AI Introduction appended to About Me!');

    // Apply Roadmap steps
    await dashboardPage.applyRoadmapSuggestion();
    await dashboardPage.waitForToast('AI learning steps applied to your roadmap!');

    // Apply Profile improvements
    await dashboardPage.applyProfileSuggestion('Bio');
    await dashboardPage.waitForToast('Improved Bio set to profile!');
  });

  test('2. Resilient Fallback to Local AI Analyzer on API Failure', async ({ page }) => {
    // Force API failure
    await page.route('**/api/ai', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error', useLocalFallback: true }),
      });
    });

    const landingPage = new LandingPage(page);
    await landingPage.navigate();
    await landingPage.startBuilding('octocat');

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyPage();

    // Trigger AI Consult - it should fallback to local analyzer without crashing the UI
    await dashboardPage.consultOwlAI();

    // Verify local AI analyzer suggestions successfully loaded (e.g. check for default fallback values)
    await dashboardPage.waitForToast('Owl AI suggestions generated successfully!');
    await expect(page.locator('button[role="tab"]', { hasText: 'README' })).toBeVisible();
  });
});
