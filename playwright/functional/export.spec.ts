import { test, expect } from '@playwright/test';
import ExportPage from '../pages/ExportPage';
import { listenForConsoleErrors, expectNoErrors } from '../helpers/utils';
import { seedA11yWorkspace } from '../helpers/a11y-helpers';

test.describe('Export Studio E2E Tests', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
    
    // Seed workspace data directly into localStorage to avoid multi-page navigation delays
    await seedA11yWorkspace(page);

    // Intercept window.print across browser contexts (including sandboxed PDF iframes)
    await page.addInitScript(() => {
      (window as unknown as Record<string, boolean>).__pdfPrinted = false;

      const markPrinted = () => {
        try {
          (window.top as unknown as Record<string, boolean>).__pdfPrinted = true;
        } catch {
          (window as unknown as Record<string, boolean>).__pdfPrinted = true;
        }
      };

      // Stub on main window
      (window as unknown as Record<string, unknown>).print = markPrinted;

      // Stub on Window.prototype so all iframe windows inherit it across document.open()
      try {
        Object.defineProperty(window.Window.prototype, 'print', {
          value: markPrinted,
          writable: true,
          configurable: true,
        });
      } catch {}

      // Intercept iframe DOM insertion
      try {
        const originalAppendChild = Node.prototype.appendChild;
        Node.prototype.appendChild = function <T extends Node>(this: Node, child: T): T {
          const result = originalAppendChild.call(this, child);
          if (child instanceof HTMLIFrameElement && child.contentWindow) {
            try {
              (child.contentWindow as unknown as Record<string, unknown>).print = markPrinted;
            } catch {}
          }
          return result as T;
        };
      } catch {}
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

    // Verify observable application behavior (toast notification for PDF print export requested)
    await expect(page.getByText(/PDF print preview requested/i).first()).toBeVisible({ timeout: 10000 });
  });
});
