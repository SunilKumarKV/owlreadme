import { Page, Locator, expect } from '@playwright/test';
import BasePage from './BasePage';
import ROUTES from '../helpers/routes';

export class ReadmeBuilderPage extends BasePage {
  readonly logoText: Locator;
  readonly templateSelect: Locator;
  readonly themeSelect: Locator;
  readonly dashboardButton: Locator;
  readonly importReadmeButton: Locator;
  readonly resetViewButton: Locator;

  // About Panel Inputs
  readonly aboutBioInput: Locator;
  readonly aboutSkillsInput: Locator;

  // Sibling checkboxes toggles
  readonly techStackCheckbox: Locator;
  readonly socialsCheckbox: Locator;
  readonly githubStatsCheckbox: Locator;
  readonly visitorCounterCheckbox: Locator;

  // Project Manual Entry elements
  readonly showProjectFormButton: Locator;
  readonly projectTitleInput: Locator;
  readonly projectLangInput: Locator;
  readonly projectRepoUrlInput: Locator;
  readonly projectDemoUrlInput: Locator;
  readonly projectDescInput: Locator;
  readonly projectTechInput: Locator;
  readonly addProjectButton: Locator;

  // Tech Stack elements
  readonly techSearchInput: Locator;

  // Social Links elements
  readonly socialSearchInput: Locator;

  // Visitor Counter elements
  readonly visitorUsernameInput: Locator;
  readonly visitorColorInput: Locator;

  // Preview elements
  readonly rawMarkdownEditor: Locator;

  constructor(page: Page) {
    super(page);
    this.logoText = page.locator('span', { hasText: 'OwlREADME' }).first();
    this.templateSelect = page.locator('#builder-template-select').first();
    this.themeSelect = page.locator('#builder-theme-select').first();
    this.dashboardButton = page.getByRole('link', { name: 'Dashboard' }).first();
    this.importReadmeButton = page.getByRole('button', { name: 'Import README' }).first();
    this.resetViewButton = page.getByRole('button', { name: 'Reset View' }).first();

    // About Panel Inputs (Resolve strict mode violations by taking first visible element)
    this.aboutBioInput = page.locator('#readme-about').first();
    this.aboutSkillsInput = page.locator('#readme-skills').first();

    // Section checkboxes (finding first input inside matching header section)
    this.techStackCheckbox = page.locator('div').filter({ has: page.locator('h3', { hasText: 'Tech Stack Builder' }) }).locator('input[type="checkbox"]').first();
    this.socialsCheckbox = page.locator('div').filter({ has: page.locator('h3', { hasText: 'Social Links & Contact Builder' }) }).locator('input[type="checkbox"]').first();
    this.githubStatsCheckbox = page.locator('div').filter({ has: page.locator('h3', { hasText: 'GitHub Stats Builder' }) }).locator('input[type="checkbox"]').first();
    this.visitorCounterCheckbox = page.locator('div').filter({ has: page.locator('h3', { hasText: 'Standalone Visitor Counter' }) }).locator('input[type="checkbox"]').first();

    // Projects elements
    this.showProjectFormButton = page.getByRole('button', { name: 'Toggle manual project form' }).first();
    this.projectTitleInput = page.locator('input[placeholder="Project name"]').first();
    this.projectLangInput = page.locator('input[placeholder="TypeScript"]').first();
    this.projectRepoUrlInput = page.locator('input[placeholder="https://github.com/user/repo"]').first();
    this.projectDemoUrlInput = page.locator('input[placeholder="https://myproject.vercel.app"]').first();
    this.projectDescInput = page.locator('textarea[placeholder="Short project description…"]').first();
    this.projectTechInput = page.locator('input[placeholder="React, Node.js, PostgreSQL"]').first();
    this.addProjectButton = page.locator('button', { hasText: 'Add Custom Project' }).first();

    // Tech Stack Elements
    this.techSearchInput = page.locator('#tech-search-input').first();

    // Social Links search
    this.socialSearchInput = page.locator('#social-search-input').first();

    // Visitor counter inputs
    this.visitorUsernameInput = page.locator('div').filter({ has: page.locator('h3', { hasText: 'Standalone Visitor Counter' }) }).locator('input[type="text"]').first();
    this.visitorColorInput = page.locator('div').filter({ has: page.locator('h3', { hasText: 'Standalone Visitor Counter' }) }).locator('input[placeholder="green"]').first();

    // Raw markdown preview textarea
    this.rawMarkdownEditor = page.locator('.raw-markdown-editor').first();
  }

