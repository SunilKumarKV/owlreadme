/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test';
import ExportPage from '../pages/ExportPage';
import RoadmapBuilderPage from '../pages/RoadmapBuilderPage';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';

test.describe('Export Studio E2E Tests', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
    
    // Mock the profile API call so we have github data loaded (prerequisite for README markdown generation)
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

    // Intercept document/iframe attachment and document opens to stub window.print() inside the sandboxed PDF iframe
    await page.addInitScript(() => {
      (window as unknown as Record<string, boolean>).__pdfPrinted = false;
      
      const stubPrint = (win: Window) => {
        try {
          Object.defineProperty(win, 'print', {
            value: () => {
              (window.top as unknown as Record<string, boolean>).__pdfPrinted = true;
            },
            writable: true,
            configurable: true
          });
        } catch (e) {}
      };

      const originalAppendChild = Node.prototype.appendChild;
      Node.prototype.appendChild = function<T extends Node>(this: Node, child: T): T {
        const result = originalAppendChild.call(this, child);
        if (child instanceof HTMLIFrameElement) {
          const win = child.contentWindow;
          if (win) stubPrint(win);
        }
        return result as T;
      };

      const originalOpen = Document.prototype.open;
      Document.prototype.open = function(this: Document, ...args: unknown[]) {
        const result = originalOpen.apply(this, args as any);
        const win = this.defaultView;
        if (win && win !== window.top) stubPrint(win);
        return result as any;
      };
    });

    // Navigate to dashboard with query param to trigger import and markdown compile
    await page.goto('/dashboard?username=octocat');
    await page.locator('h3', { hasText: 'The Octocat' }).waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);

    // Populate roadmap content
    const roadmapPage = new RoadmapBuilderPage(page);
    await roadmapPage.navigate();
    await roadmapPage.selectTemplate('backend');
    await page.waitForTimeout(1000);
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors);
  });

  test('1. Verify Markdown, ZIP, and JSON Exports', async ({ page }) => {
    const exportPage = new ExportPage(page);
    await exportPage.navigate();
    await exportPage.verifyPage();

    // 1. Markdown README.md
    const readmeRes = await exportPage.clickDownloadReadme();
    expect(readmeRes.exists).toBe(true);
    expect(readmeRes.filename).toContain('README.md');
    expect(readmeRes.size).toBeGreaterThan(0);

    // 2. Markdown roadmap.md
    const roadmapRes = await exportPage.clickDownloadRoadmap();
    expect(roadmapRes.exists).toBe(true);
    expect(roadmapRes.filename).toContain('roadmap.md');
    expect(roadmapRes.size).toBeGreaterThan(0);

    // 3. ZIP Package
    const zipRes = await exportPage.clickDownloadZip();
    expect(zipRes.exists).toBe(true);
    expect(zipRes.filename).toContain('.zip');
    expect(zipRes.size).toBeGreaterThan(0);

    // 4. JSON Backup
    const jsonRes = await exportPage.clickDownloadJson();
    expect(jsonRes.exists).toBe(true);
    expect(jsonRes.filename).toContain('backup.json');
    expect(jsonRes.size).toBeGreaterThan(0);
  });

  test('2. Verify PDF Print Export Dialog triggers', async ({ page }) => {
    const exportPage = new ExportPage(page);
    await exportPage.navigate();
    await exportPage.verifyPage();

    // Trigger PDF Export
    await exportPage.clickPrintPdf();

    // Check if the stubbed print flag is set to true on the window object
    await expect(async () => {
      const printed = await page.evaluate(() => (window as unknown as Record<string, boolean>).__pdfPrinted);
      expect(printed).toBe(true);
    }).toPass({ timeout: 5000 });
  });
});
