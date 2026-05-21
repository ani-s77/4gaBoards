# Test Plan: List and Card Management

## Objective

The goal of this test plan is to validate the core list and card management workflows in 4ga Boards, a kanban-style project management application.

This feature area was selected because lists and cards represent the primary user workflow of the product: organizing work into boards, grouping related tasks into lists, and managing individual task cards.

## Application Under Test

- Application: 4ga Boards
- Test framework: Playwright
- Local environment: Docker Compose
- Browser target: Chromium
- User: demo/demo

## Feature Under Test

### List and Card Management

This feature includes:

- Creating projects and boards
- Creating lists inside a board
- Adding cards to lists
- Opening card detail views
- Creating multiple lists
- Creating multiple cards
- Deleting lists
- Canceling draft list/card creation

## Test Data Strategy

Each automated test creates unique test data using timestamped names, such as:

- `QE Project <timestamp>`
- `QE Release Readiness Board <timestamp>`
- `Pre-Launch QA <timestamp>`
- `Validate signup flow <timestamp>`

This prevents collisions between test runs and makes test-created data easy to identify if cleanup fails.

Each test creates its own project and board, runs the test workflow, and then performs best-effort cleanup in a Playwright `afterEach` hook.

## Automated Test Cases

### TC-001: Create a list, add a card, and open card detail view

**Priority:** High  
**Type:** Positive / Core workflow  
**Automated:** Yes

**Steps:**

1. Log in as the demo user.
2. Create a new project.
3. Create a new board under that project.
4. Add a list named `Pre-Launch QA`.
5. Add a card named `Validate signup flow`.
6. Open the card detail view.
7. Close the card detail view.
8. Verify the list and card are still visible.
9. Delete the board and project.

**Expected Result:**

- The user can create a list.
- The user can add a card to the list.
- The user can open and close the card detail view.
- The list and card remain visible after closing the card.

---

### TC-002: Create multiple lists and add cards to each list

**Priority:** High  
**Type:** Positive / Core workflow  
**Automated:** Yes

**Steps:**

1. Log in as the demo user.
2. Create a new project.
3. Create a new board.
4. Create a first list named `Pre-Launch QA`.
5. Add a card named `Validate signup flow`.
6. Create a second list named `Post-Launch Monitoring`.
7. Add a card named `Monitor error dashboard` to the second list.
8. Open and close the card in the second list.
9. Verify both lists and both cards are visible.
10. Delete the board and project.

**Expected Result:**

- Multiple lists can be created on the same board.
- Cards can be added to specific lists.
- A card in the second list can be opened and closed.
- All expected list/card content remains visible.

---

### TC-003: Add multiple cards to one list and open the second card

**Priority:** High  
**Type:** Positive / Core workflow  
**Automated:** Yes

**Steps:**

1. Log in as the demo user.
2. Create a new project.
3. Create a new board.
4. Create a list named `Regression Test Queue`.
5. Add three cards:
   - `Validate login flow`
   - `Verify checkout events`
   - `Review error handling`
6. Open the second card.
7. Close the card detail view.
8. Verify all cards are visible.
9. Delete the board and project.

**Expected Result:**

- Multiple cards can be added to the same list.
- The selected card can be opened in detail view.
- Closing the card returns the user to the board without losing card data.

---

### TC-004: Delete a list from the list menu

**Priority:** Medium  
**Type:** Destructive workflow  
**Automated:** Yes

**Steps:**

1. Log in as the demo user.
2. Create a new project.
3. Create a new board.
4. Create an active list with a card.
5. Create a second list with a card.
6. Open the second list's menu.
7. Choose `Delete List`.
8. Confirm list deletion.
9. Verify the first list and card remain visible.
10. Verify the deleted list and card are no longer visible.
11. Delete the board and project.

**Expected Result:**

- The selected list is deleted.
- Cards in the deleted list are removed from the board.
- Other lists and cards are unaffected.

---

### TC-005: Cancel list and card creation without saving draft items

**Priority:** Medium  
**Type:** Negative / Cancel flow  
**Automated:** Yes

**Steps:**

1. Log in as the demo user.
2. Create a new project.
3. Create a new board.
4. Start creating a list.
5. Enter a list name.
6. Cancel the list creation.
7. Verify the canceled list is not visible.
8. Create a real list.
9. Add a real card.
10. Start creating a second card.
11. Enter a card name.
12. Cancel the card creation.
13. Verify the real list and card remain visible.
14. Verify the canceled card is not visible.
15. Delete the board and project.

**Expected Result:**

- Canceling list creation does not create a draft list.
- Canceling card creation does not create a draft card.
- Existing valid list/card data remains intact.

## Additional Test Cases for Future Coverage

The following cases are valuable but were not prioritized for the initial automated suite:

### TC-006: Rename a list from the list menu

**Priority:** Medium

Verify that a user can open the list menu, rename a list, and preserve existing cards under the renamed list.

### TC-007: Fold and unfold a list

**Priority:** Medium

Verify that a user can collapse a list, confirm cards are hidden, expand the list again, and confirm cards are restored.

### TC-008: Add a card from the list context menu

**Priority:** Medium

Verify that the list-level context menu can be used to start card creation and that the card is added to the intended list.

### TC-009: Check list activity

**Priority:** Low/Medium

Verify that the list activity action opens the expected activity view or panel.

### TC-010: Empty card/list validation

**Priority:** Medium

Verify that the app prevents empty list or card creation, or handles empty submissions gracefully.

## Automation Strategy

The automated suite focuses on robust user-visible behavior rather than implementation details.

Playwright strategy:

- Prefer role-based locators where possible.
- Use visible text assertions to validate user outcomes.
- Use timestamped test data to avoid collisions.
- Create isolated project/board state per test.
- Clean up board/project data in a Playwright `afterEach` hook.
- Avoid fixed waits.
- Avoid dynamic numeric IDs.
- Use Chromium as the initial browser target.

## Risks and Considerations

- Some UI controls have repeated accessible names, so tests use more specific locators such as `description`, `first()`, `last()`, or list indexes where needed.
- Cleanup is best-effort so cleanup failures do not mask the actual test failure.
- Context menu and drag/drop interactions can be more brittle, so this initial suite prioritizes stable list/card workflows.
- Additional cross-browser testing can be added after the core Chromium workflow is stable.

## Out of Scope for Initial Automation

- Multi-user collaboration
- Permissions and roles
- Cross-browser coverage beyond Chromium
- Visual regression testing
- API/database-level validation
- Email or notification workflows
- Full activity history validation
