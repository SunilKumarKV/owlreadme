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

    // Assert updates in raw markdown
    let md = await builderPage.getPreviewMarkdown();
    expect(md).toContain(bioText);
    expect(md).toContain(legacySkills);

    // Clear bio & skills
    await builderPage.fillAboutBio('');
    await builderPage.fillAboutSkills('');
    md = await builderPage.getPreviewMarkdown();
    expect(md).not.toContain(bioText);
    expect(md).not.toContain(legacySkills);
  });

  test('3. Skills (Tech Stack Panel) & Badge Toggling', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Enable Tech Stack builder section
    await builderPage.toggleSection('techStack', true);

    // Search and select 'React'
    await builderPage.addTechStackBadge('React');
    let md = await builderPage.getPreviewMarkdown();
    expect(md).toContain('logo=React');

    // Duplicate prevention (deselects if clicked again)
    await builderPage.addTechStackBadge('React');
    md = await builderPage.getPreviewMarkdown();
    expect(md).not.toContain('logo=React');
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

    // Add manual project
    await builderPage.addManualProject(projectData);
    let md = await builderPage.getPreviewMarkdown();
    expect(md).toContain(projectData.title);
    expect(md).toContain(projectData.demoUrl);
    expect(md).toContain(projectData.description);

    // Delete project
    await builderPage.deleteProject(projectData.title);
    md = await builderPage.getPreviewMarkdown();
    expect(md).not.toContain(projectData.title);
  });

  test('5. Social Links Contacts Badges Config', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Enable socials
    await builderPage.toggleSection('socials', true);

    // Add LinkedIn Link
    await builderPage.toggleSocialPlatform('LinkedIn', true);
    await builderPage.fillSocialUsername('LinkedIn', 'linkedin-username');

    let md = await builderPage.getPreviewMarkdown();
    expect(md).toContain('logo=LinkedIn');
    expect(md).toContain('linkedin.com/in/linkedin-username');

    // Toggle off LinkedIn
    await builderPage.toggleSocialPlatform('LinkedIn', false);
    md = await builderPage.getPreviewMarkdown();
    expect(md).not.toContain('linkedin.com/in/linkedin-username');
  });

  test('6. Standalone Badges & Visitor Counter', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Enable Visitor Counter
    await builderPage.toggleSection('visitor', true);
    await builderPage.fillVisitorUsername('test-github-user');
    await builderPage.fillVisitorColor('orange');

    let md = await builderPage.getPreviewMarkdown();
    expect(md).toContain('color=orange');
    expect(md).toContain('test-github-user');

    // Disable Visitor Counter
    await builderPage.toggleSection('visitor', false);
    md = await builderPage.getPreviewMarkdown();
    expect(md).not.toContain('color=orange');
  });

  test('7. GitHub Stats Panel Integration', async ({ page }) => {
    const builderPage = new ReadmeBuilderPage(page);
    await builderPage.navigate();
    await builderPage.verifyPage();

    // Toggle GitHub Stats
    await builderPage.toggleSection('githubStats', true);
    let md = await builderPage.getPreviewMarkdown();
    expect(md).toContain('github-readme-stats');

    // Toggle GitHub Stats off
    await builderPage.toggleSection('githubStats', false);
    md = await builderPage.getPreviewMarkdown();
    expect(md).not.toContain('github-readme-stats');
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

    const md = await builderPage.getPreviewMarkdown();
    expect(md).toContain(bioPayload);
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
