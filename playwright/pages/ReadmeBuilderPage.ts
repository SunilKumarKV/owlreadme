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

  // About Panel Inputs — scoped to the AboutPanel h3 to avoid duplicate IDs with HeaderPanel
  readonly aboutBioInput: Locator;
  readonly aboutSkillsInput: Locator;

  // Preview elements
  readonly rawMarkdownEditor: Locator;

  // The AboutPanel section container (scoped to avoid HeaderPanel ID collisions)
  private readonly aboutSectionPanel: Locator;

  constructor(page: Page) {
    super(page);
    this.logoText = page.locator('span', { hasText: 'OwlREADME' }).first();
    this.templateSelect = page.locator('#builder-template-select').first();
    this.themeSelect = page.locator('#builder-theme-select').first();
    this.dashboardButton = page.getByRole('link', { name: 'Dashboard' }).first();
    this.importReadmeButton = page.getByRole('button', { name: 'Import README' }).first();
    this.resetViewButton = page.getByRole('button', { name: 'Reset View' }).first();

    // The AboutPanel has heading "📝 About Me & Skills Config".
    // We scope the textarea locators to this panel to avoid collision with HeaderPanel
    // which also renders #readme-about and #readme-skills (duplicate IDs in the DOM).
    // In AboutPanel.tsx the h3 is a DIRECT child of the outer panel div, so one parent hop.
    // Panels are rendered twice — use .first() to target the visible/active one.
    this.aboutSectionPanel = page
      .locator('h3', { hasText: 'About Me & Skills Config' })
      .first()
      .locator('..'); // outer panel div (direct parent of h3)
    this.aboutBioInput = this.aboutSectionPanel.locator('textarea[placeholder="About You"]').first();
    this.aboutSkillsInput = this.aboutSectionPanel.locator('textarea[placeholder="Skills (comma-separated or list)"]').first();

    // Raw markdown preview textarea (.raw-markdown-editor appears twice; take first)
    this.rawMarkdownEditor = page.locator('.raw-markdown-editor').first();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

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

  // ── Private helper: click an sr-only checkbox using JS evaluate ──────────
  /**
   * Clicks a checkbox that uses `sr-only` (clip/overflow hidden) via JS evaluate,
   * bypassing Playwright's visibility constraint while still firing React's synthetic
   * onChange event. Only clicks if the current state differs from the desired state.
   */
  private async clickSrOnlyCheckbox(checkbox: Locator, enable: boolean): Promise<void> {
    await checkbox.waitFor({ state: 'attached' });
    const isChecked = await checkbox.isChecked();
    if (isChecked !== enable) {
      // evaluate() fires the native DOM click which React's synthetic event system responds to
      await checkbox.evaluate((el: HTMLInputElement) => el.click());
    }
  }

  // ── About Panel ──────────────────────────────────────────────────────────

  async fillAboutBio(text: string): Promise<void> {
    await this.aboutBioInput.scrollIntoViewIfNeeded();
    await this.aboutBioInput.fill(text);
  }

  async fillAboutSkills(text: string): Promise<void> {
    await this.aboutSkillsInput.scrollIntoViewIfNeeded();
    await this.aboutSkillsInput.fill(text);
  }

  // ── Section Enable/Disable Toggles ───────────────────────────────────────

  /**
   * Finds the enable-toggle sr-only checkbox for a named section panel.
   * Navigates: h3[heading] -> parent div (flex row) -> sibling label -> input[sr-only].
   * Uses the Playwright locator chain with nth(0) to ensure uniqueness.
   * JS evaluate click is used because sr-only sets clip:rect(0,0,0,0) making the
   * element invisible to Playwright's action visibility checks.
   */
  private getPanelCheckbox(headingText: string): Locator {
    // The sr-only checkbox sits inside a <label> that is a sibling of the <h3>.
    // Both live inside a flex div: div.flex > h3 + label > input[sr-only]
    // Panels are rendered twice — .first() on the h3 picks the active/visible instance.
    return this.page
      .locator('h3', { hasText: headingText })
      .first()
      .locator('..')
      .locator('label > input[type="checkbox"]')
      .first();
  }

  /**
   * Returns the sections-manager sidebar checkbox for a section by its display name.
   * DOM: input[type="checkbox"] + span[sectionName] inside a Reorder.Item flex row.
   */
  private getSidebarSectionCheckbox(sectionName: string): Locator {
    return this.page
      .locator('span', { hasText: sectionName })
      .first()
      .locator('xpath=preceding-sibling::input[@type="checkbox"][1]');
  }

  async toggleSection(
    sectionId: 'techStack' | 'socials' | 'githubStats' | 'visitor' | 'projects',
    enable: boolean,
  ): Promise<void> {
    const headingMap: Record<typeof sectionId, string> = {
      techStack: 'Tech Stack Builder',
      socials: 'Social Links & Contact Builder',
      githubStats: 'GitHub Stats Builder',
      visitor: 'Standalone Visitor Counter',
      projects: 'Featured Projects Config',
    };

    // Map section IDs to their display name in the sidebar sections manager.
    // Only 'visitor' starts disabled in the sidebar (enabled: false by default).
    const sidebarNameMap: Partial<Record<typeof sectionId, string>> = {
      visitor: 'Visitor Counter',
    };

    // For sections that start disabled in the sidebar, also toggle the section-level checkbox.
    const sidebarName = sidebarNameMap[sectionId];
    if (sidebarName !== undefined) {
      const sidebarCheckbox = this.getSidebarSectionCheckbox(sidebarName);
      const isChecked = await sidebarCheckbox.isChecked();
      if (isChecked !== enable) {
        await sidebarCheckbox.click();
      }
    }

    const checkbox = this.getPanelCheckbox(headingMap[sectionId]);
    await this.clickSrOnlyCheckbox(checkbox, enable);

    // After enabling a panel, wait for its content to be mounted in the DOM
    if (enable) {
      if (sectionId === 'techStack') {
        await this.page.locator('#tech-search-input').first().waitFor({ state: 'attached' });
      } else if (sectionId === 'githubStats') {
        await this.page.locator('#stats-username').first().waitFor({ state: 'attached' });
      } else if (sectionId === 'visitor') {
        // When standaloneVisitor.enabled becomes true, VisitorCounterPanel renders
        // an <Input placeholder={defaultUsername || 'username'} /> for the GitHub username.
        // With an empty githubStats.username (the default), the placeholder is 'username'.
        // Wait for that input to be attached to the DOM.
        await this.page
          .locator('input[placeholder="username"]')
          .first()
          .waitFor({ state: 'attached', timeout: 10000 });
      }
    }
  }


  // ── Tech Stack Panel ─────────────────────────────────────────────────────

  /**
   * Types a tech name into the search box, clicks the matching result badge button,
   * then clears the search input. The panel must be enabled before calling this.
   *
   * Each badge button renders: <span>✓ or +</span><span>techName</span>
   * We match on the span inside the button that has the exact tech name text.
   */
  async addTechStackBadge(techName: string): Promise<void> {
    const searchInput = this.page.locator('#tech-search-input').first();
    await searchInput.scrollIntoViewIfNeeded();
    await expect(searchInput).toBeVisible();
    await searchInput.fill(techName);

    // Match the button that contains a span with exactly the tech name.
    // hasText on the button itself matches substring of its full text content.
    // We scope to the "Available Badges" grid container to avoid category filter buttons.
    // Panels are rendered twice — use .first() on the span to target the active panel.
    const badgesGrid = this.page
      .locator('span', { hasText: 'Available Badges' })
      .first()
      .locator('xpath=following-sibling::div[1]');
    const badgeButton = badgesGrid
      .locator('button')
      .filter({ has: this.page.locator('span', { hasText: techName }) })
      .first();
    await expect(badgeButton).toBeVisible();
    await badgeButton.click();

    // Clear search so state is clean for any subsequent calls
    await searchInput.fill('');
  }

  // ── Featured Projects Panel ───────────────────────────────────────────────

  async addManualProject(data: {
    title: string;
    language?: string;
    repoUrl?: string;
    demoUrl?: string;
    description?: string;
    technologies?: string;
  }): Promise<void> {
    // Reveal the manual entry form if it is currently hidden
    const titleInput = this.page.locator('input[placeholder="Project name"]');
    if (!(await titleInput.isVisible())) {
      await this.page.getByRole('button', { name: 'Toggle manual project form' }).click();
      await expect(titleInput).toBeVisible();
    }

    await titleInput.fill(data.title);
    if (data.language) {
      await this.page.locator('input[placeholder="TypeScript"]').fill(data.language);
    }
    if (data.repoUrl) {
      await this.page.locator('input[placeholder="https://github.com/user/repo"]').fill(data.repoUrl);
    }
    if (data.demoUrl) {
      await this.page.locator('input[placeholder="https://myproject.vercel.app"]').fill(data.demoUrl);
    }
    if (data.description) {
      await this.page.locator('textarea[placeholder="Short project description…"]').fill(data.description);
    }
    if (data.technologies) {
      await this.page.locator('input[placeholder="React, Node.js, PostgreSQL"]').fill(data.technologies);
    }

    const addBtn = this.page.getByRole('button', { name: 'Add manual project to list' });
    await expect(addBtn).toBeEnabled();
    await addBtn.click();
  }

  async deleteProject(title: string): Promise<void> {
    const deleteButton = this.page.getByRole('button', { name: `Remove ${title}` });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
  }

  // ── Social Links Panel ───────────────────────────────────────────────────

  /**
   * Toggles a social platform on or off. The platform checkbox uses
   * `aria-label="Toggle {platformName}"` and is a regular visible checkbox.
   */
  async toggleSocialPlatform(platformName: string, enable: boolean): Promise<void> {
    const searchInput = this.page.locator('#social-search-input').first();
    await searchInput.scrollIntoViewIfNeeded();
    await expect(searchInput).toBeVisible();
    await searchInput.fill(platformName);

    const checkbox = this.page
      .locator(`input[type="checkbox"][aria-label="Toggle ${platformName}"]`)
      .first();
    await checkbox.waitFor({ state: 'visible' });
    const isChecked = await checkbox.isChecked();
    if (isChecked !== enable) {
      await checkbox.click();
    }
  }

  async fillSocialUsername(platformName: string, value: string): Promise<void> {
    // DOM structure of platform card:
    //   div.p-4 (platform card)
    //     div.flex.justify-between (header row)
    //       div.flex.gap-2
    //         input[aria-label="Toggle {name}"]   ← checkbox
    //         span[name]
    //       img (badge)
    //     {enabled && div > label + Input > div > input[type="text"]}
    //
    // From checkbox: ('..'×1 = div.gap-2) ('..'×2 = div.justify-between) ('..'×3 = platform card)
    const platformCard = this.page
      .locator(`input[type="checkbox"][aria-label="Toggle ${platformName}"]`)
      .first()
      .locator('..')  // div.flex.gap-2
      .locator('..')  // div.flex.justify-between (header row)
      .locator('..'); // div.p-4 (platform card)
    // The conditional input sits inside a div > Input wrapper within the platform card.
    // The Input UI component renders <input> WITHOUT an explicit type attribute,
    // so input[type="text"] won't match. Use input:not([type="checkbox"]) instead.
    const input = platformCard.locator('input:not([type="checkbox"])').first();
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill(value);
  }

  // ── GitHub Stats Panel ───────────────────────────────────────────────────

  async fillStatsUsername(username: string): Promise<void> {
    const input = this.page.locator('#stats-username').first();
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeVisible();
    await input.fill(username);
  }

  // ── Visitor Counter Panel ────────────────────────────────────────────────

  async fillVisitorUsername(username: string): Promise<void> {
    // VisitorCounterPanel renders <Input placeholder={defaultUsername || 'username'} />
    // With no githubStats.username set (the default), placeholder = 'username'.
    // This input only exists when standaloneVisitor.enabled is true.
    const input = this.page.locator('input[placeholder="username"]').first();
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill(username);
  }

  async fillVisitorColor(color: string): Promise<void> {
    const input = this.page.locator('input[placeholder="green"]').first();
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeVisible();
    await input.fill(color);
  }

  // ── Preview ──────────────────────────────────────────────────────────────

  async getPreviewMarkdown(): Promise<string> {
    return await this.rawMarkdownEditor.inputValue();
  }

  /**
   * Polls the raw markdown until the substring appears. Avoids fixed timeouts.
   */
  async waitForMarkdownToContain(substring: string, timeout = 15000): Promise<void> {
    await expect
      .poll(async () => this.rawMarkdownEditor.inputValue(), { timeout })
      .toContain(substring);
  }

  /**
   * Polls the raw markdown until the substring disappears. Avoids fixed timeouts.
   */
  async waitForMarkdownToNotContain(substring: string, timeout = 15000): Promise<void> {
    await expect
      .poll(async () => this.rawMarkdownEditor.inputValue(), { timeout })
      .not.toContain(substring);
  }
}

export default ReadmeBuilderPage;
