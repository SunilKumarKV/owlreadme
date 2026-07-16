import { test, expect } from '@playwright/test';
import { ReadmeBuilderPage } from '../../pages/ReadmeBuilderPage';
import { listenForConsoleErrors, expectNoErrors } from '../../helpers/utils';

test.describe('README Builder Comprehensive E2E Functional Suite', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = listenForConsoleErrors(page);
  });

  test.afterEach(async () => {
    expectNoErrors(consoleErrors);
  });

  test('1. Open README Builder', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();
  });

  test('2. Profile Section CRUD & Live Preview Updates', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Fill Bio & legacy skills
    const bioText = 'Experienced Frontend Engineer focused on React ecosystem.';
    const legacySkills = 'React, Next.js, Tailwind CSS';
    await builderPage.fillAboutBio(bioText);
    await builderPage.fillAboutSkills(legacySkills);

    // Wait for both values to appear in the raw markdown
    await builderPage.waitForMarkdownToContain(bioText);
    await builderPage.waitForMarkdownToContain(legacySkills);

    // Clear bio & skills
    await builderPage.fillAboutBio('');
    await builderPage.fillAboutSkills('');
    await builderPage.waitForMarkdownToNotContain(bioText);
    await builderPage.waitForMarkdownToNotContain(legacySkills);
  });

  test('3. Skills (Tech Stack Panel) & Badge Toggling', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Enable Tech Stack builder section (toggleSection waits for the search input to attach)
    await builderPage.toggleSection('techStack', true);

    // Search and select 'React'
    await builderPage.addTechStackBadge('React');
    // The tech registry has logo: 'react' (lowercase) — badge URL: ?logo=react
    await builderPage.waitForMarkdownToContain('logo=react');

    // Deselect React by clicking it again (it now shows ✓, clicking removes it)
    await builderPage.addTechStackBadge('React');
    await builderPage.waitForMarkdownToNotContain('logo=react');
  });

  test('4. Featured Projects Addition & Deletion', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    const projectData = {
      title: 'E2E Test Project',
      language: 'TypeScript',
      repoUrl: 'https://github.com/owluser/e2e-project',
      demoUrl: 'https://e2e-demo.vercel.app',
      description: 'Functional automated testing playground.',
      technologies: 'Playwright, Vitest',
    };

    // Enable manual projects section
    await builderPage.toggleSection('projects', true);

    // Add manual project
    await builderPage.addManualProject(projectData);
    await builderPage.waitForMarkdownToContain(projectData.title);
    await builderPage.waitForMarkdownToContain(projectData.demoUrl);
    await builderPage.waitForMarkdownToContain(projectData.description);

    // Delete project
    await builderPage.deleteProject(projectData.title);
    await builderPage.waitForMarkdownToNotContain(projectData.title);
  });

  test('5. Social Links Contacts Badges Config', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Enable socials section
    await builderPage.toggleSection('socials', true);

    // Toggle LinkedIn on
    await builderPage.toggleSocialPlatform('LinkedIn', true);
    await builderPage.fillSocialUsername('LinkedIn', 'linkedin-username');

    // Social registry has logo: 'linkedin' (lowercase) in badge URL
    await builderPage.waitForMarkdownToContain('logo=linkedin');
    await builderPage.waitForMarkdownToContain('linkedin.com/in/linkedin-username');

    // Toggle LinkedIn off
    await builderPage.toggleSocialPlatform('LinkedIn', false);
    await builderPage.waitForMarkdownToNotContain('linkedin.com/in/linkedin-username');
  });

  test('6. Standalone Badges & Visitor Counter', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Enable Visitor Counter
    await builderPage.toggleSection('visitor', true);
    await builderPage.fillVisitorUsername('test-github-user');
    await builderPage.fillVisitorColor('orange');

    await builderPage.waitForMarkdownToContain('color=orange');
    await builderPage.waitForMarkdownToContain('test-github-user');

    // Disable Visitor Counter
    await builderPage.toggleSection('visitor', false);
    await builderPage.waitForMarkdownToNotContain('color=orange');
  });

  test('7. GitHub Stats Panel Integration', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Enable GitHub Stats section (toggleSection waits for the username input to attach)
    await builderPage.toggleSection('githubStats', true);

    // GitHub stats only renders markdown when a username is present
    await builderPage.fillStatsUsername('testuser');
    await builderPage.waitForMarkdownToContain('github-readme-stats');

    // Toggle GitHub Stats off — markdown should be removed
    await builderPage.toggleSection('githubStats', false);
    await builderPage.waitForMarkdownToNotContain('github-readme-stats');
  });

  test('8. State Persistence across Page Reloads', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    const persistenceBioText = 'Persistence state check bio text content.';
    await builderPage.fillAboutBio(persistenceBioText);

    // Refresh page
    await page.reload();
    await builderPage.verifyPage();

    // Verify input value persisted
    const value = await builderPage.aboutBioInput.inputValue();
    expect(value).toBe(persistenceBioText);

    const md = await builderPage.getPreviewMarkdown();
    expect(md).toContain(persistenceBioText);
  });

  test('9. Edge Cases (Emojis, Emojis, Long text, Markdown characters)', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    const bioPayload = '🚀 Emojis Developer Profile 🔥 containing *markdown* chars like # headings and [links](http://test.com)';
    await builderPage.fillAboutBio(bioPayload);

    await builderPage.waitForMarkdownToContain(bioPayload);
  });

  test('10. Performance - No full page navigation on updates', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    const initialUrl = page.url();

    // Update form elements
    await builderPage.fillAboutBio('Performance check');

    // Assert that the URL stays exactly the same (no browser navigations or full page reloads occur)
    expect(page.url()).toBe(initialUrl);
  });
});
