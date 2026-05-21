import { expect, Locator, Page } from '@playwright/test';
import { CardView } from './CardView';
import { ProjectSettingsPage } from './ProjectSettingsPage';

export class BoardPage {
  public readonly page: Page;
  public readonly addBoardButton: Locator;
  public readonly addProjectButton: Locator;
  public readonly addListButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addBoardButton = this.page.getByRole('button', { name: 'Add Board' }).first();
    this.addProjectButton = this.page.getByRole('button', { name: 'Add Project' }).first();
    this.addListButton = this.page.getByRole('button', { name: 'Add list' });
  }

  public async expectLoaded(): Promise<void> {
    await expect(this.addBoardButton).toBeVisible();
  }

  public async createProject(projectName: string): Promise<void> {
    await this.addProjectButton.click();
    await this.page.getByRole('textbox', { name: 'Enter project name...' }).fill(projectName);
    await this.page.getByRole('dialog').getByRole('button', { name: 'Add Project' }).click();

    await expect(this.page.getByText(projectName).first()).toBeVisible();
  }

  public async createBoard(boardName: string, projectName: string): Promise<void> {
    await this.addBoardButton.click();
    await this.page.getByRole('textbox', { name: 'Enter board name...' }).fill(boardName);
    await this.selectProject(projectName);
    await this.page.getByRole('dialog').getByRole('button', { name: 'Add Board' }).click();

    await expect(this.page.getByText(boardName).first()).toBeVisible();
  }

  public async createList(listName: string): Promise<void> {
    await this.addListButton.click();
    await this.page.getByRole('textbox', { name: 'Enter list name...' }).fill(listName);
    await this.addListButton.click();

    await expect(this.page.getByText(listName)).toBeVisible();
  }

  public async cancelListCreation(listName: string): Promise<void> {
    await this.addListButton.click();
    await this.page.getByRole('textbox', { name: 'Enter list name...' }).fill(listName);
    await this.page.getByRole('button', { name: 'Cancel', description: 'Cancel', exact: true }).click();

    await expect(this.page.getByText(listName)).not.toBeVisible();
  }

  public async addCardToList(cardName: string, listIndex = 0): Promise<void> {
    await this.openAddCardForm(listIndex);
    await this.cardNameInput.fill(cardName);
    await this.submitCardButton.click();

    await expect(this.page.getByText(cardName)).toBeVisible();
  }

  public async addCardsToSameList(cardNames: string[], listIndex = 0): Promise<void> {
    await this.openAddCardForm(listIndex);

    for (const cardName of cardNames) {
      await this.cardNameInput.fill(cardName);
      await this.submitCardButton.click();
      await expect(this.page.getByText(cardName)).toBeVisible();
    }
  }

  public async cancelCardCreation(cardName: string): Promise<void> {
    await this.cardNameInput.fill(cardName);
    await this.page.getByRole('button', { name: 'Cancel', description: 'Cancel', exact: true }).click();

    await expect(this.page.getByText(cardName)).not.toBeVisible();
  }

  public async openCard(cardName: string): Promise<CardView> {
    await this.page.getByRole('button', { name: `${cardName} Edit Card` }).click();

    const cardView = new CardView(this.page);
    await cardView.expectOpen(cardName);
    return cardView;
  }

  public async deleteLastList(): Promise<void> {
    await this.page.getByRole('button', { name: 'Edit List' }).last().click();
    await this.page.getByRole('button', { name: 'Delete List', description: 'Delete List', exact: true }).click();
    await this.page.getByRole('button', { name: 'Delete list', description: 'Delete list', exact: true }).click();
  }

  public async deleteCurrentBoard(): Promise<void> {
    await this.page.getByRole('button', { name: 'Edit Board' }).last().click();
    await this.page.getByRole('button', { name: 'Delete Board' }).click();
    await this.page.getByRole('button', { name: 'Delete Board' }).click();
  }

  public async openProjectSettings(projectName: string): Promise<ProjectSettingsPage> {
    await this.page.getByText(projectName).first().click();
    await this.page.getByRole('button', { name: 'Edit Project' }).last().click();
    await this.page.getByText('Project Settings').click();

    const projectSettingsPage = new ProjectSettingsPage(this.page);
    await projectSettingsPage.expectLoaded();
    return projectSettingsPage;
  }

  public listName(listName: string): Locator {
    return this.page.getByText(listName);
  }

  public cardName(cardName: string): Locator {
    return this.page.getByText(cardName);
  }

  private get cardNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Enter card name... [Ctrl+' });
  }

  private get submitCardButton(): Locator {
    return this.page.getByRole('button', { name: 'Add card' }).last();
  }

  private async openAddCardForm(listIndex: number): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Add card', description: 'Add Card', exact: true })
      .nth(listIndex)
      .click();
  }

  private async selectProject(projectName: string): Promise<void> {
    const selectProjectField = this.page.getByRole('textbox', { name: 'Select project' });
    const projectNameField = this.page.getByRole('textbox', { name: projectName });

    if (await selectProjectField.count()) {
      await selectProjectField.click();
    } else {
      await projectNameField.click();
    }

    await this.page.getByText(projectName).last().click();
  }
}
