# Test strategy

## Purpose and priorities

Demonstrate a maintainable automation project for the Foundation Health QA Lead assignment using Sauce Demo. The core submission is a working login and purchase journey with meaningful assertions. Extended checks investigate data quality, sorting, access, accessibility and browser compatibility.

| Priority | Risk                                                      | Evidence                                                                                   |
| -------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| P0       | A legitimate customer cannot sign in or finish a purchase | Login, cart, multi-item checkout and confirmation checks                                   |
| P0       | Wrong items or totals reach checkout                      | Compare chosen catalogue products through cart and order summary; calculate money in cents |
| P1       | Access remains after logout                               | Direct navigation to inventory and other protected routes in a new or logged-out session   |
| P1       | Sort controls mislead shoppers                            | Check every name/price in sequence, selection changes and inventory integrity              |
| P1       | Invalid customer details are accepted                     | Missing/whitespace fields, recovery, exploratory value classes                             |
| P1       | Customers cannot operate key controls                     | Keyboard checks and axe scans of principal screens                                         |
| P2       | The journey behaves differently by engine                 | Core scenarios run on Chromium, Firefox and WebKit                                         |

## Test oracles and assumptions

- Assert user-visible behaviour. A navigation alone is not proof that a purchase, login or cart operation succeeded.
- A fresh Playwright browser context isolates each test. Login uses the UI; tests do not depend on the order of execution or a shared cart.
- Use `standard_user` for the baseline and `locked_out_user` for a defined rejection. Other demo personas are exploratory targets; do not silently substitute one persona for another.
- Name ordering requires an explicit collation rule. Compare the observed order with both code-point and human alphabetic interpretations before declaring a defect. Record the product-owner question rather than infer a contractual requirement from implementation.
- Currency assertions use integer cents. Total consistency does not establish that a tax rate is legally or commercially correct; no tax specification is supplied.
- Required fields should reject empty input. Whitespace rejection and empty-cart prevention are proposed business expectations and must be labelled as such where no product specification exists.
- Names are not limited to ASCII letters. Apostrophes, hyphens and Unicode are legitimate. Postcode validation depends on supported countries, which this assignment does not specify.
- No email validation test will be invented for an application without an email field.

## Scope and execution

The Chromium suite covers functional regression and accessibility checks. A tagged core subset runs on Firefox and WebKit. Browser engines are not equivalent to testing every branded browser, mobile device or real Safari installation.

Exploratory checks have their own command and report. A successful observation test only means its evidence was collected; it does not certify the observed input as valid. Proposed business-rule checks retain their assertions and may fail. The main suite also retains genuine failures; no blanket skips, expected failures or disabled accessibility rules are used to produce green results.

Two workers limit load on the public demo. Local retries are disabled to expose failures; CI retries once and reports flaky outcomes. No fixed sleeps, forced clicks or application responses mocked to make assertions pass.

## Accessibility scope

Use axe for automatically detectable WCAG A/AA issues on login, inventory, cart and checkout. Supplement with keyboard login/checkout, focus evidence and field/error semantics. Automated results are not a WCAG conformance certificate. Screen-reader usability, visual focus assessment, zoom, reflow and disabled-user research need further work.

## Defects and release judgement

For each failure, distinguish test implementation error, environment problem, observed product issue and ambiguous requirement. Capture account, browser, steps, expected/actual results and supporting attachments. Re-run only affected cases after fixes, then run the final agreed matrix.

The submission can be technically sound while revealing demo-app defects. Report both suite health and product quality; do not claim release readiness while unresolved blockers exist. Production sign-off would require agreed acceptance criteria, stakeholder ownership of residual risks and broader coverage.

## Beyond this demo: AI product testing

Foundation Health's AI workflows would need a separate evaluation layer: versioned representative datasets, human-reviewed scoring rubrics, repeat runs for variable output, tool-call correctness, safe failure paths, approval boundaries and regression comparisons between model/prompt versions. Keep deterministic workflow checks alongside probabilistic quality evaluations. This document proposes that approach; the Sauce Demo project does not claim to implement an LLM evaluation framework.
