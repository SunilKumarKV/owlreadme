import { Page, Locator, expect } from '@playwright/test';
import BasePage from './BasePage';

export class ShareReadmePage extends BasePage {
  readonly errorHeading: Locator;
  readonly titleHeader: Locator;
  readonly copyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.errorHeading = page.getByRole('heading', { name: 'Invalid or Empty Share Data' }).first();
    this.titleHeader = page.getByText(/Shared Profile README|Created via/i).first();
    this.copyButton = page.getByRole('button', { name: 'Copy Markdown' }).first();
  }

  async navigate(queryParams?: string): Promise<void> {
    const url = queryParams ? `/share/readme?${queryParams}` : '/share/readme';
    await this.goto(url);
  }

  async isLoaded(): Promise<void> {
    await this.titleHeader.waitFor({ state: 'visible', timeout: 5000 });
  }

  async verifyPage(): Promise<void> {
    await this.isLoaded();
    await expect(this.titleHeader).toBeVisible();
    await expect(this.copyButton).toBeVisible();
  }

  async verifyError(): Promise<void> {
    await this.waitForReady(this.errorHeading);
    await expect(this.errorHeading).toBeVisible();
  }

  async clickCopy(): Promise<void> {
    await this.copyButton.click();
  }
}

export default ShareReadmePage;
