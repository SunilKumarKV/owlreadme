import { Page, Locator } from '@playwright/test';
import ROUTES from '../helpers/routes';

export class ThemePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly builderButton: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1', { hasText: 'Select Theme' });
    this.builderButton = page.getByRole('link', { name: 'Go to Builder' });
    this.homeButton = page.getByRole('link', { name: 'Home' });
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.THEME_STUDIO);
  }

  async selectThemeRadio(themeName: 'minimal' | 'dark' | 'gradient' | 'terminal'): Promise<void> {
    const labelText = themeName.charAt(0).toUpperCase() + themeName.slice(1);
    const radio = this.page.locator('label', { hasText: labelText }).locator('input[type="radio"]');
    await radio.check();
  }
}

export default ThemePage;
