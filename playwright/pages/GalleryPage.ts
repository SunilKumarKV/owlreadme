import { Page, Locator } from '@playwright/test';

export class GalleryPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly importShowcaseTrigger: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h2', { hasText: 'Discover Beautiful Profile READMEs' });
    this.searchInput = page.locator('input[placeholder*="Search by name"]');
    this.importShowcaseTrigger = page.locator('label', { hasText: 'Import Showcase JSON' });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/gallery'); // Using hardcoded path
  }
}

export default GalleryPage;
