import { Page, Locator } from '@playwright/test';

export class SharePage {
  readonly page: Page;
  readonly errorHeading: Locator;
  readonly sharedReadmeTitle: Locator;
  readonly sharedRoadmapTitle: Locator;
  readonly copyMarkdownButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.errorHeading = page.locator('h2', { hasText: 'Invalid or Empty Share Data' });
    this.sharedReadmeTitle = page.locator('span', { hasText: 'Shared Profile README' }).or(page.locator('h2', { hasText: 'Created via' }));
    this.sharedRoadmapTitle = page.locator('span', { hasText: 'Shared Learning Roadmap' });
    this.copyMarkdownButton = page.getByRole('button', { name: 'Copy Markdown' });
  }

  async navigateToReadme(queryParams?: string): Promise<void> {
    const url = queryParams ? `/share/readme?${queryParams}` : '/share/readme';
    await this.page.goto(url);
  }

  async navigateToRoadmap(queryParams?: string): Promise<void> {
    const url = queryParams ? `/share/roadmap?${queryParams}` : '/share/roadmap';
    await this.page.goto(url);
  }
}

export default SharePage;
