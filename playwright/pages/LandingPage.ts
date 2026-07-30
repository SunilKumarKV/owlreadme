import { Page, Locator, expect } from '@playwright/test';
import BasePage from './BasePage';
import ROUTES from '../helpers/routes';

export class LandingPage extends BasePage {
  readonly usernameInput: Locator;
  readonly getStartedButton: Locator;
  readonly themeToggle: Locator;
  readonly heroHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel('GitHub Username').first();
    this.getStartedButton = page.getByRole('button', { name: 'Get Started' }).first();
    this.themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    this.heroHeading = page.getByRole('heading', { name: /Your GitHub Profile/i }).first();
  }

  async navigate(): Promise<void> {
    await this.goto(ROUTES.HOME);
  }

  async isLoaded(): Promise<void> {
    await this.waitForReady(this.heroHeading);
  }

  async verifyPage(): Promise<void> {
    await this.isLoaded();
    await expect(this.page).toHaveTitle(/OwlREADME/);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.getStartedButton).toBeVisible();
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.scrollIntoViewIfNeeded();
    await this.usernameInput.focus();
    await this.usernameInput.fill(username);
    await this.usernameInput.dispatchEvent('input');
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedButton.click();
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  async startBuilding(username: string): Promise<void> {
    await this.isLoaded();
    await this.enterUsername(username);
    await expect(this.getStartedButton).toBeEnabled();
    await this.clickGetStarted();
  }
}

export default LandingPage;
