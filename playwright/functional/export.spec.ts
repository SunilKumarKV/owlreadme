/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/test';
import ExportPage from '../pages/ExportPage';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';

test.describe('Export Studio E2E Tests', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
    
    // Stub print dialogs globally before page loads/evaluates
    await page.evaluateOnNewDocument(() => {
      (window as any).__pdfPrinted = false;
      window.print = () => {
        (window as any).__pdfPrinted = true;
        console.log('Mocked window.print called');
      };
      
      const originalCreate = document.createElement;
      document.createElement = function(tagName: string, options?: any) {
        const el = originalCreate.call(document, tagName, options);
        if (tagName.toLowerCase() === 'iframe') {
          setTimeout(() => {
            try {
              const win = (el as HTMLIFrameElement).contentWindow;
              if (win) {
                win.print = () => {
                  (window as any).__pdfPrinted = true;
                  console.log('Mocked iframe print called');
                };
              }
            } catch (err) {
              console.error(err);
            }
          }, 0);
        }
        return el;
      };
    });
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
    const printed = await page.evaluate(() => (window as any).__pdfPrinted);
    expect(printed).toBe(true);
  });
});
