import { test, expect, Page } from '@playwright/test';

const USERNAME = 'demo';
const PASSWORD = 'demo';

async function login(page: Page) {
  await page.goto('http://localhost:3000/login');

  await page.locator('input[name="emailOrUsername"]').fill(USERNAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('button', { name: 'Add Board' }).first()).toBeVisible();
}

async function createProject(page: Page, projectName: string) {
  await page.getByRole('button', { name: 'Add Project' }).first().click();
  await page.getByRole('textbox', { name: 'Enter project name...' }).fill(projectName);
  await page.getByRole('dialog').getByRole('button', { name: 'Add Project' }).click();

  await expect(page.getByText(projectName).first()).toBeVisible();
}

async function createBoard(page: Page, boardName: string, projectName: string) {
  await page.getByRole('button', { name: 'Add Board' }).first().click();

  await page.getByRole('textbox', { name: 'Enter board name...' }).fill(boardName);

  // The project dropdown sometimes has accessible name "Select project"
  // and sometimes the currently selected project name.
  const selectProjectField = page.getByRole('textbox', { name: 'Select project' });
  const projectNameField = page.getByRole('textbox', { name: projectName });

  if (await selectProjectField.count()) {
    await selectProjectField.click();
  } else {
    await projectNameField.click();
  }

  await page.getByText(projectName).last().click();

  await page.getByRole('dialog').getByRole('button', { name: 'Add Board' }).click();

  await expect(page.getByText(boardName).first()).toBeVisible();
}

async function createList(page: Page, listName: string) {
  await page.getByRole('button', { name: 'Add list' }).click();
  await page.getByRole('textbox', { name: 'Enter list name...' }).fill(listName);
  await page.getByRole('button', { name: 'Add list' }).click();

  await expect(page.getByText(listName)).toBeVisible();
}

async function addCardToList(page: Page, cardName: string, listIndex = 0) {
  await page.getByRole('button', { name: 'Add card', description: 'Add Card', exact: true }).nth(listIndex).click();

  await page.getByRole('textbox', { name: 'Enter card name... [Ctrl+' }).fill(cardName);

  // Use last() because both the list-level button and form-submit button can match "Add card".
  await page.getByRole('button', { name: 'Add card' }).last().click();

  await expect(page.getByText(cardName)).toBeVisible();
}

async function addCardsToSameList(page: Page, cardNames: string[], listIndex = 0) {
  await page.getByRole('button', { name: 'Add card', description: 'Add Card', exact: true }).nth(listIndex).click();

  for (const cardName of cardNames) {
    await page.getByRole('textbox', { name: 'Enter card name... [Ctrl+' }).fill(cardName);
    await page.getByRole('button', { name: 'Add card' }).last().click();
    await expect(page.getByText(cardName)).toBeVisible();
  }
}

async function openCard(page: Page, cardName: string) {
  await page.getByRole('button', { name: `${cardName} Edit Card` }).click();

  await expect(page.getByRole('button', { name: 'Close Card' })).toBeVisible();
  await expect(page.getByText(cardName).first()).toBeVisible();
}

async function closeCard(page: Page) {
  await page.getByRole('button', { name: 'Close Card' }).click();
}

async function deleteCurrentBoard(page: Page) {
  try {
    // Use the last Edit Board button because that is usually the board-page action,
    // not a sidebar/context-menu action.
    await page.getByRole('button', { name: 'Edit Board' }).last().click();
    await page.getByRole('button', { name: 'Delete Board' }).click();
    await page.getByRole('button', { name: 'Delete Board' }).click();
  } catch {
    // Cleanup is best-effort so cleanup failure does not hide the real test failure.
  }
}

async function deleteProject(page: Page, projectName: string) {
  try {
    await page.getByText(projectName).first().click();
    await page.getByRole('button', { name: 'Edit Project' }).last().click();
    await page.getByText('Project Settings').click();
    await page.getByRole('button', { name: 'Delete Project' }).click();
    await page.getByRole('button', { name: 'Delete project', description: 'Delete project', exact: true }).click();
  } catch {
    // Project cleanup is best-effort.
  }
}

