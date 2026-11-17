# Candidate walkthrough

Use this to understand and review the project before submitting. It is not a claim that this walkthrough has already happened.

## 1. Explain the risk choices

Login enables all other actions. Cart correctness and checkout totals protect the main purchase journey. Sorting was selected because of a candidate-observed concern. Negative data checks establish whether the application validates presence, format and business meaning. Accessibility and browser checks broaden confidence without pretending to certify every user environment.

## 2. Follow one test from beginning to end

Open `tests/checkout.spec.ts`, find `CHECK-02-04` and read it aloud:

1. Sign in in a fresh browser context and add the backpack.
2. Capture the relevant catalogue names and prices, then add the bike light.
3. Open the cart, enter synthetic customer information and review the order.
4. Compare names, prices and quantities with the earlier selection.
5. Sum item prices in cents; compare subtotal and total plus displayed tax.
6. Finish, verify confirmation, return to the cart and verify it is empty.

Ask yourself: which failures would this catch? Which would it miss? For example, consistent wrong pricing at every stage requires a separate trusted price source to detect. A confirmation message cannot prove a backend order exists.

## 3. Understand the small framework

- A **locator** identifies a UI element. `getByRole` uses its user-facing role/name; `getByTestId` uses the app's stable `data-test` attribute.
- An **assertion** checks an expected result. Playwright's locator assertions wait for the result within a timeout.
- A **page object** groups interactions so a selector change is fixed in one place.
- A **fixture** supplies a fresh page object to each test. It does not share cart state.
- A **trace** records execution so you can see the action, page state and failure.
- A **parameterised test** runs the same rule for different inputs, such as each missing checkout field.

## 4. Run and investigate

Run `npm run test:sorting`, open `npm run report`, and inspect the sort evidence attachment. Run one checkout test with the inspector. Explain why a failure is a test bug, product issue or environment issue before changing anything.

For a safe learning exercise, make a temporary change to an expected cart count, run that one test and read the failure. Restore the correct assertion and rerun. Do not commit intentionally wrong assertions.

## 5. Be accurate about AI

Suggested factual explanation: "I used ChatGPT/Codex to help turn a risk-based plan into a Playwright project, inspect the app and run the checks. I raised sorting and meaningful-input validation during planning. I am developing my Playwright proficiency and will explain the parts I have personally reviewed and run."

Only add claims about independent coding or reviewing the full suite after doing those activities. Be prepared to modify a simple test yourself during an interview.

## 6. Connect to Foundation Health

Discuss how deterministic checks validate workflow boundaries while AI evaluations assess output quality over repeat runs. Explain versioned evaluation datasets, human-reviewed scoring, tool-call correctness, refusal/escalation paths and approvals. Keep this distinct from the demonstrated Sauce Demo automation.
