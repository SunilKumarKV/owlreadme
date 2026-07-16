import { Page, Locator, expect } from '@playwright/test';
import BasePage from './BasePage';
import ROUTES from '../helpers/routes';
import fs from 'fs';

export class ExportPage extends BasePage {
  readonly heading: Locator;
  readonly backToWorkspaceLink: Locator;
  readonly downloadReadmeButton: Locator;
  readonly downloadRoadmapButton: Locator;
  readonly downloadZipButton: Locator;
  readonly downloadJsonButton: Locator;
  readonly printPdfButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1', { hasText: 'Export Studio' });
    this.backToWorkspaceLink = page.getByRole('link', { name: 'Back to Workspace' });
    
    // Formatting grid card buttons using child CSS selectors to avoid outer wrapper collisions
    this.downloadReadmeButton = page.locator('div.grid > div').filter({ has: page.locator('h3', { hasText: 'README.md' }) }).locator('button', { hasText: 'Download' }).first();
    this.downloadRoadmapButton = page.locator('div.grid > div').filter({ has: page.locator('h3', { hasText: 'roadmap.md' }) }).locator('button', { hasText: 'Download' }).first();
    this.downloadZipButton = page.locator('div.grid > div').filter({ has: page.locator('h3', { hasText: 'ZIP Package' }) }).locator('button', { hasText: 'Download ZIP' }).first();
    this.downloadJsonButton = page.locator('div.grid > div').filter({ has: page.locator('h3', { hasText: 'JSON Backup' }) }).locator('button', { hasText: 'Backup Store' }).first();
    this.printPdfButton = page.locator('div.grid > div').filter({ has: page.locator('h3', { hasText: 'PDF Export' }) }).locator('button', { hasText: 'Print PDF' }).first();
  }

  async navigate(): Promise<void> {
    await this.goto(ROUTES.EXPORT);
  }

  async isLoaded(): Promise<void> {
    await this.waitForReady(this.heading);
  }

  async verifyPage(): Promise<void> {
    await this.isLoaded();
    await expect(this.downloadReadmeButton).toBeVisible();
    await expect(this.downloadRoadmapButton).toBeVisible();
    await expect(this.downloadZipButton).toBeVisible();
    await expect(this.downloadJsonButton).toBeVisible();
    await expect(this.printPdfButton).toBeVisible();
  }

  async triggerDownload(btn: Locator): Promise<{ filename: string; size: number; exists: boolean }> {
    const downloadPromise = this.page.waitForEvent('download');
    await btn.click();
    const download = await downloadPromise;
    const path = await download.path();
    const filename = download.suggestedFilename();
    const stats = fs.statSync(path);

    return {
      filename,
      size: stats.size,
      exists: fs.existsSync(path),
    };
  }

  async clickDownloadReadme(): Promise<{ filename: string; size: number; exists: boolean }> {
    return this.triggerDownload(this.downloadReadmeButton);
  }

  async clickDownloadRoadmap(): Promise<{ filename: string; size: number; exists: boolean }> {
    return this.triggerDownload(this.downloadRoadmapButton);
  }

  async clickDownloadZip(): Promise<{ filename: string; size: number; exists: boolean }> {
    return this.triggerDownload(this.downloadZipButton);
  }

  async clickDownloadJson(): Promise<{ filename: string; size: number; exists: boolean }> {
    return this.triggerDownload(this.downloadJsonButton);
  }

  async clickPrintPdf(): Promise<void> {
    await this.printPdfButton.click();
  }
}

export default ExportPage;
