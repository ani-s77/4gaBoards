# AI Usage Log

## Overview

AI was used to assist with planning, implementation, debugging, and cleanup of the Playwright E2E test suite for the 4ga Boards take-home exercise.

The final test cases and code were manually reviewed and validated against the locally running application.

## Tools Used

- ChatGPT for test planning, scope selection, code structure, and debugging assistance.
- Playwright Codegen for initial workflow recording and locator discovery.
- Manual inspection of the running app for validating user flows and selectors.
- Docker Compose for local application setup.

## AI-Assisted Activities

### 1. Test Scope Selection

AI was used to help identify high-value E2E workflows for a kanban-style application.

The selected feature area was:

- List and card management

The selected automated scenarios were:

- Create a list and add a card.
- Create multiple lists and add cards to each list.
- Add multiple cards to one list and open a card detail view.
- Delete a list from the list menu.
- Cancel draft list/card creation.

### 2. Test Plan Drafting

AI was used to draft and refine the test plan structure, including:

- Objective
- Feature under test
- Test data strategy
- Automated test cases
- Future coverage
- Risks and considerations
- Out-of-scope areas

The final test plan was reviewed and adjusted based on manual exploration of the app.

### 3. Playwright Code Structuring

Playwright Codegen was used to record initial browser flows.

AI was then used to help convert raw generated code into focused Page Object Model classes, including:

- `LoginPage` for authentication.
- `BoardPage` for board, list, and card-list workflows.
- `CardView` for the card detail panel.
- `ProjectSettingsPage` for project settings and project deletion.

This made the tests easier to read, reduced duplicated setup steps, and improved maintainability.

AI also helped centralize environment-specific values so the suite can run against different local or ephemeral environments using variables such as `E2E_BASE_URL`, `PLAYWRIGHT_BASE_URL`, `E2E_ADMIN_USERNAME`, and `E2E_ADMIN_PASSWORD`.

### 4. Selector Stabilization

AI helped debug strict-mode locator failures caused by repeated button names such as:

- `Add Board`
- `Add card`
- `Delete List`
- `Delete list`
- `Cancel`

The final tests avoid dynamic numeric IDs and prefer more stable selectors based on roles, visible names, descriptions, and scoped interactions.

### 5. Test Isolation and Cleanup

AI was used to improve the test design so each test:

- Creates a unique project and board.
- Uses timestamped test data.
- Runs independently.
- Performs cleanup in a Playwright `afterEach` hook.

This reduces test data collisions and makes repeated local runs more reliable.

## Human Review

All generated code and suggestions were manually reviewed.

Manual decisions included:

- Prioritizing stable E2E flows over brittle broad coverage.
- Creating a new project per test instead of relying on the default seeded project.
- Avoiding hardcoded project IDs.
- Keeping destructive actions scoped to test-created data.
- Verifying the final suite passes locally before submission.

## Final Automation Scope

The final automated suite covers:

1. Creating a list and card.
2. Opening and closing a card detail view.
3. Creating multiple lists.
4. Adding cards to specific lists.
5. Adding multiple cards to the same list.
6. Deleting a list.
7. Canceling unsaved list/card creation.
8. Cleaning up test-created boards and projects.

## Notes

AI was used as a productivity and debugging aid, but the final implementation was validated through manual local test execution.
