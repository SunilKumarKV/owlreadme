import { Page, Locator } from '@playwright/test';
import ROUTES from '../helpers/routes';

export class LandingPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly getStartedButton: Locator;
  readonly themeToggle: Locator;
  readonly heroHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    // Utilize descriptive semantic selectors or roles
    this.usernameInput = page.locator('#hero-github-username');
    this.getStartedButton = page.locator('button[type="submit"]', { hasText: 'Get Started' });
    this.themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    this.heroHeading = page.locator('h1', { hasText: 'Your GitHub Profile' });
  }

  /**
   * Navigates to the home page.
   */
  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.HOME);
  }

  /**
   * Enters the GitHub username in the hero form input field.
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Submits the username form.
   */
  async clickGetStarted(): Promise<void> {
    await this.getStartedButton.click();
  }

  /**
   * Triggers the theme toggle button.
   */
  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  /**
   * Helper that enters a username and clicks the start button.
   */
  async startBuilding(username: string): Promise<void> {
    await this.enterUsername(username);
    await this.clickGetStarted();
  }
}

export default LandingPage;
