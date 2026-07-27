import { Page, Locator, expect } from '@playwright/test';
import { waitForToast, waitForLoadingToFinish, waitForApi } from '../helpers/utils';

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

  // Common E2E helper Actions delegated to helpers/utils.ts
  async waitForToast(message?: string): Promise<void> {
    await waitForToast(this.page, message);
  }

  async waitForLoadingToFinish(): Promise<void> {
    await waitForLoadingToFinish(this.page);
  }

  async waitForApi(urlPattern: string | RegExp): Promise<void> {
    await waitForApi(this.page, urlPattern);
  }
}

export default BasePage;