  async navigate(): Promise<void> {
    await this.goto(ROUTES.README_BUILDER);
  }

  async isLoaded(): Promise<void> {
    await this.waitForReady(this.logoText);
  }

  async verifyPage(): Promise<void> {
    await this.isLoaded();
    await expect(this.templateSelect).toBeVisible();
    await expect(this.themeSelect).toBeVisible();
  }

  async selectTemplate(value: string): Promise<void> {
    await this.templateSelect.selectOption(value);
  }

  async selectTheme(value: string): Promise<void> {
    await this.themeSelect.selectOption(value);
  }

  async clickResetView(): Promise<void> {
    await this.resetViewButton.click();
  }

  async clickImportReadme(): Promise<void> {
    await this.importReadmeButton.click();
  }

  async clickDashboard(): Promise<void> {
    await this.dashboardButton.click();
  }

  // ── Form Action Handlers ──────────────────────────────────────────────────

  async fillAboutBio(text: string): Promise<void> {
    await this.aboutBioInput.fill(text);
  }

  async fillAboutSkills(text: string): Promise<void> {
    await this.aboutSkillsInput.fill(text);
  }

  async toggleSection(sectionId: 'techStack' | 'socials' | 'githubStats' | 'visitor', enable: boolean): Promise<void> {
    let checkbox: Locator;
    if (sectionId === 'techStack') checkbox = this.techStackCheckbox;
    else if (sectionId === 'socials') checkbox = this.socialsCheckbox;
    else if (sectionId === 'githubStats') checkbox = this.githubStatsCheckbox;
    else checkbox = this.visitorCounterCheckbox;

    const isChecked = await checkbox.isChecked();
    if (isChecked !== enable) {
      await checkbox.click({ force: true });
    }
  }

  async addManualProject(data: {
    title: string;
    language?: string;
    repoUrl?: string;
    demoUrl?: string;
    description?: string;
    technologies?: string;
  }): Promise<void> {
    // Check if form is visible first, otherwise toggle it
    if (!(await this.projectTitleInput.isVisible())) {
      await this.showProjectFormButton.click();
    }
    await this.projectTitleInput.fill(data.title);
    if (data.language) await this.projectLangInput.fill(data.language);
    if (data.repoUrl) await this.projectRepoUrlInput.fill(data.repoUrl);
    if (data.demoUrl) await this.projectDemoUrlInput.fill(data.demoUrl);
    if (data.description) await this.projectDescInput.fill(data.description);
    if (data.technologies) await this.projectTechInput.fill(data.technologies);
    await this.addProjectButton.click();
  }

  async deleteProject(title: string): Promise<void> {
    const deleteButton = this.page.getByRole('button', { name: `Remove ${title}`, exact: true }).first();
    await deleteButton.click();
  }

  async addTechStackBadge(techName: string): Promise<void> {
    await this.techSearchInput.fill(techName);
    const badgeButton = this.page.locator('button').filter({ hasText: techName }).first();
    await badgeButton.click();
  }

  async toggleSocialPlatform(platformName: string, enable: boolean): Promise<void> {
    await this.socialSearchInput.fill(platformName);
    const checkbox = this.page.getByRole('checkbox', { name: `Toggle ${platformName}`, exact: true }).first();
    const isChecked = await checkbox.isChecked();
    if (isChecked !== enable) {
      await checkbox.click({ force: true });
    }
  }

  async fillSocialUsername(platformName: string, value: string): Promise<void> {
    const container = this.page.locator('div').filter({ has: this.page.locator('span', { hasText: platformName }) }).first();
    const input = container.locator('input[type="text"]').first();
    await input.fill(value);
  }

  async fillVisitorUsername(username: string): Promise<void> {
    await this.visitorUsernameInput.fill(username);
  }

  async fillVisitorColor(color: string): Promise<void> {
    await this.visitorColorInput.fill(color);
  }

  async getPreviewMarkdown(): Promise<string> {
    return await this.rawMarkdownEditor.inputValue();
  }
}

export default ReadmeBuilderPage;
