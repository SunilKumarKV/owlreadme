import { Page, Locator } from '@playwright/test';
import ROUTES from '../helpers/routes';

export class AnalyticsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly syncWarningCard: Locator;
  readonly statsCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1', { hasText: 'Developer Analytics' });
    this.syncWarningCard = page.locator('h3', { hasText: 'GitHub Profile Sync Required' });
    this.statsCards = page.locator('.grid >> div >> h3'); // Finds headings in the grids
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.ANALYTICS);
  }
}

export default AnalyticsPage;
