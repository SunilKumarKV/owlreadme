import { Page, Locator } from '@playwright/test';
import ROUTES from '../helpers/routes';

export class BuilderPage {
  readonly page: Page;
  readonly logoText: Locator;
  readonly templateSelect: Locator;
  readonly themeSelect: Locator;
  readonly dashboardButton: Locator;
  readonly importReadmeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoText = page.locator('span', { hasText: 'OwlREADME' }).first();
    this.templateSelect = page.locator('#builder-template-select');
    this.themeSelect = page.locator('#builder-theme-select');
    this.dashboardButton = page.getByRole('link', { name: 'Dashboard' });
    this.importReadmeButton = page.getByRole('button', { name: 'Import README' });
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.README_BUILDER);
  }

  async selectTemplate(value: string): Promise<void> {
    await this.templateSelect.selectOption(value);
  }

  async selectTheme(value: string): Promise<void> {
    await this.themeSelect.selectOption(value);
  }
}

export default BuilderPage;
