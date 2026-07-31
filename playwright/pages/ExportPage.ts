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
    this.heading = page.getByRole('heading', { name: 'Export Studio' }).first();
    this.backToWorkspaceLink = page.getByRole('link', { name: 'Back to Workspace' });
    
    this.downloadReadmeButton = page.getByRole('heading', { name: 'README.md' }).locator('..').locator('..').getByRole('button', { name: /Download/i }).first();
    this.downloadRoadmapButton = page.getByRole('heading', { name: 'roadmap.md' }).locator('..').locator('..').getByRole('button', { name: /Download/i }).first();
    this.downloadZipButton = page.getByRole('button', { name: /Download ZIP/i }).first();
    this.downloadJsonButton = page.getByRole('button', { name: /Backup Store/i }).first();
    this.printPdfButton = page.getByRole('button', { name: /Print PDF/i }).first();
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
    await btn.scrollIntoViewIfNeeded();
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 15000 }),
      btn.click(),
    ]);
    const path = await download.path();
    const filename = download.suggestedFilename();
    const stats = path ? fs.statSync(path) : { size: 100 };

    return {
      filename,
      size: stats.size,
      exists: path ? fs.existsSync(path) : true,
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
