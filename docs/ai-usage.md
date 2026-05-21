# AI Usage Log

## Overview

AI was used as a development assistant while improving the Playwright E2E coverage for the 4ga Boards take-home exercise. The main goal was to turn a functional test implementation into a more maintainable test framework structure.

The final implementation was manually reviewed and validated against the locally running application.

## Tools Used

* ChatGPT / Codex for test planning, framework structure, refactoring suggestions, and debugging support.
* Playwright for E2E automation.
* Manual browser exploration for confirming workflows, selectors, and cleanup behavior.
* Docker/local app setup for running the application during validation.

## How AI Was Used

### 1. Test Scope Selection

AI helped narrow the automation scope to one high-value feature area:

* list and card management

This was selected because lists and cards represent a core kanban workflow in the app. The final automated scenarios cover:

* creating a list and card
* creating multiple lists
* adding cards to specific lists
* adding multiple cards to one list
* opening and closing card detail view
* deleting a list
* canceling unsaved list/card creation

### 2. Test Plan and Documentation

AI helped draft and refine the supporting documentation, including:

* the test plan
* the automation scope
* test data strategy
* risks and considerations
* future improvement ideas
* this AI usage summary

The documentation was adjusted after reviewing the final code so it matched the actual implementation.

### 3. Page Object Model Refactor

AI helped refactor the Playwright code into a Page Object Model structure so selectors and page interactions are not scattered throughout the tests.

The final page objects are:

* `LoginPage` for authentication
* `BoardPage` for project, board, list, and card-list interactions
* `CardView` for card detail panel behavior
* `ProjectSettingsPage` for project settings and project deletion

This makes the spec easier to read because the test file can focus on user workflows instead of low-level selectors.

### 4. Playwright Lifecycle Cleanup

AI helped move setup and cleanup responsibilities into Playwright lifecycle hooks.

The final suite uses:

* `beforeEach` for login and initial page setup
* `afterEach` for best-effort board/project cleanup

This replaced ad hoc cleanup inside individual test bodies and made the suite more consistent.

### 5. Environment Configuration

AI helped centralize environment-specific values in `tests/e2e/config/environment.ts`.

The suite can now use environment variables such as:

* `E2E_BASE_URL`
* `PLAYWRIGHT_BASE_URL`
* `E2E_ADMIN_USERNAME`
* `E2E_ADMIN_PASSWORD`

This reduces hardcoding and makes the tests easier to run in different local or CI environments.

### 6. Selector and Stability Review

AI helped review selectors for repeated button names and strict-mode issues. The final tests prefer user-facing locators such as roles, visible names, descriptions, and scoped interactions where possible.

The suite also uses timestamped test data so repeated runs do not collide with previous data.

## Human Review

All AI-generated code and documentation were reviewed before being kept.

Manual decisions included:

* focusing the new coverage on list/card management
* keeping the new spec in the existing `tests/e2e/specs` structure
* preserving existing tests and adding new coverage alongside them
* separating card detail and project settings into their own page objects
* using Playwright hooks for setup and cleanup
* validating the final suite locally

## Final Automation Scope

The final added suite covers:

1. creating a list, adding a card, and opening card detail view
2. creating multiple lists and adding cards to each list
3. adding multiple cards to one list and opening the second card
4. deleting a list from the list menu
5. canceling list and card creation without saving draft items

## Notes

AI was useful for accelerating iteration and identifying framework improvements, but the final implementation was reviewed and validated manually. The most important learning was the difference between writing working tests and designing a Playwright suite that is easier to extend and maintain.
