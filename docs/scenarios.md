# Scenario catalogue

This is implementation coverage, not a claim that every test has passed. See `results.md` for actual execution status. Parameterised rows produce separate test cases.

| ID                 | Behaviour                                                                               | File                                 | Scope                                                |
| ------------------ | --------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| AUTH-01            | Valid login, inventory and empty cart                                                   | `auth.spec.ts`                       | Core: all three engines configured                   |
| AUTH-02            | Locked-out account rejected                                                             | `auth.spec.ts`                       | Core                                                 |
| AUTH-03            | Incorrect password rejected                                                             | `auth.spec.ts`                       | Chromium                                             |
| AUTH-04a/b/c       | Missing username, password, both                                                        | `auth.spec.ts`                       | Chromium                                             |
| AUTH-05            | Logout then direct inventory access denied                                              | `auth.spec.ts`                       | Core                                                 |
| AUTH-06            | Logged-out access to inventory, cart and both checkout steps                            | `auth.spec.ts`                       | Chromium, four cases                                 |
| SORT-01            | Initial selected A-Z and complete sequence agree                                        | `sorting.spec.ts`                    | Chromium                                             |
| SORT-02-05         | Explicit A-Z, Z-A, numeric low-high, high-low; preserve product/price pairs             | `sorting.spec.ts`                    | Core, four cases                                     |
| SORT-06 / CART-05  | Repeated sorting preserves inventory and cart selection                                 | `sorting.spec.ts`                    | Chromium                                             |
| SORT-07            | Selected sort label and displayed order agree after cart navigation                     | `sorting.spec.ts`                    | Chromium                                             |
| CART-01            | One item, price, quantity and count                                                     | `cart.spec.ts`                       | Chromium                                             |
| CART-02 / CART-04  | Multiple items persist through navigation and refresh                                   | `cart.spec.ts`                       | Core                                                 |
| CART-03            | Remove from inventory and cart, including empty state                                   | `cart.spec.ts`                       | Chromium                                             |
| CHECK-01 / DATA-10 | Each missing customer field blocks checkout; correction preserves other values          | `checkout.spec.ts`                   | Core, three cases                                    |
| CHECK-02-04        | Multi-item order, quantities, subtotal, tax/total consistency, confirmation, empty cart | `checkout.spec.ts`                   | Core                                                 |
| CHECK-05           | Cancel at information and overview stages                                               | `checkout.spec.ts`                   | Chromium, two cases                                  |
| DATA-03/04/07      | Apostrophe/hyphen/Unicode names, postcode spacing and leading zero                      | `checkout.spec.ts`                   | Chromium, two cases                                  |
| A11Y-01            | Axe WCAG A/AA scan on login, inventory, cart, checkout and checkout error state         | `accessibility.spec.ts`              | Chromium, five cases                                 |
| A11Y-02            | Login accessible names and keyboard flow                                                | `accessibility.spec.ts`              | Chromium                                             |
| A11Y-03            | Checkout keyboard order plus focus screenshot                                           | `accessibility.spec.ts`              | Chromium                                             |
| DATA-01            | Proposed rejection of whitespace-only values in each required field                     | `exploratory/data-quality.spec.ts`   | Three exploratory rule checks                        |
| DATA-02            | Surrounding spaces and retained values                                                  | `exploratory/data-quality.spec.ts`   | Observation                                          |
| DATA-05            | Numeric and punctuation-only names                                                      | `exploratory/data-quality.spec.ts`   | Two observations                                     |
| DATA-06            | Single-character and 256-character values                                               | `exploratory/data-quality.spec.ts`   | Two observations; no invented maximum                |
| DATA-08            | Punctuation-only postcode                                                               | `exploratory/data-quality.spec.ts`   | Observation; country requirements unknown            |
| DATA-09            | Markup-like input, no corresponding rendered markup                                     | `exploratory/data-quality.spec.ts`   | Limited observation, not a security certification    |
| CHECK-06           | Proposed prevention of empty orders                                                     | `exploratory/business-rules.spec.ts` | Exploratory rule check                               |
| CHECK-07           | Rapid Finish clicks and confirmation refresh                                            | `exploratory/business-rules.spec.ts` | Visible state only; no backend duplicate-order claim |
| PERSONA-01         | Z-A sorting and cart removal for problem/error personas                                 | `exploratory/business-rules.spec.ts` | Two exploratory cases                                |

## Deliberate limitations

- Email is not present in the inspected checkout.
- Postcode deliverability, name authenticity and tax policy cannot be established from format/arithmetic alone.
- Focus screenshot collection is not equivalent to a full manual focus-contrast review.
- No screen-reader session or disabled-user study has been performed.
- Core engine checks do not cover all devices, viewports or browser versions.
- Performance, visual baselines, dynamic catalogue and backend/order persistence are follow-up work.
