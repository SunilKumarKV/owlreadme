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
    this.heading = page.getByRole('heading', { name: 'Developer Workspace' }).first();
    this.createProjectButton = page.getByRole('button', { name: /Create your first project|New Project/i }).first();
    this.githubProfileImportTrigger = page.getByRole('link', { name: 'Import from GitHub' }).first();
    this.alertBox = page.getByRole('alert').filter({ hasNot: page.locator('#__next-route-announcer__') }).first();

    // Create workspace dialog
    this.newProjectNameInput = page.getByLabel(/Project Name|Workspace Name/i).or(page.locator('#new-project-name')).first();
    this.newProjectTypeSelect = page.getByLabel(/Project Type|Type/i).or(page.locator('#new-project-type')).first();
    this.submitCreateProjectButton = page.getByRole('button', { name: 'Create Project' }).first();

    // AI
    this.consultAILocator = page.getByRole('button', { name: 'Consult Owl AI' }).first();
    this.aiReadmeTab = page.getByRole('tab', { name: 'README' }).first();
    this.aiRoadmapTab = page.getByRole('tab', { name: 'Roadmap' }).first();
    this.aiProfileTab = page.getByRole('tab', { name: 'Profile' }).first();
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
    await this.page.waitForTimeout(500);
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

    const container = this.page.getByText(title).locator('..').locator('..').first();
    const applyBtn = container.getByRole('button', { name: 'Apply' }).first();
    await applyBtn.click();
  }

  async applyRoadmapSuggestion(): Promise<void> {
    await this.selectAiTab('roadmap');
    const container = this.page.getByText('Recommended Steps Workflow').locator('..').locator('..').first();
    const applyBtn = container.getByRole('button', { name: 'Apply Steps' }).first();
    await applyBtn.click();
  }

  async applyProfileSuggestion(section: 'Bio' | 'Tagline'): Promise<void> {
    await this.selectAiTab('profile');
    let title = '';
    if (section === 'Bio') title = 'Suggested Bio Improvement';
    else if (section === 'Tagline') title = 'Portfolio Tagline Suggestion';

    const container = this.page.getByText(title).locator('..').locator('..').first();
    const applyBtn = container.getByRole('button', { name: 'Apply' }).first();
    await applyBtn.click();
  }

  async verifyErrorMsg(msgPattern: string | RegExp): Promise<void> {
    await this.alertBox.waitFor({ state: 'visible', timeout: 5000 });
    await expect(this.alertBox).toContainText(msgPattern);
  }

  async clickOpenWorkspace(name: string): Promise<void> {
    const row = this.page.getByRole('heading', { name, level: 3 }).locator('..').locator('..').first();
    const openBtn = row.getByRole('button', { name: 'Open' });
    await openBtn.click();
  }

  async clickDeleteWorkspace(name: string): Promise<void> {
    const row = this.page.getByRole('heading', { name, level: 3 }).locator('..').locator('..').first();
    const trashBtn = row.getByRole('button', { name: /Delete/i });
    await trashBtn.click();
    const confirmBtn = row.getByRole('button', { name: 'Yes' });
    await confirmBtn.click();
  }

  async clickDuplicateWorkspace(name: string): Promise<void> {
    const row = this.page.getByRole('heading', { name, level: 3 }).locator('..').locator('..').first();
    const duplicateBtn = row.getByRole('button', { name: /Duplicate/i });
    await duplicateBtn.click();
  }
}

export default DashboardPage;
