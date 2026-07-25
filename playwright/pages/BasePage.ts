import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForReady(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  assertNoConsoleErrors(errors: string[]): void {
    expect(errors).toEqual([]);
  }

  // Common E2E helper Actions
  async waitForToast(message?: string): Promise<void> {
    const locator = this.page.locator('.fixed.bottom-6.flex.items-center, .fixed.bottom-6');
    await locator.first().waitFor({ state: 'visible', timeout: 10000 });
    if (message) {
      await expect(locator.first()).toContainText(message);
    }
  }

  async waitForLoadingToFinish(): Promise<void> {
    const loader = this.page.locator('text=Loading');
    if (await loader.count() > 0) {
      await loader.first().waitFor({ state: 'hidden', timeout: 10000 });
    }
  }

  async waitForApi(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForResponse(urlPattern);
  }
}

export default BasePage;
