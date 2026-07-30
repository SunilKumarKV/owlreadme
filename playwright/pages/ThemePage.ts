import { Page, Locator, expect } from '@playwright/test';
import BasePage from './BasePage';
import ROUTES from '../helpers/routes';

export class ThemePage extends BasePage {
  readonly heading: Locator;
  readonly builderButton: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /Select Theme|Theme/i }).first();
    this.builderButton = page.getByRole('link', { name: 'Go to Builder' });
    this.homeButton = page.getByRole('link', { name: 'Home' });
  }

  async navigate(): Promise<void> {
    await this.goto(ROUTES.THEME_STUDIO);
  }

  async isLoaded(): Promise<void> {
    await this.waitForReady(this.heading);
  }

  async verifyPage(): Promise<void> {
    await this.isLoaded();
    await expect(this.heading).toBeVisible();
  }

  async selectThemeRadio(themeName: 'minimal' | 'dark' | 'gradient' | 'terminal'): Promise<void> {
    const labelText = themeName.charAt(0).toUpperCase() + themeName.slice(1);
    const radio = this.page.getByRole('radio', { name: new RegExp(labelText, 'i') }).or(
      this.page.getByLabel(new RegExp(labelText, 'i'))
    ).first();
    await radio.check();
  }

  async clickGoToBuilder(): Promise<void> {
    await this.builderButton.click();
  }

  async clickHome(): Promise<void> {
    await this.homeButton.click();
  }
}

export default ThemePage;
