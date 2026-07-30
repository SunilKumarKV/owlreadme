import { Page, Locator, expect } from '@playwright/test';
import BasePage from './BasePage';
import ROUTES from '../helpers/routes';

export class RoadmapBuilderPage extends BasePage {
  readonly heading: Locator;
  readonly templateSelect: Locator;
  readonly titleInput: Locator;
  readonly addStepButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /Create Your Roadmap|Roadmap/i }).first();
    this.templateSelect = page.getByLabel(/Select Roadmap Template|Template/i).or(page.locator('#roadmap-template-select')).first();
    this.titleInput = page.getByLabel(/Roadmap Title|Title/i).or(page.locator('#roadmap-title')).first();
    this.addStepButton = page.getByRole('button', { name: 'Add Step' }).first();
  }

  async navigate(): Promise<void> {
    await this.goto(ROUTES.ROADMAP_BUILDER);
  }

  async isLoaded(): Promise<void> {
    await this.waitForReady(this.heading);
  }

  async verifyPage(): Promise<void> {
    await this.isLoaded();
    await expect(this.templateSelect).toBeVisible();
    await expect(this.titleInput).toBeVisible();
  }

  async selectTemplate(templateName: string): Promise<void> {
    await this.templateSelect.selectOption(templateName);
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async addStep(text: string): Promise<void> {
    await this.addStepButton.click();
    const lastInput = this.page.locator('textarea[placeholder^="Step"]').last();
    await lastInput.fill(text);
  }

  async fillStep(index: number, text: string): Promise<void> {
    const input = this.page.locator(`textarea[id="roadmap-step-${index}"]`);
    await input.fill(text);
  }

  async removeStep(index: number): Promise<void> {
    const removeBtn = this.page.locator(`button[aria-label="Remove step ${index + 1}"]`);
    await removeBtn.click();
  }

  async getStepsCount(): Promise<number> {
    return await this.page.locator('textarea[placeholder^="Step"]').count();
  }
}

export default RoadmapBuilderPage;