test.describe('List and card management', () => {
  test('user can create a list, add a card, and open the card detail view', async ({ page }) => {
    const timestamp = Date.now();

    const projectName = `QE Project ${timestamp}`;
    const boardName = `QE Release Readiness Board ${timestamp}`;
    const listName = `Pre-Launch QA ${timestamp}`;
    const cardName = `Validate signup flow ${timestamp}`;

    await login(page);

    try {
      await createProject(page, projectName);
      await createBoard(page, boardName, projectName);

      await createList(page, listName);
      await addCardToList(page, cardName);
      await openCard(page, cardName);
      await closeCard(page);

      await expect(page.getByText(listName)).toBeVisible();
      await expect(page.getByText(cardName)).toBeVisible();
    } finally {
      await deleteCurrentBoard(page);
      await deleteProject(page, projectName);
    }
  });

  test('user can create multiple lists and add cards to each list', async ({ page }) => {
    const timestamp = Date.now();

    const projectName = `QE Project ${timestamp}`;
    const boardName = `QE Multi List Board ${timestamp}`;

    const firstListName = `Pre-Launch QA ${timestamp}`;
    const firstCardName = `Validate signup flow ${timestamp}`;

    const secondListName = `Post-Launch Monitoring ${timestamp}`;
    const secondCardName = `Monitor error dashboard ${timestamp}`;

    await login(page);

    try {
      await createProject(page, projectName);
      await createBoard(page, boardName, projectName);

      await createList(page, firstListName);
      await addCardToList(page, firstCardName, 0);

      await createList(page, secondListName);
      await addCardToList(page, secondCardName, 1);

      await expect(page.getByText(firstListName)).toBeVisible();
      await expect(page.getByText(firstCardName)).toBeVisible();
      await expect(page.getByText(secondListName)).toBeVisible();
      await expect(page.getByText(secondCardName)).toBeVisible();

      // Open and close the card in the second list.
      await openCard(page, secondCardName);
      await closeCard(page);

      // Confirm the second-list card is still visible on the board after closing detail view.
      await expect(page.getByText(secondCardName)).toBeVisible();
    } finally {
      await deleteCurrentBoard(page);
      await deleteProject(page, projectName);
    }
  });

  test('user can add multiple cards to one list and open the second card', async ({ page }) => {
    const timestamp = Date.now();

    const projectName = `QE Project ${timestamp}`;
    const boardName = `QE Multiple Cards Board ${timestamp}`;
    const listName = `Regression Test Queue ${timestamp}`;

    const firstCardName = `Validate login flow ${timestamp}`;
    const secondCardName = `Verify checkout events ${timestamp}`;
    const thirdCardName = `Review error handling ${timestamp}`;

    await login(page);

    try {
      await createProject(page, projectName);
      await createBoard(page, boardName, projectName);

      await createList(page, listName);

      await addCardsToSameList(page, [firstCardName, secondCardName, thirdCardName]);

      await expect(page.getByText(firstCardName)).toBeVisible();
      await expect(page.getByText(secondCardName)).toBeVisible();
      await expect(page.getByText(thirdCardName)).toBeVisible();

      await openCard(page, secondCardName);
      await closeCard(page);

      await expect(page.getByText(secondCardName)).toBeVisible();
    } finally {
      await deleteCurrentBoard(page);
      await deleteProject(page, projectName);
    }
  });

  test('user can delete a list from the list menu', async ({ page }) => {
    const timestamp = Date.now();

    const projectName = `QE Project ${timestamp}`;
    const boardName = `QE Delete List Board ${timestamp}`;

    const firstListName = `Active QA List ${timestamp}`;
    const firstCardName = `Validate login regression ${timestamp}`;

    const secondListName = `List To Delete ${timestamp}`;
    const secondCardName = `Temporary QA task ${timestamp}`;

    await login(page);

    try {
      await createProject(page, projectName);
      await createBoard(page, boardName, projectName);

      await createList(page, firstListName);
      await addCardToList(page, firstCardName, 0);

      await createList(page, secondListName);
      await addCardToList(page, secondCardName, 1);

      await page.getByRole('button', { name: 'Edit List' }).last().click();
      await page.getByRole('button', { name: 'Delete List', description: 'Delete List', exact: true }).click();
      await page.getByRole('button', { name: 'Delete list', description: 'Delete list', exact: true }).click();

      await expect(page.getByText(firstListName)).toBeVisible();
      await expect(page.getByText(firstCardName)).toBeVisible();

      await expect(page.getByText(secondListName)).not.toBeVisible();
      await expect(page.getByText(secondCardName)).not.toBeVisible();
    } finally {
      await deleteCurrentBoard(page);
      await deleteProject(page, projectName);
    }
  });

  test('user can cancel list and card creation without saving draft items', async ({ page }) => {
    const timestamp = Date.now();

    const projectName = `QE Project ${timestamp}`;
    const boardName = `QE Cancel Flow Board ${timestamp}`;

    const canceledListName = `Canceled List ${timestamp}`;
    const savedListName = `Saved QA List ${timestamp}`;
    const savedCardName = `Saved QA Card ${timestamp}`;
    const canceledCardName = `Canceled QA Card ${timestamp}`;

    await login(page);

    try {
      await createProject(page, projectName);
      await createBoard(page, boardName, projectName);

      // Cancel list creation.
      await page.getByRole('button', { name: 'Add list' }).click();
      await page.getByRole('textbox', { name: 'Enter list name...' }).fill(canceledListName);
      await page.getByRole('button', { name: 'Cancel', description: 'Cancel', exact: true }).click();

      await expect(page.getByText(canceledListName)).not.toBeVisible();

      // Create a real list.
      await createList(page, savedListName);

      // Add a real card.
      await addCardToList(page, savedCardName);

      // Start a second card and cancel it.
      await page.getByRole('textbox', { name: 'Enter card name... [Ctrl+' }).fill(canceledCardName);

      await page.getByRole('button', { name: 'Cancel', description: 'Cancel', exact: true }).click();

      await expect(page.getByText(savedListName)).toBeVisible();
      await expect(page.getByText(savedCardName)).toBeVisible();
      await expect(page.getByText(canceledCardName)).not.toBeVisible();
    } finally {
      await deleteCurrentBoard(page);
      await deleteProject(page, projectName);
    }
  });
});
