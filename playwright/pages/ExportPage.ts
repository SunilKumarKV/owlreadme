import { Page, Locator } from '@playwright/test';
import ROUTES from '../helpers/routes';

export class ExportPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly backToWorkspaceLink: Locator;
  readonly downloadCombinedButton: Locator;
  readonly downloadBackupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1', { hasText: 'Export Studio' });
    this.backToWorkspaceLink = page.getByRole('link', { name: 'Back to Workspace' });
    this.downloadCombinedButton = page.getByRole('button', { name: 'ZIP Package' }).or(page.locator('button', { hasText: 'Download ZIP' }));
    this.downloadBackupButton = page.getByRole('button', { name: 'Backup' }).or(page.locator('button', { hasText: 'JSON Backup' }));
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.EXPORT);
  }
}

export default ExportPage;
