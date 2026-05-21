# Follow-Up Improvements

## Why I Made This Branch

I created this branch after receiving constructive feedback on my Snorkel take-home assignment. The feedback highlighted a clear gap in my understanding of Playwright-specific framework structure and test infrastructure development.

As I continue growing as an SDET, I want to move beyond simply adding tests to existing frameworks and become stronger at designing automation with maintainability and scalability in mind. My original submission focused more on getting functional coverage working, but I understand that a stronger test framework should also be easy to extend, configure, and maintain as coverage grows.

The key points of feedback were:

* Page Object Model usage
* Playwright-native setup and cleanup patterns
* Reduced hardcoding and better environment configuration

Before this assignment, most of my automation experience was either backend/server-side testing with PyTest or mobile automation in established XCUITest/Espresso frameworks. Playwright was newer to me, especially from the perspective of building a scalable framework structure from scratch.

I wanted to use this branch for two main reasons:

* To directly address the feedback with concrete improvements and show iteration.
* To learn Playwright more deeply, broaden my automation skill set, and continue becoming a stronger SDET.

I understand that the original process may have already moved forward, but I still wanted to make these improvements because the feedback was useful and relevant to my growth. I also hope this branch can show continued interest in Snorkel and potentially support consideration for future opportunities as I keep improving.

## Key Changes

### Page Object Model

The updated version introduces a Page Object Model structure to separate test intent from page implementation details.

Instead of keeping selectors and UI interactions directly inside test cases, page-level behavior is moved into reusable page objects. This makes the tests easier to read and maintain.

For example, tests can focus on user intent:

```ts
await boardPage.createCard("Test Card");
await boardPage.expectCardVisible("Test Card");
```

rather than repeating low-level selectors and interactions throughout the suite.

This makes the framework more scalable because future UI selector changes can be handled in one place instead of requiring updates across multiple test files.

### Improved Lifecycle Management

The updated suite uses Playwright lifecycle hooks such as `beforeEach` and `afterEach` to manage setup and cleanup more consistently.

This is cleaner than manually handling setup or cleanup logic inside individual tests, and it makes the test flow more predictable as the suite grows.

### Less Hardcoding

Another improvement was moving away from hardcoded environment assumptions.

A test suite should be able to run locally, in CI, or against a different environment without needing the test code itself to be edited. This version is structured more with that in mind.

### More Scalable Structure

The updated version separates concerns more clearly:

* tests describe the behavior being validated
* page objects own page interactions
* configuration belongs in config
* setup/cleanup belongs in lifecycle hooks
* documentation explains the reasoning behind the test design

That makes the framework easier to extend if more coverage is added later.

## Why This Is Better Than the Original Version

The original version showed that I could write Playwright tests for product flows.

This version is more focused on showing that I understand what a maintainable Playwright framework should become.

The main difference is scalability.

In the original version, adding more tests would likely mean more duplicated selectors, more repeated setup, and more places to update when the UI changed.

In this version, future tests can reuse the same page objects and structure. That makes the suite easier to grow and easier to maintain.

## What I Learned

The biggest lesson was that writing tests and building a test framework are not the same thing.

I have worked with automation before, but Playwright has its own best practices. This feedback made that clearer to me.

The main things I learned were:

* Page Object Model matters once a suite starts growing.
* Tests should be readable at the user-flow level.
* Selectors should not be scattered everywhere.
* Setup and cleanup should use the framework instead of being patched into each test.
* Environment config matters if the tests are meant to run outside one local machine.
* AI tools are useful, but only if I understand and review what they produce.

## Future Improvements

If I kept going, the next things I would add are:

* API-based setup and cleanup if the app supports it
* CI integration with Playwright reports
* traces, screenshots, and videos on failure
* smoke vs regression tags
* accessibility checks
* more edge-case coverage
* clearer test data management

## Final Note

I understand why the original version fell short of the infrastructure bar. I also think the feedback was useful because it pointed to a real gap I could improve quickly.

This branch is my attempt to show that I took the feedback seriously, learned from it, and improved the framework in a way that is more maintainable and scalable over time.
