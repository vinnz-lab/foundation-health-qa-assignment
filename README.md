# Sauce Demo - QA automation assignment

A Playwright and TypeScript project for the Foundation Health QA Lead take-home exercise. It covers login plus sorting, cart and checkout, with additional validation, browser and accessibility checks. The emphasis is on explicit assertions, readable tests and evidence-backed findings.

**Start here:** [execution results](docs/results.md), [test strategy](docs/test-strategy.md), [scenario coverage](docs/scenarios.md), [findings](docs/findings.md).

## Setup

Prerequisites: Node.js 22.12 or newer (Node 24 LTS recommended for reproducibility), npm and Git. The application is hosted at <https://www.saucedemo.com>; no local application server is required. Network access is needed for npm, Playwright browser downloads and the demo site.

Clone the repository, then install and run the checks:

```sh
git clone https://github.com/vinnz-lab/foundation-health-qa-assignment.git
cd foundation-health-qa-assignment
npm ci
npx playwright install chromium firefox webkit
npm run typecheck
npm run format:check
npm test
```

On Linux/CI, install system dependencies too:

```sh
npx playwright install --with-deps chromium firefox webkit
```

On Windows PowerShell, use `npm.cmd` / `npx.cmd` if execution policy blocks the `.ps1` wrappers. A missing browser-library error is an environment blocker, not a product defect. See the recorded local limitations in [results](docs/results.md).

The config honours `HTTPS_PROXY` when present. Set `PLAYWRIGHT_BROWSERS_PATH` if you need a writable custom browser location; use the same value for installation and test execution. These are optional environment settings, not secrets stored in this project. No TLS validation is disabled.

Dependencies are pinned in `package-lock.json`. Use `npm ci` rather than installing arbitrary latest versions.

## Run tests

| Command                                 | Purpose                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| `npm test`                              | Full Chromium suite plus core Firefox and WebKit scenarios                          |
| `npm run test:chromium`                 | Full functional and accessibility suite in Chromium                                 |
| `npm run test:core`                     | Tagged core checks across all three configured engines                              |
| `npm run test:sorting`                  | Default order, all four sort modes, integrity and navigation                        |
| `npm run test:a11y`                     | axe scans and keyboard checks in Chromium                                           |
| `npm run test:exploratory`              | Additional input investigations, proposed business rules and problem/error personas |
| `npm run test:headed`                   | Chromium suite with a visible browser                                               |
| `npm run test:debug -- --grep AUTH-01`  | Step through one login test in the inspector                                        |
| `npx playwright test --project=firefox` | Core checks on Firefox only                                                         |
| `npx playwright test --project=webkit`  | Core checks on WebKit only                                                          |
| `npx playwright test --list`            | Discover the configured test matrix without running it                              |

Individual example: `npx playwright test tests/checkout.spec.ts --project=chromium`.

Exploratory checks use a separate configuration and output folder. **Passing an observation test means evidence was collected, not that the input is acceptable.** Proposed business-rule tests and persona checks deliberately retain their real assertions and can fail. Consult the findings; no failures are suppressed with `test.fail`, blanket skips, disabled axe rules or `continue-on-error`.

## Reports and debugging

```sh
npm run report
npx playwright show-report exploratory-report
npx playwright show-trace path/to/trace.zip
```

The default run writes HTML to `playwright-report/`, JSON and JUnit to `test-results/`, and retains screenshots, videos and traces for failures. Sorting and input investigations also attach structured evidence. Do not open the report's HTML directly if interactive assets fail to load; use `show-report`.

Local retries are zero. CI permits one retry and the report distinguishes flaky outcomes. Two workers keep load modest on the public demo. An individual test times out after 30 seconds; assertions retry for five seconds rather than using fixed sleeps.

## Coverage and design

| Component                | Responsibility                                             |
| ------------------------ | ---------------------------------------------------------- |
| `pages/login-page.ts`    | Login form and successful sign-in                          |
| `pages/shop-page.ts`     | Product selection, cart, sorting controls and logout       |
| `pages/checkout-page.ts` | Customer details, review and completion                    |
| `support/fixtures.ts`    | Per-test page objects and shared product identifiers       |
| `support/money.ts`       | Exact conversion of displayed dollars to integer cents     |
| `tests/*.spec.ts`        | User-facing expectations and regression scenarios          |
| `tests/exploratory/`     | Explicit hypotheses and observations with separate results |
| `playwright*.config.ts`  | Browsers, isolation, reporting and execution policies      |

