import { expect, Locator, Page } from '@playwright/test';

export class ProjectSettingsPage {
  public readonly page: Page;
  public readonly title: Locator;
  public readonly deleteProjectButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.getByRole('heading', { name: 'Project Settings' });
    this.deleteProjectButton = this.page.getByRole('button', { name: 'Delete Project' });
  }

  public async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
  }

  public async deleteProject(): Promise<void> {
    await this.deleteProjectButton.click();
    await this.page.getByRole('button', { name: 'Delete project', description: 'Delete project', exact: true }).click();
  }
}
