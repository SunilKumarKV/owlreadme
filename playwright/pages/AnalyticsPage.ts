import { Page, Locator, expect } from '@playwright/test';
import BasePage from './BasePage';
import ROUTES from '../helpers/routes';

export class AnalyticsPage extends BasePage {
  readonly heading: Locator;
  readonly syncWarningCard: Locator;
  readonly statsCards: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Developer Analytics' }).first();
    this.syncWarningCard = page.getByRole('heading', { name: 'GitHub Profile Sync Required' }).first();
    this.statsCards = page.getByRole('heading', { level: 3 });
  }

  async navigate(): Promise<void> {
    await this.goto(ROUTES.ANALYTICS);
  }

  async isLoaded(): Promise<void> {
    await this.waitForReady(this.heading);
  }

  async verifyPage(): Promise<void> {
    await this.isLoaded();
    await expect(this.syncWarningCard).toBeVisible();
  }
}

export default AnalyticsPage;
