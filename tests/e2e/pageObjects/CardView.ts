import { expect, Locator, Page } from '@playwright/test';

export class CardView {
  public readonly page: Page;
  public readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeButton = this.page.getByRole('button', { name: 'Close Card' });
  }

  public async expectOpen(cardName: string): Promise<void> {
    await expect(this.closeButton).toBeVisible();
    await expect(this.page.getByText(cardName).first()).toBeVisible();
  }

  public async close(): Promise<void> {
    await this.closeButton.click();
  }
}
