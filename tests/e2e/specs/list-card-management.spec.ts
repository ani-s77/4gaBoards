import { test, expect } from '@playwright/test';
import { BoardPage } from '../pageObjects/BoardPage';
import { LoginPage } from '../pageObjects/LoginPage';

test.describe('List and card management', () => {
  let boardPage: BoardPage;
  let projectName: string;
  let boardCreated: boolean;
  let projectCreated: boolean;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    boardPage = new BoardPage(page);
    boardCreated = false;
    projectCreated = false;

    await loginPage.navigateToLoginPage();
    await loginPage.loginAsAdmin();
    await boardPage.expectLoaded();
  });

  test.afterEach(async () => {
    if (boardCreated) {
      await boardPage.deleteCurrentBoard().catch((error: unknown) => {
        console.warn('Board cleanup failed:', error);
      });
    }

    if (projectCreated) {
      await boardPage
        .openProjectSettings(projectName)
        .then((projectSettingsPage) => projectSettingsPage.deleteProject())
        .catch((error: unknown) => {
          console.warn(`Project cleanup failed for ${projectName}:`, error);
        });
    }
  });

  test('user can create a list, add a card, and open the card detail view', async () => {
    const timestamp = Date.now();

    projectName = `QE Project ${timestamp}`;
    const boardName = `QE Release Readiness Board ${timestamp}`;
    const listName = `Pre-Launch QA ${timestamp}`;
    const cardName = `Validate signup flow ${timestamp}`;

    await createProjectAndBoard(boardName);
    await boardPage.createList(listName);
    await boardPage.addCardToList(cardName);
    const cardView = await boardPage.openCard(cardName);
    await cardView.close();

    await expect(boardPage.listName(listName)).toBeVisible();
    await expect(boardPage.cardName(cardName)).toBeVisible();
  });

  test('user can create multiple lists and add cards to each list', async () => {
    const timestamp = Date.now();

    projectName = `QE Project ${timestamp}`;
    const boardName = `QE Multi List Board ${timestamp}`;

    const firstListName = `Pre-Launch QA ${timestamp}`;
    const firstCardName = `Validate signup flow ${timestamp}`;

    const secondListName = `Post-Launch Monitoring ${timestamp}`;
    const secondCardName = `Monitor error dashboard ${timestamp}`;

    await createProjectAndBoard(boardName);

    await boardPage.createList(firstListName);
    await boardPage.addCardToList(firstCardName, 0);

    await boardPage.createList(secondListName);
    await boardPage.addCardToList(secondCardName, 1);

    await expect(boardPage.listName(firstListName)).toBeVisible();
    await expect(boardPage.cardName(firstCardName)).toBeVisible();
    await expect(boardPage.listName(secondListName)).toBeVisible();
    await expect(boardPage.cardName(secondCardName)).toBeVisible();

    const cardView = await boardPage.openCard(secondCardName);
    await cardView.close();

    await expect(boardPage.cardName(secondCardName)).toBeVisible();
  });

  test('user can add multiple cards to one list and open the second card', async () => {
    const timestamp = Date.now();

    projectName = `QE Project ${timestamp}`;
    const boardName = `QE Multiple Cards Board ${timestamp}`;
    const listName = `Regression Test Queue ${timestamp}`;

    const firstCardName = `Validate login flow ${timestamp}`;
    const secondCardName = `Verify checkout events ${timestamp}`;
    const thirdCardName = `Review error handling ${timestamp}`;

    await createProjectAndBoard(boardName);
    await boardPage.createList(listName);
    await boardPage.addCardsToSameList([firstCardName, secondCardName, thirdCardName]);

    await expect(boardPage.cardName(firstCardName)).toBeVisible();
    await expect(boardPage.cardName(secondCardName)).toBeVisible();
    await expect(boardPage.cardName(thirdCardName)).toBeVisible();

    const cardView = await boardPage.openCard(secondCardName);
    await cardView.close();

    await expect(boardPage.cardName(secondCardName)).toBeVisible();
  });

  test('user can delete a list from the list menu', async () => {
    const timestamp = Date.now();

    projectName = `QE Project ${timestamp}`;
    const boardName = `QE Delete List Board ${timestamp}`;

    const firstListName = `Active QA List ${timestamp}`;
    const firstCardName = `Validate login regression ${timestamp}`;

    const secondListName = `List To Delete ${timestamp}`;
    const secondCardName = `Temporary QA task ${timestamp}`;

    await createProjectAndBoard(boardName);

    await boardPage.createList(firstListName);
    await boardPage.addCardToList(firstCardName, 0);

    await boardPage.createList(secondListName);
    await boardPage.addCardToList(secondCardName, 1);
    await boardPage.deleteLastList();

    await expect(boardPage.listName(firstListName)).toBeVisible();
    await expect(boardPage.cardName(firstCardName)).toBeVisible();

    await expect(boardPage.listName(secondListName)).not.toBeVisible();
    await expect(boardPage.cardName(secondCardName)).not.toBeVisible();
  });

  test('user can cancel list and card creation without saving draft items', async () => {
    const timestamp = Date.now();

    projectName = `QE Project ${timestamp}`;
    const boardName = `QE Cancel Flow Board ${timestamp}`;

    const canceledListName = `Canceled List ${timestamp}`;
    const savedListName = `Saved QA List ${timestamp}`;
    const savedCardName = `Saved QA Card ${timestamp}`;
    const canceledCardName = `Canceled QA Card ${timestamp}`;

    await createProjectAndBoard(boardName);

    await boardPage.cancelListCreation(canceledListName);
    await boardPage.createList(savedListName);
    await boardPage.addCardToList(savedCardName);
    await boardPage.cancelCardCreation(canceledCardName);

    await expect(boardPage.listName(savedListName)).toBeVisible();
    await expect(boardPage.cardName(savedCardName)).toBeVisible();
    await expect(boardPage.cardName(canceledCardName)).not.toBeVisible();
  });

  async function createProjectAndBoard(boardName: string): Promise<void> {
    await boardPage.createProject(projectName);
    projectCreated = true;

    await boardPage.createBoard(boardName, projectName);
    boardCreated = true;
  }
});