Page objects encapsulate interactions without building a generic framework. Assertions remain visible in tests; page objects also confirm navigation reached its destination. Each test gets a fresh context and uses UI login. No shared mutable authentication state or dependent test order is required.

Locators use roles and exact accessible names where possible, with the application's `data-test` attributes as an explicit selector contract. Product actions are scoped to their card. Sorting assertions compare the entire sequence and ensure products/prices are preserved. The name oracle uses English, case-insensitive alphabetic order; ambiguous punctuation/collation requirements are documented.

Order tests compare catalogue selections through checkout and calculate subtotal/total independently in integer cents. They check arithmetic consistency, not the correctness of an unspecified tax policy.

All extended checks run on Chromium. `@core` checks run on Firefox and WebKit too. WebKit is an engine check, not certification of real Safari on macOS/iOS. Accessibility combines automated WCAG A/AA scans and keyboard checks; it does not establish complete conformance.

## Accounts and data

The baseline uses the site's publicly listed `standard_user` and `secret_sauce`. `locked_out_user` exercises rejection; exploratory tests use `problem_user` and `error_user`. These are public demo credentials, not a production secret. Customer values are synthetic, with example UK/US postal formats. No personal customer data is needed.

The observed checkout has first name, last name and postal code. There is no email field in this flow, so no email test is fabricated. Country-specific postcode rules and maximum lengths require product clarification. Unicode, apostrophes and hyphens should not be rejected merely for being non-ASCII.

## Continuous integration

`.github/workflows/playwright.yml` installs locked dependencies, checks types/formatting, installs browsers and executes the matrix on Ubuntu. Reports are uploaded even after failures. The optional exploratory job is selected through manual workflow dispatch. CI has read-only repository permissions and needs no application credentials or paid service.

The first GitHub Actions run passed all 60 regression checks (36 Chromium, 12 Firefox, 12 WebKit). See [results](docs/results.md) for the tested commit, report link and local limitations.

## AI usage

ChatGPT Work / Codex, using GPT-6 Astra for implementation, assisted with scenario planning, code generation, browser inspection, execution, diagnosis and documentation. Earlier discussion refined the scope with the candidate: sorting, meaningful data, cross-browser coverage and accessibility were specifically raised or agreed by the candidate.

The assistant executed the commands and investigated the reported results. Candidate review and ability to explain the code must be established during the walkthrough; this README does not claim the candidate independently authored or reviewed every line.

No custom AI skill, subagent or Playwright agent was created or invoked to generate/run these tests. There is no AI dependency at test runtime. ChatGPT's file-transfer capability may be used to deliver the project; it is not part of the testing framework. To use an assistant for future changes, follow [AI review instructions](docs/ai-review.md), then run type checks and the affected tests yourself. The recorded observations and reports, not an AI statement, are the evidence.

## To Do

| Priority | Improvement                                                                  | Why                                                                     |
| -------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| P0       | Candidate walkthrough and review of CI evidence                              | Establish understanding and verify the reviewer setup before submission |
| P1       | Agree customer data rules, supported countries and empty-order behaviour     | Turn exploratory hypotheses into reliable acceptance criteria           |
| P1       | Resolve and retest confirmed product/accessibility findings                  | Preserve correct expectations and link failures to tracked issues       |
| P1       | Maintain cross-browser execution in the verified Ubuntu CI environment       | Obtain real execution evidence rather than assume compatibility         |
| P1       | Manual screen-reader, focus visibility, error-announcement and reflow review | Automated accessibility cannot cover the full user experience           |
| P2       | Broader browsers/devices and responsive layouts                              | Current engine/core coverage is intentionally limited                   |
| P2       | Dynamic catalogue, product detail and persistence across session boundaries  | Extend coverage beyond the selected stable inventory journey            |
| P2       | Agree performance budgets before testing `performance_glitch_user`           | Avoid arbitrary timing thresholds and machine-dependent failures        |
| P2       | Visual baselines and `visual_user` investigation                             | Need reviewed references and a stable rendering environment             |
| P2       | Backend/order validation and duplicate-submission checks                     | UI confirmation alone cannot prove order persistence or uniqueness      |
| P3       | Repeat-run stability metrics, dependency updates and richer CI trends        | Maintain the suite as the app and team evolve                           |

## References

- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright CI setup](https://playwright.dev/docs/ci-intro)
- [Sauce Demo](https://www.saucedemo.com/)
