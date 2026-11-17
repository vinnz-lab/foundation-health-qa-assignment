# Findings and requirement questions

Observed on 17 November 2026 against `https://www.saucedemo.com`, using Playwright Chromium. These findings describe the public demo, not Foundation Health's production product. The deliberately unusual demo personas may be designed to expose faults; their behaviour must not be generalised to `standard_user`.

## F-01 - Whitespace satisfies required customer fields

**Classification:** observed validation gap against a proposed business rule; acceptance criteria need confirmation. **Suggested priority:** P1 for a real checkout.

**Reproduce:** sign in as `standard_user`, add Sauce Labs Backpack, open Cart > Checkout. Enter three spaces in First Name, with `Tester` and `SW1A 1AA` in the other fields. Continue. Repeat with Last Name and Postal Code as the whitespace-only field, keeping the other two valid.

**Expected proposal:** trim surrounding whitespace and reject a value that is empty after trimming, identifying the field without losing the other entries.

**Actual:** each of the three variations progresses to Checkout: Overview without a validation error. Ordinary empty-string inputs are rejected correctly in the regression suite.

**Evidence:** three `DATA-01` failures, with screenshots, videos and traces in the exploratory report. Keep these assertions intact until requirements or application behaviour change.

## F-02 - An empty cart can reach order confirmation

**Classification:** observed behaviour against proposed empty-order prevention. **Suggested priority:** P1 for a real shop; clarify whether any zero-item orders are intentionally supported.

**Reproduce:** sign in as `standard_user` in a new session. Open the empty cart, choose Checkout, enter `Alex`, `Tester`, `SW1A 1AA`, Continue, then Finish.

**Expected proposal:** prevent checkout or completion, with an explanation that at least one item is needed.

**Actual:** the empty order reaches `checkout-complete.html` and displays the thank-you confirmation. This establishes the UI behaviour; no backend order-persistence claim is made.

**Evidence:** `CHECK-06` failure and its trace/screenshot.

## F-03 - Name Z-A does not reorder for special personas

**Classification:** reproducible sorting failure for `problem_user` and `error_user`. **Suggested priority:** P2 for the demo; production priority would depend on affected users.

**Reproduce:** use either account with `secret_sauce`. On inventory, select Name (Z to A).

**Expected:** Test.allTheThings() T-Shirt (Red), Sauce Labs Onesie, Sauce Labs Fleece Jacket, Sauce Labs Bolt T-Shirt, Sauce Labs Bike Light, Sauce Labs Backpack.

**Actual:** the products retain A-Z order, beginning with Sauce Labs Backpack. `error_user` also displays a sorting-error dialog; the test records and dismisses it so investigation can continue. Adding and removing the backpack subsequently succeeds for the tested path.

**Evidence:** both `PERSONA-01` failures and structured `persona-sort` attachments. A soft assertion allows the later cart investigation to run but still fails the test.

**Candidate's original observation:** name sorting was suspected for `standard_user`. That could not be reproduced in the tested Chromium session: default order, explicit A-Z/Z-A, both price orders and navigation consistency passed. The special-persona result is not proof that the earlier account was misidentified.

## Q-01 - Meaningful data rules are unspecified

These observations all reached the overview without a validation error:

| Input class               | Example                  | Interpretation                                                                       |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| Surrounding spaces        | `Alex`                   | Spaces remain in the field before submission; downstream trimming is not established |
| Numeric-only names        | `12345`, `67890`         | Accepted; confirm allowed name rules without excluding legitimate names              |
| Punctuation-only names    | `!!!`, `???`             | Accepted; likely data-quality question                                               |
| Very short values         | `A`, `B`, postcode `1`   | Accepted; name length and postcode validity need separate rules                      |
| Long values               | 256 characters per field | No truncation observed in field values; accepted; no maximum was specified           |
| Punctuation-only postcode | `!!!`                    | Accepted; agree country-aware validation                                             |
| Markup-like name          | `<b>Alex</b>`            | Accepted as input; no corresponding rendered markup observed on the overview         |

Input attributes had no declared `maxLength` limit, pattern or HTML `required` constraint. This does not prove there is no JavaScript/backend validation; the actual submitted behaviours above are the evidence. The app does reject empty strings.

Names containing apostrophes, hyphens, accents and a Chinese character passed the baseline checks. UK-style spacing and a leading-zero US example were preserved in the form and allowed to continue. This does not verify an address or mailbox exists. No email field was present.

## Q-02 - Accessibility needs a manual follow-up

Five axe scans found no violations within the selected WCAG A/AA rules on the tested screens. Keyboard login and checkout sequencing passed. The captured focused-postcode screenshot does not show an obvious focus indicator at the reviewed scale. Record this as a manual review question: compare focused/unfocused rendering and assess WCAG focus visibility across all controls. Do not treat automated passes as complete accessibility compliance.

## Environment blockers

| Engine  | Observed blocker                                                                     | Consequence / next action                                                                                              |
| ------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Firefox | Browser process launch returns `spawn UNKNOWN` in this Windows execution environment | Twelve core cases fail before app actions; execute the prepared Ubuntu CI job or a supported local environment         |
| WebKit  | Missing `icuin77.dll`, `libxml2.dll`, `spng.dll`, `jxl.dll`, `libwebpdemux.dll`      | One launch preflight fails; remaining eleven core cases are not attempted locally; execute CI with system dependencies |

These are not cross-browser product failures. No system security settings or TLS verification were weakened to bypass them.
