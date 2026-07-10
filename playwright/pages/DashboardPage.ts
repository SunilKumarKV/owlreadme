import { Page, Locator, expect } from '@playwright/test';
import BasePage from './BasePage';
import ROUTES from '../helpers/routes';

export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly createProjectButton: Locator;
  readonly githubProfileImportTrigger: Locator;
  readonly alertBox: Locator;

  // Create workspace dialog locators
  readonly newProjectNameInput: Locator;
  readonly newProjectTypeSelect: Locator;
  readonly submitCreateProjectButton: Locator;

  // AI assistant panel
  readonly consultAILocator: Locator;
  readonly aiReadmeTab: Locator;
  readonly aiRoadmapTab: Locator;
  readonly aiProfileTab: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1', { hasText: 'Developer Workspace' });
    this.createProjectButton = page.getByRole('button', { name: 'Create your first project' }).or(page.getByRole('button', { name: 'Create New Project' }));
    this.githubProfileImportTrigger = page.getByRole('link', { name: 'Import from GitHub' }).or(page.locator('a', { hasText: 'Import from GitHub' }));
    this.alertBox = page.locator('div[role="alert"]');

    // Create workspace dialog
    this.newProjectNameInput = page.locator('#new-project-name');
    this.newProjectTypeSelect = page.locator('#new-project-type');
    this.submitCreateProjectButton = page.locator('button[type="submit"]', { hasText: 'Create Project' });

    // AI
    this.consultAILocator = page.locator('button', { hasText: 'Consult Owl AI' });
    this.aiReadmeTab = page.locator('button[role="tab"]', { hasText: 'README' });
    this.aiRoadmapTab = page.locator('button[role="tab"]', { hasText: 'Roadmap' });
    this.aiProfileTab = page.locator('button[role="tab"]', { hasText: 'Profile' });
  }

  async navigate(): Promise<void> {
    await this.goto(ROUTES.DASHBOARD);
  }

  async isLoaded(): Promise<void> {
    await this.waitForReady(this.heading);
  }

  async verifyPage(): Promise<void> {
    await this.isLoaded();
    await expect(this.heading).toBeVisible();
  }

  async clickCreateProject(): Promise<void> {
    await this.createProjectButton.first().click();
  }

  async createWorkspace(name: string, type: 'readme' | 'roadmap' | 'combined'): Promise<void> {
    await this.clickCreateProject();
    await this.newProjectNameInput.waitFor({ state: 'visible' });
    await this.newProjectNameInput.fill(name);
    await this.newProjectTypeSelect.selectOption(type);
    await this.submitCreateProjectButton.click();
  }

  async clickImportFromGithub(): Promise<void> {
    await this.githubProfileImportTrigger.first().click();
  }

  async consultOwlAI(): Promise<void> {
    await this.consultAILocator.waitFor({ state: 'visible' });
    await this.consultAILocator.click();
  }

  async selectAiTab(tab: 'readme' | 'roadmap' | 'profile'): Promise<void> {
    if (tab === 'readme') {
      await this.aiReadmeTab.click();
    } else if (tab === 'roadmap') {
      await this.aiRoadmapTab.click();
    } else if (tab === 'profile') {
      await this.aiProfileTab.click();
    }
  }

  async applyReadmeSuggestion(section: 'Bio Intro' | 'About Me' | 'Skills' | 'Projects'): Promise<void> {
    await this.selectAiTab('readme');
    let title = '';
    if (section === 'Bio Intro') title = 'Suggested Bio Intro';
    else if (section === 'About Me') title = 'Suggested About Me Paragraph';
    else if (section === 'Skills') title = 'Suggested Core Skills';
    else if (section === 'Projects') title = 'Suggested Projects Section';

    const container = this.page.locator('div').filter({ has: this.page.locator('span', { hasText: title }) }).first();
    const applyBtn = container.locator('button', { hasText: 'Apply' });
    await applyBtn.click();
  }

  async applyRoadmapSuggestion(): Promise<void> {
    await this.selectAiTab('roadmap');
    const container = this.page.locator('div').filter({ has: this.page.locator('span', { hasText: 'Recommended Steps Workflow' }) }).first();
    const applyBtn = container.locator('button', { hasText: 'Apply Steps' });
    await applyBtn.click();
  }

  async applyProfileSuggestion(section: 'Bio' | 'Tagline'): Promise<void> {
    await this.selectAiTab('profile');
    let title = '';
    if (section === 'Bio') title = 'Suggested Bio Improvement';
    else if (section === 'Tagline') title = 'Portfolio Tagline Suggestion';

    const container = this.page.locator('div').filter({ has: this.page.locator('span', { hasText: title }) }).first();
    const applyBtn = container.locator('button', { hasText: 'Apply' });
    await applyBtn.click();
  }

  async verifyErrorMsg(msgPattern: string | RegExp): Promise<void> {
    await this.alertBox.waitFor({ state: 'visible', timeout: 5000 });
    await expect(this.alertBox).toContainText(msgPattern);
  }

  async clickOpenWorkspace(name: string): Promise<void> {
    const row = this.page.locator('div').filter({ has: this.page.locator('h3', { hasText: name }) }).first();
    const openBtn = row.locator('button', { hasText: 'Open' });
    await openBtn.click();
  }

  async clickDeleteWorkspace(name: string): Promise<void> {
    const row = this.page.locator('div').filter({ has: this.page.locator('h3', { hasText: name }) }).first();
    const trashBtn = row.locator('button[title="Delete project"]');
    await trashBtn.click();
    const confirmBtn = row.locator('button', { hasText: 'Yes' });
    await confirmBtn.click();
  }

  async clickDuplicateWorkspace(name: string): Promise<void> {
    const row = this.page.locator('div').filter({ has: this.page.locator('h3', { hasText: name }) }).first();
    const duplicateBtn = row.locator('button[title="Duplicate project"]');
    await duplicateBtn.click();
  }
}

export default DashboardPage;
