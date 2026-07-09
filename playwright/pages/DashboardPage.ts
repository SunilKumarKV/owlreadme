import { Page, Locator } from '@playwright/test';
import ROUTES from '../helpers/routes';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly createProjectButton: Locator;
  readonly githubProfileImportTrigger: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1', { hasText: 'Developer Workspace' });
    this.createProjectButton = page.getByRole('button', { name: 'Create your first project' }).or(page.getByRole('button', { name: 'Create New Project' }));
    this.githubProfileImportTrigger = page.getByRole('link', { name: 'Import from GitHub' });
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.DASHBOARD);
  }
}

export default DashboardPage;
